import React from 'react'
import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Navigation } from 'components/Navigation'

const HeaderTableViewCell = (props) => {
  toAddAsset = () => {
    const { chain } = props.data

    if (chain === 'ETHEREUM' || chain === 'EOS' || chain === 'CHAINX') {
      let symbol

      if (chain === 'ETHEREUM') {
        symbol = 'ETH'
      } else if (chain === 'EOS') {
        symbol = 'EOS'
      } else if (chain === 'CHAINX') {
        symbol = 'PCX'
      }

      Navigation.push(props.data.componentId, {
        component: {
          name: 'BitPortal.AddAssets',
          options: {
            topBar: {
              title: {
                text: `添加${symbol}资产`
              }
            }
          }
        }
      })
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 15, opacity: props.data.switching ? 0.4 : 1 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {props.data.loading && <ActivityIndicator size="small" color="black" style={{ marginRight: 4 }} />}
        {props.data.loading && <Text style={{ fontSize: 20 }}>{props.data.loadingTitle}</Text>}
        {!props.data.loading && <Text style={{ fontSize: 20 }}>{props.data.title}</Text>}
      </View>
      {props.data.hasRightButton && <TouchableHighlight underlayColor="rgba(255,255,255,0)" activeOpacity={0.42} onPress={!props.data.switching ? this.toAddAsset : () => {}} style={{ height: '100%', width: 55, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 15 }}>
        <FastImage
          source={require('resources/images/add_contact.png')}
          style={{ width: 22, height: 22 }}
        />
      </TouchableHighlight>}
    </View>
  )
}

export default HeaderTableViewCell
