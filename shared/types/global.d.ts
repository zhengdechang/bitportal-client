// types

declare type ErrorMessage = string

declare type Locale = 'en' | 'zh'

declare type FetchMethod = 'GET' | 'POST' | 'PUT' | 'OPTIONS' | 'DELETE'

declare const TradingView: any

declare const Datafeeds: any

// interfaces

declare interface Config {
  ENV: string
  BITPORTAL_API_REST_URL: string
  BITPORTAL_API_MARKET_URL: string
  BITPROTAL_API_TRACE_URL: string
  BITPORTAL_API_CMS_URL: string
  BITPORTAL_API_WEBSOCKET_URL: string
  EOS_API_URL: string
  CURRENCY_RATE_URL: string
  BITPORTAL_API_TERMS_URL: string
  BITPORTAL_API_UPDATE_LOG_URL: string
  EOS_EXPLORER_URL: string
  BITPORTAL_API_EOS_URL: string
  BITPORTAL_WEBSITE_URL: string
}

declare interface RootState {
  router?: any
  modal?: any
  ui?: any
  form?: any
  intl?: any
  ticker?: any
  assets?: any
  balance?: any
  wallet?: any
  producer?: any
  eosAccount?: any
  ram?: any
  transaction?: any
  contact?: any
  eosNode?: any
  eosAsset?: any
  dApp?: any
  dappBrowser?: any
  appInfo?: any
}

declare interface FetchOptions {
  baseUrl?: string
  auth?: boolean
  headers?: {
    Accept?: string
    'Content-Type'?: string
    Authorization?: string | null
  }
}

declare interface SuccessResponse {
  status: string
  code: number
  data?: string
  server_time: number
}

declare interface ErrorResponse {
  status: string
  error_code: number
  error_msg: string
  server_time: number
}

declare interface Process {
  type?: any
}

declare interface Window {
  __PRELOADED_STATE__?: string
  __PRELOADED_CHUNKS__?: string[]
  Intl?: any
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
  tvWidget?: any
  process?: Process
  bitportal: any
}

declare interface FormMeta {
  form: string,
  field: string
}

declare interface Process extends NodeJS.Process {
  release: {
    name: string
  }
}

declare interface NodeModule {
  hot?: any
}

declare interface HTMLHeadElement {
  append: any
}

// modules

declare module '*.css' {
  const styles: any
  export = styles
}

declare module '*.png' {
  const file: any
  export = file
}

declare module '*.json' {
  const file: any
  export = file
}

declare module '*.wasm' {
  const file: any
  export = file
}

declare module '*messages' {
  const file: any
  export = file
}

declare module '*production' {
  const config: Config
  export = config
}

declare module 'constants/env' {
  const config: Config
  export = config
}

declare module 'transit-immutable-js' {
  const transit: any
  export = transit
}

declare module 'react-cookie' {
  interface Cookie {
    CookiesProvider: any
    withCookies: any
    Cookies: any
  }

  const cookie: Cookie
  export = cookie
}

declare module 'isomorphic-fetch' {
  const fetch: any
  export = fetch
}

declare module 'intl' {
  const file: any
  export = file
}

declare module 'intl/locale-data/jsonp/en.js' {
  const file: any
  export = file
}

declare module 'intl/locale-data/jsonp/zh.js' {
  const file: any
  export = file
}

declare module 'reducers' {
  const file: any
  export = file
}

declare module 'sagas' {
  const file: any
  export = file
}

declare module 'routes/async' {
  interface Bundles {
    [key: string]: any
  }

  const bundles: Bundles
  export = bundles
}

declare module 'react-native-vector-icons/Ionicons' {
  const file: any
  export = file
}

declare module 'react-native-svg' {
  interface Svg extends React.ComponentClass<any> {
    Path: any
  }

  const svg: Svg
  export = svg
}

declare module 'react-native-extended-stylesheet' {
  const file: any
  export = file
}

declare module 'components/*' {
  const file: any
  export = file
}

declare module 'utils/*' {
  const file: any
  export = file
}

declare module 'core/*' {
  const file: any
  export = file
}

declare module 'utils/location' {
  interface LocationActions {
    pop: any
    push: any
    popToRoot: any
    setExtraLocale: any
  }

  const locationActions: LocationActions
  export = locationActions
}

declare module 'resources/icons/*' {
  const file: any
  export = file
}

declare module 'eosjs' {
  const file: any
  export = file
}

declare module 'react-native-eosjs' {
  const file: any
  export = file
}

declare module 'eosjs-ecc' {
  const file: any
  export = file
}

declare module 'react-native-eosjs-ecc' {
  const file: any
  export = file
}

declare module 'ethereumjs-wallet*' {
  const file: any
  export = file
}

declare module 'react-native-sensitive-info' {
  const file: any
  export = file
}

declare module 'serialize-javascript' {
  const file: any
  export = file
}

declare module 'core/legacy/eos' {
  interface EOS {
    generateMasterKeys: any
    privateToPublic: any
    deriveKeys: any
    getLocalAccounts: any
    getEOS: any
    isValidPrivate: any
    initEOS: any
    sortProducers: any
    randomKey: any
    getPermissionsByKey: any
    getInitialAccountInfo: any
    transferEOSAsset: any
    voteEOSProducers: any
    pushEOSAction: any
    eosAuthSign: any
    signature: any
    verify: any
    createEOSAccount: any
  }

  const eos: EOS
  export = eos
}

declare module 'core/legacy/key' {
  interface KeyManagement {
    validateEntropy: any
    getEOSKeys: any
    getMasterSeed: any
    getMasterSeedFromEntropy: any
    decrypt: any
    encrypt: any
    getEOSWifsByInfo: any
    validateEOSPublicKeyByInfo: any
  }

  const key: KeyManagement
  export = key
}

declare module 'bitcoin' {
  interface Bitcoin {
    generateBIP44Address: any
  }

  const bitcoin: Bitcoin
  export = bitcoin
}

declare module 'ethereum' {
  interface Ethereum {
    generateBIP44Address: any
  }

  const ethereum: Ethereum
  export = ethereum
}

declare module 'hdkey' {
  const file: any
  export = file
}

declare module 'react-native-bip39' {
  const file: any
  export = file
}

declare module 'bs58' {
  const file: any
  export = file
}

declare module 'secp256k1' {
  const file: any
  export = file
}

declare module 'uuid*' {
  const file: any
  export = file
}

declare module 'keccak' {
  const file: any
  export = file
}

declare module 'react-native-randombytes' {
  const file: any
  export = file
}

declare module 'scrypt-async' {
  const file: any
  export = file
}

declare module 'randombytes' {
  const file: any
  export = file
}

declare module 'wif' {
  const wif: any
  export default wif
}

declare module 'bip39' {
  const bip39: any
  export default bip39
}

declare module 'react-native-fs' {
  const fs: any
  export default fs
}

declare module 'bs58check' {
  const file: any
  export = file
}

declare module 'bech32' {
  const file: any
  export = file
}
