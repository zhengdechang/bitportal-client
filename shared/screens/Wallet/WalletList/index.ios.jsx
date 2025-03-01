import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ActionSheetIOS } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import { identityWalletSelector, importedWalletSelector, hasIdentityEOSWalletSelector } from 'selectors/wallet'
// import FastImage from 'react-native-fast-image'
import * as walletActions from 'actions/wallet'
import * as accountActions from 'actions/account'
import * as keyAccountActions from 'actions/keyAccount'
import styles from './styles'

const { Section, Item } = TableView

@injectIntl

@connect(
  state => ({
    identity: state.identity,
    syncingEOSAccount: state.getKeyAccount.loading,
    identityWallets: identityWalletSelector(state),
    importedWallets: importedWalletSelector(state),
    hasIdentityEOSWallet: hasIdentityEOSWalletSelector(state),
    activeWalletId: state.wallet.activeWalletId
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...accountActions,
      ...keyAccountActions
    }, dispatch)
  })
)

export default class WalletList extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '管理钱包列表'
        },
        leftButtons: [
          {
            id: 'cancel',
            text: '取消'
          }
        ],
        largeTitle: {
          displayMode: 'never'
        }
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  tableViewRef = React.createRef()

  pendingAssetQueue = []

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'cancel') {
      Navigation.dismissModal(this.props.componentId)
    } else if (buttonId === 'edit') {
      // this.setState({ editting: true })
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'done',
              text: '完成'
            }
          ]
        }
      })
    } else if (buttonId === 'done') {
      // this.setState({ editting: false })
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          rightButtons: [
            {
              id: 'edit',
              text: '编辑'
            }
          ]
        }
      })
    }
  }

  searchBarUpdated({ text }) {
    // this.setState({ searching: isFocused })
    if (this.pendingAssetQueue.length) {
      this.props.actions.toggleEOSAssetList(this.pendingAssetQueue)
      this.pendingAssetQueue = []
    }
    this.props.actions.searchEOSAssetRequested(text)
  }

  toAddIdentity = () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.AddIdentity'
          }
        }]
      }
    })
  }

  toSelectChainType = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SelectChainType'
      }
    })
  }

  toManageWallet = (walletInfo) => {
    this.props.actions.setManagingWallet(walletInfo.id)

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ManageWallet',
        passProps: { ...walletInfo },
        options: {
          topBar: {
            backButton: {
              title: '返回'
            }
          }
        }
      }
    })
  }

  onItemNotification = (data) => {
    const { action } = data

    if (action === 'toManageWallet') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'BitPortal.ManageWallet',
          options: {
            topBar: {
              backButton: {
                title: '返回'
              }
            }
          }
        }
      })
    } else if (action === 'switchWallet') {

    }
  }

  switchWallet = (walletId) => {
    this.props.actions.setActiveWallet(walletId)
    Navigation.dismissAllModals()
  }

  createEOSAccount = (walletId) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.CreateEOSAccount',
        options: {
          topBar: {
            backButton: {
              title: '返回'
            }
          }
        }
      }
    })
  }

  componentDidMount() {
    if (!this.props.hasIdentityEOSWallet) {
      const { identityWallets } = this.props
      const index = identityWallets.findIndex((wallet: any) => wallet.chain === 'EOS')
      const wallet = identityWallets[index]
      this.props.actions.getKeyAccount.requested(wallet)
    }
  }

  render() {
    const { identityWallets, importedWallets, activeWalletId, intl, syncingEOSAccount } = this.props
    const identityWalletsCount = identityWallets.length
    const importedWalletsCount = importedWallets.length

    return (
      <View style={styles.container}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
          tableViewCellStyle={TableView.Consts.CellStyle.Default}
          detailTextColor="#666666"
          showsVerticalScrollIndicator={false}
          cellSeparatorInset={{ left: 16 }}
          reactModuleForCell="WalletTableViewCell"
          onItemNotification={this.onItemNotification}
          moveWithinSectionOnly
        >
          <Section />
          {!identityWalletsCount && <Section>
            <Item
              height={44}
              onPress={this.toAddIdentity}
              type="add"
              text={intl.formatMessage({ id: 'general_title_add_identity' })}
            />
          </Section>}
          {identityWalletsCount && <Section label={intl.formatMessage({ id: 'general_title_identity_wallet' })}>
            {identityWallets.map(wallet => <Item
                height={60}
                key={wallet.id}
                uid={wallet.id}
                name={wallet.name}
                symbol={wallet.symbol}
                chain={wallet.chain}
                isSegwit={wallet.symbol === 'BTC' && wallet.segWit === 'P2WPKH'}
                address={wallet.address}
                segWit={wallet.segWit}
                source={wallet.source}
                componentId={this.props.componentId}
                isSelected={wallet.id === activeWalletId}
                syncingEOSAccount={syncingEOSAccount}
                selectionStyle={(wallet.chain !== 'EOS' || !!wallet.address) ? TableView.Consts.CellSelectionStyle.Default : (syncingEOSAccount ? TableView.Consts.CellSelectionStyle.None : TableView.Consts.CellSelectionStyle.Default)}
                accessoryType={(wallet.chain !== 'EOS' || !!wallet.address) ? TableView.Consts.AccessoryType.DetailButton : (syncingEOSAccount ? TableView.Consts.AccessoryType.None : TableView.Consts.AccessoryType.DisclosureIndicator)}
                onPress={(wallet.chain !== 'EOS' || !!wallet.address) ? this.switchWallet.bind(this, wallet.id) : (syncingEOSAccount ? () => {} : this.createEOSAccount.bind(this, wallet.id))}
                onAccessoryPress={(wallet.chain !== 'EOS' || !!wallet.address) ? this.toManageWallet.bind(this, {
                  id: wallet.id,
                  type: 'identity',
                  name: wallet.name,
                  address: wallet.address,
                  chain: wallet.chain,
                  symbol: wallet.symbol,
                  segWit: wallet.segWit,
                  source: wallet.source,
                }) : () => {}}
            />
            )}
          </Section>}
          <Section label={importedWalletsCount ? intl.formatMessage({ id: 'general_title_import_wallet' }) : ''}>
            {importedWallets.map(wallet => <Item
                height={60}
                key={wallet.id}
                uid={wallet.id}
                name={wallet.name}
                symbol={wallet.symbol}
                chain={wallet.chain}
                isSegwit={wallet.symbol === 'BTC' && wallet.segWit === 'P2WPKH'}
                address={wallet.address}
                segWit={wallet.segWit}
                source={wallet.source}
                componentId={this.props.componentId}
                isSelected={wallet.id === activeWalletId}
                accessoryType={(wallet.chain !== 'EOS' || !!wallet.address) ? TableView.Consts.AccessoryType.DetailButton : TableView.Consts.AccessoryType.DisclosureIndicator}
                onPress={(wallet.chain !== 'EOS' || !!wallet.address) ? this.switchWallet.bind(this, wallet.id) : this.createEOSAccount.bind(this, wallet.id)}
                onAccessoryPress={(wallet.chain !== 'EOS' || !!wallet.address) ? this.toManageWallet.bind(this, {
                  id: wallet.id,
                  type: 'imported',
                  name: wallet.name,
                  address: wallet.address,
                  chain: wallet.chain,
                  symbol: wallet.symbol,
                  segWit: wallet.segWit,
                  source: wallet.source,
                }) : () => {}}
              />
            )}
            <Item
              height={44}
              onPress={this.toSelectChainType}
              type="add"
              text={intl.formatMessage({ id: 'wallet_list_text_import_wallet' })}
            />
          </Section>
        </TableView>
      </View>
    )
  }
}
