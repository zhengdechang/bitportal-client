import accumulative from '../accumulative'
import blackjack from '../blackjack'
import shuffle from 'fisher-yates'
import shuffleInplace from 'fisher-yates/inplace'
import coinSelect from '../'
import utils from '../utils'

function blackmax (utxos, outputs, feeRate) {
  // order by ascending value
  utxos = utxos.concat().sort((a, b) => a.value - b.value)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

function blackmin (utxos, outputs, feeRate) {
  // order by descending value
  utxos = utxos.concat().sort((a, b) => b.value - a.value)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

function blackrand (utxos, outputs, feeRate) {
  utxos = shuffle(utxos)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

function maximal (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort((a, b) => a.value - b.value)

  return accumulative(utxos, outputs, feeRate)
}

function minimal (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort((a, b) => b.value - a.value)

  return accumulative(utxos, outputs, feeRate)
}

function FIFO (utxos, outputs, feeRate) {
  utxos = utxos.concat().reverse()

  return accumulative(utxos, outputs, feeRate)
}

function proximal (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  utxos = utxos.concat().sort((a, b) => {
    let aa = a.value - outAccum
    let bb = b.value - outAccum

    return aa - bb
  })

  return accumulative(utxos, outputs, feeRate)
}

// similar to bitcoind
function random (utxos, outputs, feeRate) {
  utxos = shuffle(utxos)

  return accumulative(utxos, outputs, feeRate)
}

function bestof (utxos, outputs, feeRate) {
  let n = 100
  let utxosCopy = utxos.concat()
  let best = { fee: Infinity }

  while (n) {
    shuffleInplace(utxosCopy)

    let result = accumulative(utxos, outputs, feeRate)
    if (result.inputs && result.fee < best.fee) {
      best = result
    }

    --n
  }

  return best
}

function utxoScore (x, feeRate) {
  return x.value - (feeRate * utils.inputBytes(x))
}

function privet (utxos, outputs, feeRate) {
  let txosMap = {}
  utxos.forEach((txo) => {
    if (!txosMap[txo.address]) {
      txosMap[txo.address] = []
    }

    txosMap[txo.address].push(txo)
  })

  // order & summate sets
  for (var address in txosMap) {
    txosMap[address] = txosMap[address].sort((a, b) => {
      return utxoScore(b, feeRate) - utxoScore(a, feeRate)
    })
    txosMap[address].value = txosMap[address].reduce((a, x) => a + x.value, 0)
  }

  utxos = [].concat.apply([], Object.keys(txosMap).map(x => txosMap[x]))

  // only use accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

export default {
  accumulative,
  bestof,
  blackjack,
  blackmax,
  blackmin,
  blackrand,
  coinSelect,
  FIFO,
  maximal,
  minimal,
  privet,
  proximal,
  random
}
