import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { View, ActionSheetIOS, Alert, Text, ActivityIndicator, SafeAreaView } from 'react-native'
import { Navigation } from 'components/Navigation'
import TableView from 'components/TableView'
import * as walletActions from 'actions/wallet'
import * as producerActions from 'actions/producer'
import * as balanceActions from 'actions/balance'
import * as accountActions from 'actions/account'
import { accountByIdSelector, managingAccountVotedProducersSelector } from 'selectors/account'
import { managingWalletSelector } from 'selectors/wallet'
import Modal from 'react-native-modal'
import Dialog from 'components/Dialog'
import styles from './styles'

const { Section, Item } = TableView

export const errorMessages = (error) => {
  if (!error) { return null }

  const message = typeof error === 'object' ? error.message : error

  switch (String(message)) {
    case 'SegWit requires compressed private key':
      return '隔离见证需要压缩的公钥格式'
    case 'Invalid password':
      return '密码错误'
    default:
      return '操作失败'
  }
}

@injectIntl

@connect(
  state => ({
    getProducer: state.getProducer,
    deleteWallet: state.deleteWallet,
    exportMnemonics: state.exportMnemonics,
    exportBTCPrivateKey: state.exportBTCPrivateKey,
    exportETHKeystore: state.exportETHKeystore,
    exportETHPrivateKey: state.exportETHPrivateKey,
    exportEOSPrivateKey: state.exportEOSPrivateKey,
    switchBTCAddressType: state.switchBTCAddressType,
    account: accountByIdSelector(state),
    wallet: managingWalletSelector(state),
    votedProducers: managingAccountVotedProducersSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...producerActions,
      ...balanceActions,
      ...accountActions
    }, dispatch)
  })
)

