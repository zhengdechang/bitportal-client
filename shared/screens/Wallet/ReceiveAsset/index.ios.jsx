import React, { Component } from 'react'
import { bindActionCreators } from 'utils/redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  Clipboard,
  ActionSheetIOS,
  SegmentedControlIOS,
  SafeAreaView
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector } from 'selectors/balance'
import { managingWalletChildAddressSelector } from 'selectors/address'
import { activeAssetSelector } from 'selectors/asset'
import { Navigation } from 'components/Navigation'
import QRCode from 'react-native-qrcode-svg'
import EStyleSheet from 'react-native-extended-stylesheet'
import * as transactionActions from 'actions/transaction'
import Sound from 'react-native-sound'
import Modal from 'react-native-modal'

Sound.setCategory('Playback')
const copySound = new Sound('copy.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error)
    return
  }

  console.log(`duration in seconds: ${copySound.getDuration()}number of channels: ${copySound.getNumberOfChannels()}`)
})

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  }
})

@injectIntl

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    activeAsset: activeAssetSelector(state),
    balance: activeWalletBalanceSelector(state),
    childAddress: managingWalletChildAddressSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
    }, dispatch)
  })
)

export default class ReceiveAsset extends Component {
  static get options() {
    return {
      topBar: {
        largeTitle: {
          visible: false
        },
        backButton: {
          title: '返回'
        },
        rightButtons: [
          {
            id: 'share',
            icon: require('resources/images/share.png')
          }
        ]
      },
      bottomTabs: {
        visible: false
      }
    }
  }

  subscription = Navigation.events().bindComponent(this)

  state = {
    showModal: false,
    showModalContent: false,
    amount: 0,
    selectedIndex: 0
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'share') {
      const { activeWallet, activeAsset } = this.props
      const chain = activeWallet.chain
      const address = activeWallet.address
      const contract = activeAsset.contract
      const symbol = activeAsset.symbol

      ActionSheetIOS.showShareActionSheetWithOptions({
        message: this.getAddressUri(address, this.state.amount, chain, contract, symbol)
      }, () => {}, () => {})
    } else if (buttonId === 'cancel') {
      Navigation.dismissAllModals()
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  copy = (address) => {
    this.setState({ showModal: true, showModalContent: true }, () => {
      Clipboard.setString(address)
      copySound.play((success) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
          copySound.reset()
        }
      })

      setTimeout(() => {
        this.setState({ showModal: false }, () => {
          this.setState({ showModalContent: false })
        })
      }, 1000)
    })
  }

  setAmount = () => {
    const { intl } = this.props
    Alert.prompt(
      intl.formatMessage({ id: 'receive_alert_title_input_amount' }),
      null,
      [
        {
          text: '取消',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '确认',
          onPress: amount => this.setState({ amount })
        }
      ],
      'plain-text',
      '',
      'numeric'
    )
  }

  getAddressFontSize = (address) => {
    if (address.length > 40) {
      return 13
    } else if (address.length < 20) {
      return 17
    } else {
      return 15
    }
  }

  getAddressUri = (address, amount, chain, contract, symbol) => {
    const params = {}
    if (amount) params.amount = amount
    if (contract) params.contract = contract
    if (symbol) params.symbol = symbol
    const queryString = Object.keys(params).map(k => [k, params[k]].join('=')).join('&')

    if (!!queryString) {
      return `${chain.toLowerCase()}:${address}?${queryString}`
    }

    return `${chain.toLowerCase()}:${address}`
  }

  changeSelectedIndex = (e) => {
    this.setState({ selectedIndex: e.nativeEvent.selectedSegmentIndex })
  }

  render() {
    const { intl, activeWallet, activeAsset, balance, childAddress, statusBarHeight } = this.props
    const symbol = activeAsset.symbol
    const chain = activeWallet.chain
    const available = balance && intl.formatNumber(balance.balance, { minimumFractionDigits: balance.precision, maximumFractionDigits: balance.precision })
    const address = activeWallet.address
    const hasChildAddress = childAddress && childAddress !== address
    const contract = activeAsset.contract
    const addressUri = this.getAddressUri(!this.state.selectedIndex ? address : childAddress, this.state.amount, chain, contract, symbol)
    const value1 = intl.formatMessage({ id: 'receive_btc_text_main_address' })
    const value2 = intl.formatMessage({ id: 'receive_btc_text_second_address' })

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        {hasChildAddress && chain === 'BITCOIN' && <View style={{ height: 52, width: '100%', justifyContent: 'center', paddingTop: 5, paddingBottom: 13, paddingLeft: 16, paddingRight: 16, backgroundColor: '#F7F7F7', borderColor: '#C8C7CC', borderBottomWidth: 0.5 }}>
          <SegmentedControlIOS
            values={[value1, value2]}
            selectedIndex={this.state.selectedIndex}
            onChange={this.changeSelectedIndex}
            style={{ width: '100%' }}
          />
        </View>}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, width: '100%', alignItems: 'center', padding: 16 }}>
            <Text style={{ fontSize: 17, marginBottom: 16 }}>{intl.formatMessage({ id: 'receive_hint_above_qr_code' })}{+this.state.amount > 0 ? this.state.amount : ''} {symbol}</Text>
            <QRCode
              value={addressUri}
              size={200}
            />
            <Text style={{ fontSize: this.getAddressFontSize(!this.state.selectedIndex ? address : childAddress), marginTop: 16, marginBottom: 16, textAlign: 'center' }}>
              {!this.state.selectedIndex ? address : childAddress}
            </Text>
            <TouchableOpacity
              underlayColor="#007AFF"
              activeOpacity={0.8}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#007AFF',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10
              }}
              onPress={this.copy.bind(this, !this.state.selectedIndex ? address : childAddress)}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 17 }}>{intl.formatMessage({ id: 'receive_button_copy_address' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}
              onPress={this.setAmount}
            >
              <FastImage
                source={require('resources/images/amount.png')}
                style={{ width: 28, height: 28, marginRight: 4 }}
              />
              <Text style={{ textAlign: 'center', color: '#007AFF', fontSize: 17 }}>{intl.formatMessage({ id: 'receive_button_setting_amount' })}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.showModal}
          backdropOpacity={0}
          useNativeDriver
          animationIn="fadeIn"
          animationInTiming={200}
          backdropTransitionInTiming={200}
          animationOut="fadeOut"
          animationOutTiming={200}
          backdropTransitionOutTiming={200}
        >
          {this.state.showModalContent && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(236,236,237,1)', padding: 20, borderRadius: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{intl.formatMessage({ id: 'general_toast_text_copied' })}</Text>
            </View>
          </View>}
        </Modal>
      </View>
      </SafeAreaView>
    )
  }
}
