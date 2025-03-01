import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { View, Text, ActivityIndicator, Alert, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import Modal from 'react-native-modal'
import { managingWalletSelector } from 'selectors/wallet'
import { managingWalletAddressSelector, managingWalletChildAddressSelector } from 'selectors/address'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as addressActions from 'actions/address'

const { Section, Item } = TableView

@connect(
  state => ({
    scanHDAddresses: state.scanHDAddresses,
    wallet: managingWalletSelector(state),
    addresses: managingWalletAddressSelector(state),
    childAddress: managingWalletChildAddressSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...addressActions
    }, dispatch)
  })
)

export default class SwitchBTCAddress extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'BTC钱包地址'
        },
        backButton: {
          title: '返回'
        },
        largeTitle: {
          visible: false
        }
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  selectBTCAddress = (address) => {
    const { wallet } = this.props

    if (wallet) {
      this.props.actions.updateChildAddress({ id: `${wallet.chain}/${wallet.address}`, address })
    }
  }

  componentDidMount() {
    const { wallet, addresses } = this.props

    if (!addresses && wallet) {
      this.props.actions.scanHDAddresses.requested(wallet)
    }
  }

  render() {
    const { wallet, addresses, statusBarHeight, childAddress } = this.props
    const address = childAddress || (wallet && wallet.address)

    if (!addresses) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="small" color="#000000" />
            <Text style={{ fontSize: 17, marginLeft: 5 }}>扫描地址中...</Text>
          </View>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        <View style={{ width: '100%', padding: 16, borderColor: '#C8C7CC', borderBottomWidth: 0.5, backgroundColor: '#F0EFF5' }}>
          <Text style={{ fontSize: 14, color: '#666666', lineHeight: 18 }}>你可以使用不同的子地址用于收款，以保护你的隐私。选中的子地址将会显示在收款界面。</Text>
        </View>
        <TableView
          style={{ flex: 1, backgroundColor: 'white' }}
          tableViewStyle={TableView.Consts.Style.Default}
          reactModuleForCell="SwitchBTCAddressTableViewCell"
        >
          <Section>
            {addresses.map(item =>
              <Item
                height={60}
                key={item.address}
                onPress={this.selectBTCAddress.bind(this, item.address)}
                selectionStyle={item.address === address ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default}
                accessoryType={item.address === address ? TableView.Consts.AccessoryType.Checkmark : TableView.Consts.AccessoryType.None}
                address={item.address}
                change={item.change}
                index={item.index}
              />
             )}
          </Section>
        </TableView>
      </View>
      </SafeAreaView>
    )
  }
}