export default class ManageWallet extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: '管理钱包'
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

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    if (this.props.fromCard) {
      this.props.actions.setActiveWallet(this.props.wallet.id)
    }
  }

  componentDidMount() {
    const { chain, address } = this.props.wallet

    if (chain === 'EOS') {
      this.props.actions.getBalance.requested(this.props.wallet)

      const account = this.props.account[`${chain}/${address}`]

      if (!account && address && chain) {
        this.props.actions.getAccount.requested({ chain, address })
      }
    }
  }

  deleteWallet = (walletId, chain, address) => {
    const { intl, wallet } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      '将删除该钱包所有数据，请务必确保钱包已备份。',
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_delete' }),
          style: 'destructive',
          onPress: password => this.props.actions.deleteWallet.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, fromCard: this.props.fromCard, chain: wallet.chain, address: wallet.address })
        }
      ],
      'secure-text'
    )
  }

  exportMnemonics = (walletId) => {
    const { intl, wallet } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.exportMnemonics.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: wallet.source })
        }
      ],
      'secure-text'
    )
  }

  exportETHKeystore = (walletId) => {
    const { intl, wallet } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions.exportETHKeystore.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source: wallet.source })
        }
      ],
      'secure-text'
    )
  }

  exportPrivateKey = (walletId, symbol) => {
    const { chain, address, source } = this.props.wallet
    const { intl } = this.props
    const account = this.props.account[`${chain}/${address}`]
    const permissions = account && account.permissions

    Alert.prompt(
      intl.formatMessage({ id: 'alert_input_wallet_password' }),
      null,
      [
        {
          text: intl.formatMessage({ id: 'alert_button_cancel' }),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: intl.formatMessage({ id: 'alert_button_confirm' }),
          onPress: password => this.props.actions[`export${symbol}PrivateKey`].requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, source, address, permissions })
        }
      ],
      'secure-text'
    )
  }

  switchEOSAccount = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SwitchEOSAccount',
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

  switchBTCAddress = async () => {
    const constants = await Navigation.constants()

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.SwitchBTCAddress',
        passProps: {
          statusBarHeight: constants.statusBarHeight
        },
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

  createNewAccount = () => {
    /* Navigation.showModal({
     *   stack: {
     *     children: [{
     *       component: {
     *         name: 'BitPortal.CreateEOSAccount'
     *       },
     *       options: {
     *         topBar: {
     *           backButton: {
     *             title: '返回'
     *           }
     *         }
     *       }
     *     }]
     *   }
     * })*/
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

  vote = async () => {
    if (this.props.getProducer.loaded) this.props.actions.setSelected(this.props.votedProducers)
    this.props.actions.handleProducerSearchTextChange('')
    const constants = await Navigation.constants()

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.Voting',
            passProps: { statusBarHeight: constants.statusBarHeight }
          },
          options: {
            topBar: {
              searchBar: true,
              searchBarHiddenWhenScrolling: false,
              searchBarPlaceholder: 'Search'
            }
          }
        }]
      }
    })
  }

  manageResource = () => {
    const { chain, id, address } = this.props.wallet

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ManageEOSResource',
        passProps: { chain, walletId: id, address },
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

  clearError = () => {
    this.props.actions.deleteWallet.clearError()
    this.props.actions.exportMnemonics.clearError()
    this.props.actions.exportBTCPrivateKey.clearError()
    this.props.actions.exportETHKeystore.clearError()
    this.props.actions.exportETHPrivateKey.clearError()
    this.props.actions.exportEOSPrivateKey.clearError()
    this.props.actions.switchBTCAddressType.clearError()
  }

  onModalHide = () => {
    const deleteWalletError = this.props.deleteWallet.error
    const exportMnemonicsError = this.props.exportMnemonics.error
    const exportBTCPrivateKeyError = this.props.exportBTCPrivateKey.error
    const exportETHKeystoreError = this.props.exportETHKeystore.error
    const exportETHPrivateKeyError = this.props.exportETHPrivateKey.error
    const exportEOSPrivateKeyError = this.props.exportEOSPrivateKey.error
    const switchBTCAddressTypeError = this.props.switchBTCAddressType.error
    const error = deleteWalletError || exportMnemonicsError || exportBTCPrivateKeyError || exportETHKeystoreError || exportETHPrivateKeyError || exportEOSPrivateKeyError || switchBTCAddressTypeError

    if (error) {
      setTimeout(() => {
        Alert.alert(
          errorMessages(error),
          '',
          [
            { text: '确定', onPress: () => this.clearError() }
          ]
        )
      }, 20)
    }
  }

  switchBTCAddressType = (walletId) => {
    const { intl, wallet } = this.props
    const segWit = wallet && wallet.segWit
    const source = wallet && wallet.source

    ActionSheetIOS.showActionSheetWithOptions({
      title: '切换地址类型',
      options: ['取消', `隔离见证`, `普通`],
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        if (segWit !== 'P2WPKH') {
          Alert.prompt(
            intl.formatMessage({ id: 'alert_input_wallet_password'}),
            null,
            [
              {
                text: intl.formatMessage({ id: 'alert_button_cancel' }),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: intl.formatMessage({ id: 'alert_button_confirm' }),
                onPress: password => this.props.actions.switchBTCAddressType.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, segWit, source })
              }
            ],
            'secure-text'
          )
        }
      } else if (buttonIndex === 2) {
        if (segWit === 'P2WPKH') {
          Alert.prompt(
            intl.formatMessage({ id: 'alert_input_wallet_password' }),
            null,
            [
              {
                text: intl.formatMessage({ id: 'alert_button_cancel' }),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: intl.formatMessage({ id: 'alert_button_confirm' }),
                onPress: password => this.props.actions.switchBTCAddressType.requested({ id: walletId, password, delay: 500, componentId: this.props.componentId, segWit, source })
              }
            ],
            'secure-text'
          )
        }
      }
    })
  }

  onItemNotification = (data) => {
    const { intl } = this.props
    const { action } = data

    if (action === 'toEditWallet') {
      const { name } = data
      const oldName = name

      Alert.prompt(
        '设置钱包名称',
        null,
        [
          {
            text: intl.formatMessage({ id: 'alert_button_cancel' }),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: intl.formatMessage({ id: 'alert_button_confirm' }),
            onPress: name => {
              if (name) {
                if (name.length > 30) {
                  Alert.alert(
                    '钱包名称不能超过30个字符',
                    '',
                    [
                      { text: '确定', onPress: () => console.log('ok') }
                    ]
                  )
                } else {
                  this.props.actions.setWalletName.requested({ oldName, name, id: this.props.wallet.id })
                }
              }
            }
          }
        ],
        'plain-text',
        name
      )
    }
  }

  chainxDeposit = async (walletId) => {
    const constants = await Navigation.constants()

    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.ChainXDeposit',
            passProps: {
              statusBarHeight: constants.statusBarHeight
            }
          }
        }]
      }
    })
  }

  chainxVoting = async (walletId) => {
    const constants = await Navigation.constants()

    Navigation.push(this.props.componentId, {
      component: {
        name: 'BitPortal.ChainXVoting'
      },
      options: {
        topBar: {
          searchBar: false,
          searchBarHiddenWhenScrolling: false,
          searchBarPlaceholder: 'Search'
        }
      }
    })
    //
    // Navigation.showModal({
    //   stack: {
    //     children: [{
    //       component: {
    //         name: 'BitPortal.ChainXVoting'
    //       },
    //       options: {
    //         topBar: {
    //           searchBar: true,
    //           searchBarHiddenWhenScrolling: false,
    //           searchBarPlaceholder: 'Search'
    //         }
    //       }
    //     }]
    //   }
    // })
  }

  chainxWithdrawal = async () => {
    Dialog.alert('Tips', 'Coming Soon')
    return
    const constants = await Navigation.constants()

    Navigation.push({
      component: {
        name: 'BitPortal.ChainxWithdrawal'
      },
      options: {
        topBar: {
          searchBar: true,
          searchBarHiddenWhenScrolling: false,
          searchBarPlaceholder: 'Search'
        }
      }
    })
  }

  chainxToStats = async () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: {
              url: 'https://stats.chainx.org/#/ChainX?utm=bitportal'
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainX 节点状态'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  chainxToScan = async () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: {
              url: 'https://scan.chainx.org?utm=bitportal'
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainX 区块链浏览器'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  chainxToChainXTool = async () => {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'BitPortal.WebView',
            passProps: {
              url: 'https://chainxtools.com?utm=bitportal'
            },
            options: {
              topBar: {
                title: {
                  text: 'ChainXTool'
                },
                leftButtons: [
                  {
                    id: 'cancel',
                    text: '取消'
                  }
                ]
              }
            }
          }
        }]
      }
    })
  }

  render() {
    const { intl, type, deleteWallet, exportMnemonics, exportBTCPrivateKey, exportETHKeystore, exportETHPrivateKey, exportEOSPrivateKey, switchBTCAddressType, wallet } = this.props
    const name = wallet && wallet.name
    const address = wallet && wallet.address
    const chain = wallet && wallet.chain
    const source = wallet && wallet.source
    const id = wallet && wallet.id
    const symbol = wallet && wallet.symbol
    const segWit = wallet && wallet.segWit

    const deleteWalletLoading = deleteWallet.loading
    const exportMnemonicsLoading = exportMnemonics.loading
    const exportBTCPrivateKeyLoading = exportBTCPrivateKey.loading
    const exportETHKeystoreLoading = exportETHKeystore.loading
    const exportETHPrivateKeyLoading = exportETHPrivateKey.loading
    const exportEOSPrivateKeyLoading = exportEOSPrivateKey.loading
    const switchBTCAddressTypeLoading = switchBTCAddressType.loading
    const loading = deleteWalletLoading || exportMnemonicsLoading || exportBTCPrivateKeyLoading || exportETHKeystoreLoading || exportETHPrivateKeyLoading || exportEOSPrivateKeyLoading || switchBTCAddressTypeLoading

    const editActions = []
    const accountActions = []
    const exportActions = []

    if (chain === 'EOS') {
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="vote"
          actionType="vote"
          text={intl.formatMessage({ id: 'manage_wallet_title_eos_voting' })}
          onPress={this.vote}
          arrow
        />
      )

      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="resources"
          actionType="resources"
          text={intl.formatMessage({ id: 'manage_wallet_title_eos_resource' })}
          onPress={this.manageResource}
          arrow
        />
      )


      if (source === 'RECOVERED_IDENTITY' || source === 'NEW_IDENTITY') {
        accountActions.push(
          <Item
            reactModuleForCell="WalletManagementTableViewCell"
            key="switchAccount"
            actionType="switchAccount"
            text={intl.formatMessage({ id: 'manage_wallet_title_eos_switch_account' })}
            onPress={this.switchEOSAccount}
            arrow
          />
        )

        accountActions.push(
          <Item
            reactModuleForCell="WalletManagementTableViewCell"
            key="createAccount"
            actionType="createAccount"
            onPress={this.createNewAccount}
            text={intl.formatMessage({ id: 'manage_wallet_title_eos_create_account' })}
            arrow
          />
        )
      }
    }

    if (chain === 'BITCOIN') {
      if (source !== 'WIF') {
        editActions.push(
          <Item
            reactModuleForCell="WalletManagementTableViewCell"
            key="address"
            actionType="address"
            text={intl.formatMessage({ id: 'manage_wallet_title_wallet_address' })}
            onPress={this.switchBTCAddress}
            arrow
          />
        )
      }

      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="addressType"
          actionType="addressType"
          text={intl.formatMessage({ id: 'manage_wallet_title_switch_address_type' })}
          detail={segWit === 'P2WPKH' ? intl.formatMessage({ id: 'manage_wallet_type_btc_address_segwit' }) : intl.formatMessage({ id: 'manage_wallet_type_btc_address_common' })}
          onPress={this.switchBTCAddressType.bind(this, id)}
          arrow
        />
      )
    }

    if (source === 'RECOVERED_IDENTITY' || source === 'NEW_IDENTITY' || source === 'MNEMONIC') {
      exportActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="mnemonic"
          actionType="mnemonic"
          text={intl.formatMessage({ id: 'manage_wallet_title_backup_mnemonics' })}
          onPress={this.exportMnemonics.bind(this, id)}
          arrow
        />
      )
    }

    if (source === 'PRIVATE' || source === 'WIF' || source === 'KEYSTORE' || chain === 'ETHEREUM' || chain === 'EOS') {
      exportActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="privateKey"
          actionType="privateKey"
          text={intl.formatMessage({ id: 'manage_wallet_title_export_private_key' })}
          onPress={this.exportPrivateKey.bind(this, id, symbol)}
          arrow
        />
      )
    }

    if (chain === 'ETHEREUM') {
      exportActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="keystore"
          actionType="keystore"
          text={intl.formatMessage({ id: 'manage_wallet_title_export_keysotre' })}
          onPress={this.exportETHKeystore.bind(this, id)}
          arrow
        />
      )
    }

    if (chain === 'CHAINX') {
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="chainxDeposit"
          actionType="chainxDeposit"
          text={intl.formatMessage({ id: 'manage_wallet_title_chainx_deposit_mine' })}
          onPress={this.chainxDeposit.bind(this, id)}
          arrow
        />
      )
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="chainxVoting"
          actionType="chainxVoting"
          text={intl.formatMessage({ id: 'manage_wallet_title_chainx_voting' })}
          onPress={this.chainxVoting.bind(this, id)}
          arrow
        />
      )
      editActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="chainxWithdrawal"
          actionType="chainxWithdrawal"
          text={intl.formatMessage({ id: 'manage_wallet_title_chainx_withdraw' })}
          onPress={this.chainxWithdrawal.bind(this, id)}
          arrow
        />
      )
      accountActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="chainxScan"
          actionType="chainxScan"
          text={intl.formatMessage({ id: 'manage_wallet_title_chainx_explorer' })}
          onPress={this.chainxToScan.bind(this, id)}
          arrow
        />
      )
      accountActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="chainxStats"
          actionType="chainxStats"
          text={intl.formatMessage({ id: 'manage_wallet_title_chainx_stats' })}
          onPress={this.chainxToStats.bind(this, id)}
          arrow
        />
      )
      accountActions.push(
        <Item
          reactModuleForCell="WalletManagementTableViewCell"
          key="chainxTool"
          actionType="chainxTool"
          text="ChainXTool"
          onPress={this.chainxToChainXTool.bind(this, id)}
          arrow
        />
      )
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TableView
          style={{ flex: 1 }}
          tableViewStyle={TableView.Consts.Style.Grouped}
          tableViewCellStyle={TableView.Consts.CellStyle.Value1}
          detailTextColor="#666666"
          showsVerticalScrollIndicator={false}
          moveWithinSectionOnly
          cellSeparatorInset={{ left: 61 }}
          onItemNotification={this.onItemNotification}
        >
          <Section />
          <Section>
            <Item
              height={78}
              selectionStyle={TableView.Consts.CellSelectionStyle.None}
              name={name}
              address={address}
              chain={chain}
              reactModuleForCell="WalletManagementTableViewCell"
              componentId={this.props.componentId}
            />
          </Section>
          {editActions.length > 0 && <Section>
            {editActions}
          </Section>}
          {accountActions.length > 0 && <Section>
            {accountActions}
          </Section>}
          {exportActions.length > 0 && <Section>
            {exportActions}
          </Section>}
          {!(source === 'RECOVERED_IDENTITY' || source === 'NEW_IDENTITY') && <Section>
            <Item
              reactModuleForCell="WalletManagementTableViewCell"
              key="delete"
              actionType="delete"
              text={intl.formatMessage({ id: 'manage_wallet_text_delete_wallet' })}
              onPress={this.deleteWallet.bind(this, id, chain, address)}
              arrow
            />
          </Section>}
        </TableView>
        <Modal
          isVisible={loading}
          backdropOpacity={0.4}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
          onModalHide={this.onModalHide}
        >
          {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, alignItem: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <ActivityIndicator size="small" color="#000000" />
              {deleteWalletLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>验证密码...</Text>}
              {switchBTCAddressTypeLoading && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>切换中...</Text>}
              {(!deleteWalletLoading && !switchBTCAddressTypeLoading) && <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: 'bold' }}>导出中...</Text>}
            </View>
          </View>}
        </Modal>
      </SafeAreaView>
    )
  }
}
