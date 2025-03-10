import {
  BITPORTAL_API_REST_URL,
  BITPORTAL_API_MARKET_URL,
  BITPROTAL_API_TRACE_URL,
  BITPORTAL_API_CMS_URL,
  CURRENCY_RATE_URL
} from 'constants/env'
import storage from 'utils/storage'
import { isMobile } from 'utils/platform'

if (!isMobile) require('isomorphic-fetch')

export const fetchBase = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = options.baseUrl || BITPORTAL_API_REST_URL
  const headers = options.headers || {}
  const auth = options.auth

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  if (auth) {
    const token = await storage.getItem('bitportal_t')
    const authorization = token && `Bearer ${token}`
    headers.Authorization = authorization || null
  }

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params)
      .map(k => [k, params[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      fetchOptions.body = `${Object.keys(params)
        .map(k => [k, params[k]].join('='))
        .join('&')}`
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type']
      const formData = new FormData()
      Object.keys(params).forEach(key => formData.append(key, params[key]))
      fetchOptions.body = formData
    } else {
      fetchOptions.body = JSON.stringify(params)
    }
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}

const contentFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: 'https://content.bitportal.io/'
})

const cmsFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: BITPORTAL_API_CMS_URL
})

const marketFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: BITPORTAL_API_MARKET_URL
})

const traceFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: BITPROTAL_API_TRACE_URL
})

const bitcoinFeesBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: 'https://bitcoinfees.earn.com/api/v1'
})

const eosxFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: 'https://eosx-apigw.eosx.io/api'
})

const eosxLightFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: 'https://api.light.xeos.me/api/account/eos'
})

const blockdogFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, { ...params }, {
  ...options,
  headers: { apikey: '8cddc265-fdfc-4cdc-ba55-bc1c9c9a26cd' },
  baseUrl: 'https://open-api.eos.blockdog.com/v1'
})

const exchangerateFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: 'https://api.exchangerate-api.com/v4/latest'
})

const ethplorerFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, { ...params, apiKey: 'freekey' }, {
  ...options,
  baseUrl: 'http://api.ethplorer.io'
})

export const getTicker = (params?: TickerParams) => marketFetchBase('GET', '/tickers', params)
export const getChart = (params?: ChartParams) => marketFetchBase('GET', '/chart', params)
export const getCurrencyRate = () => fetchBase('GET', '', {}, { baseUrl: CURRENCY_RATE_URL })
export const getNewsList = (params: any) => contentFetchBase('GET', '_/items/news', params)
export const getDappBanner = (params: any) => cmsFetchBase('GET', '/banner', params)
export const getVersionInfo = () => cmsFetchBase('GET', '/system')
export const getProducersInfo = (params: any) => cmsFetchBase('GET', '/eosbp', params)
export const getTokenDetail = (params: any) => cmsFetchBase('GET', '/token', params)
export const getDapp = (params: any) => cmsFetchBase('GET', '/eosdapp', params)
export const getEOSAsset = (params: any) => eosxFetchBase('GET', '/tokens', params)
export const getETHAsset = (params: any) => cmsFetchBase('GET', '/ethtoken', params)
export const createEOSAccount = (params: any) => fetchBase('POST', '/registry/wallets/campaign/eoscreation', params)
export const importEOSAccount = (params: any) => fetchBase('POST', '/registry/wallets/import', params)
export const scanEOSAsset = (params: any) => eosxLightFetchBase('GET', `/${params.address}`)
export const scanETHAsset = (params: any) => ethplorerFetchBase('GET', `/getAddressInfo/${params.address}`)
export const subscribe = (params: any) => traceFetchBase('POST', '/notification/subscribe', params)
export const unsubscribe = (params: any) => traceFetchBase('POST', '/notification/unsubscribe', params)
export const traceTransaction = (params: any) => traceFetchBase('POST', '/transaction', params)
export const traceStake = (params: any) => traceFetchBase('POST', '/stake', params)
export const traceVotes = (params: any) => traceFetchBase('POST', '/votes', params)
export const traceImport = (params: any) => traceFetchBase('POST', '/registry/wallets/import', params)
export const simpleWalletAuth = (params: any, baseUrl: string) => fetchBase('POST', '', params, { baseUrl })
export const simpleWalletCallback = (baseUrl: string) => fetchBase('GET', '', undefined, { baseUrl })
export const getBTCFees = (params: any) => bitcoinFeesBase('GET', '/fees/recommended')
export const simpleWalletAuthorize = ({ loginUrl, ...params }) => fetchBase('POST', '', params, { baseUrl: loginUrl })
export const getEOSTransactions = (params: any) => blockdogFetchBase('POST', '/third/get_account_transfer', params)
export const getEOSTransaction = (params: any) => blockdogFetchBase('POST', '/third/get_transaction', params)
export const getCurrencyRates = (params: any) => exchangerateFetchBase('GET', '/USD', params)
