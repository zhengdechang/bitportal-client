import { web3 } from 'core/api'
const { sha3, BN } = web3.utils
const abiCoder = web3.eth.abi

const state = {
  savedABIs: [],
  methodIDs: {}
}

export function getABIs() {
  return state.savedABIs
}

export function addABI(abiArray) {
  if (Array.isArray(abiArray)) {
    // Iterate new abi to generate method id"s
    abiArray.map(function(abi) {
      if (abi.name) {
        const signature = sha3(
          abi.name +
            "(" +
            abi.inputs
              .map(function(input) {
                return input.type;
              })
              .join(",") +
            ")"
        )
        if (abi.type === "event") {
          state.methodIDs[signature.slice(2)] = abi
        } else {
          state.methodIDs[signature.slice(2, 10)] = abi
        }
      }
    })

    state.savedABIs = state.savedABIs.concat(abiArray)
  } else {
    throw new Error("Expected ABI array, got " + typeof abiArray)
  }
}

export function removeABI(abiArray) {
  if (Array.isArray(abiArray)) {
    // Iterate new abi to generate method id"s
    abiArray.map(function(abi) {
      if (abi.name) {
        const signature = sha3(
          abi.name +
            "(" +
            abi.inputs
              .map(function(input) {
                return input.type;
              })
              .join(",") +
            ")"
        )
        if (abi.type === "event") {
          if (state.methodIDs[signature.slice(2)]) {
            delete state.methodIDs[signature.slice(2)]
          }
        } else {
          if (state.methodIDs[signature.slice(2, 10)]) {
            delete state.methodIDs[signature.slice(2, 10)]
          }
        }
      }
    })
  } else {
    throw new Error("Expected ABI array, got " + typeof abiArray)
  }
}

export function getMethodIDs() {
  return state.methodIDs
}

export function decodeMethod(data) {
  const methodID = data.slice(2, 10);
  const abiItem = state.methodIDs[methodID]
  if (abiItem) {
    const params = abiItem.inputs.map(function(item) {
      return item.type;
    })
    let decoded = abiCoder.decodeParameters(params, '0x' + data.slice(10))

    let retData = {
      name: abiItem.name,
      params: []
    }

    for (let i = 0; i < decoded.__length__; i++) {
      let param = decoded[i]
      let parsedParam = param
      const isUint = abiItem.inputs[i].type.indexOf("uint") === 0
      const isInt = abiItem.inputs[i].type.indexOf("int") === 0
      const isAddress = abiItem.inputs[i].type.indexOf("address") === 0

      if (isUint || isInt) {
        const isArray = Array.isArray(param)

        if (isArray) {
          parsedParam = param.map(val => new BN(val).toString())
        } else {
          parsedParam = new BN(param).toString()
        }
      }

      // Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
      if (isAddress) {
        const isArray = Array.isArray(param)

        if (isArray) {
          parsedParam = param.map(_ => _.toLowerCase())
        } else {
          parsedParam = param.toLowerCase()
        }
      }

      retData.params.push({
        name: abiItem.inputs[i].name,
        value: parsedParam,
        type: abiItem.inputs[i].type
      })
    }

    return retData
  }
}

export function decodeLogs(logs) {
  return logs.filter(log => log.topics.length > 0).map((logItem) => {
    const methodID = logItem.topics[0].slice(2)
    const method = state.methodIDs[methodID]
    if (method) {
      const logData = logItem.data
      let decodedParams = []
      let dataIndex = 0
      let topicsIndex = 1

      let dataTypes = []
      method.inputs.map(function(input) {
        if (!input.indexed) {
          dataTypes.push(input.type)
        }
      });

      const decodedData = abiCoder.decodeParameters(
        dataTypes,
        logData.slice(2)
      )

      // Loop topic and data to get the params
      method.inputs.map(function(param) {
        let decodedP = {
          name: param.name,
          type: param.type
        }

        if (param.indexed) {
          decodedP.value = logItem.topics[topicsIndex]
          topicsIndex++
        } else {
          decodedP.value = decodedData[dataIndex]
          dataIndex++
        }

        if (param.type === "address") {
          decodedP.value = decodedP.value.toLowerCase()
          // 42 because len(0x) + 40
          if (decodedP.value.length > 42) {
            let toRemove = decodedP.value.length - 42;
            let temp = decodedP.value.split("")
            temp.splice(2, toRemove);
            decodedP.value = temp.join("")
          }
        }

        if (
          param.type === "uint256" ||
          param.type === "uint8" ||
          param.type === "int"
        ) {
          decodedP.value = new BN(decodedP.value).toString(10)
        }

        decodedParams.push(decodedP)
      })

      return {
        name: method.name,
        events: decodedParams,
        address: logItem.address
      }
    }
  })
}
