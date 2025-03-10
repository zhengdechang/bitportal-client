import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import formSaga from './form'
import intlSaga from './intl'
import tickerSaga from './ticker'
import chartSaga from './chart'
import walletSaga from './wallet'
import eosAccountSaga from './eosAccount'
import keystoreSaga from './keystore'
import balanceSaga from './balance'
import loggerSaga from './logger'
import producerSage from './producer'
import currencySaga from './currency'
import votingSaga from './voting'
import transferSaga from './transfer'
import transactionSaga from './transaction'
import ramSaga from './ram'
import bandwidthSaga from './bandwidth'
import tokenSaga from './token'
import eosAssetSaga from './eosAsset'
import dAppSaga from './dapp'
import contactSaga from './contact'
import eosNodeSaga from './eosNode'

const sagas = {
  formSaga: fork(formSaga),
  intlSaga: fork(intlSaga),
  tickerSaga: fork(tickerSaga),
  chartSaga: fork(chartSaga),
  walletSaga: fork(walletSaga),
  eosAccountSaga: fork(eosAccountSaga),
  keystoreSaga: fork(keystoreSaga),
  balanceSaga: fork(balanceSaga),
  loggerSaga: fork(loggerSaga),
  producerSage: fork(producerSage),
  currencySaga: fork(currencySaga),
  votingSaga: fork(votingSaga),
  transferSaga: fork(transferSaga),
  transactionSaga: fork(transactionSaga),
  ramSaga: fork(ramSaga),
  bandwidthSaga: fork(bandwidthSaga),
  tokenSaga: fork(tokenSaga),
  eosAssetSaga: fork(eosAssetSaga),
  dAppSaga: fork(dAppSaga),
  contactSaga: fork(contactSaga),
  eosNodeSaga: fork(eosNodeSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
