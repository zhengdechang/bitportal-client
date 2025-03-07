import { createSelector } from 'reselect'
import { initialState } from 'reducers/wallet'

export const activeWalletIdSelector = (state: RootState) => state.wallet.activeWalletId || initialState.activeWalletId
export const activeChainSelector = (state: RootState) => state.wallet.activeChain || initialState.activeChain
export const bridgeChainSelector = (state: RootState) => state.wallet.bridgeChain || initialState.bridgeChain
export const managingWalletIdSelector = (state: RootState) => state.wallet.managingWalletId || initialState.managingWalletId
export const transferWalletIdSelector = (state: RootState) => state.wallet.transferWalletId || initialState.transferWalletId
export const bridgeWalletIdSelector = (state: RootState) => state.wallet.bridgeWalletId || initialState.bridgeWalletId
const identityWalletByIdSelector = (state: RootState) => (state.wallet.identityWallets || initialState.identityWallets).byId
const identityWalletAllIdsSelector = (state: RootState) => (state.wallet.identityWallets || initialState.identityWallets).allIds
const importedWalletByIdSelector = (state: RootState) => (state.wallet.importedWallets || initialState.importedWallets).byId
const importedWalletAllIdsSelector = (state: RootState) => (state.wallet.importedWallets || initialState.importedWallets).allIds

export const walletAllIdsSelector = createSelector(
  identityWalletAllIdsSelector,
  importedWalletAllIdsSelector,
  (identityWallet: string, importedWallet: any) => [...identityWallet, ...importedWallet]
)

export const walletByIdSelector = createSelector(
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (identityWallet: string, importedWallet: any) => ({
    ...identityWallet,
    ...importedWallet
  })
)

export const activeWalletSelector = createSelector(
  activeWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (activeWalletId: string, identityWallets: any, importedWallets: any) => activeWalletId && (identityWallets[activeWalletId] || importedWallets[activeWalletId])
)

export const managingWalletSelector = createSelector(
  managingWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (managingWalletId: string, identityWallets: any, importedWallets: any) => managingWalletId && (identityWallets[managingWalletId] || importedWallets[managingWalletId])
)

export const transferWalletSelector = createSelector(
  transferWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (transferWalletId: string, identityWallets: any, importedWallets: any) => transferWalletId && (identityWallets[transferWalletId] || importedWallets[transferWalletId])
)

export const bridgeWalletSelector = createSelector(
  bridgeWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (bridgeWalletId: string, identityWallets: any, importedWallets: any) => bridgeWalletId && (identityWallets[bridgeWalletId] || importedWallets[bridgeWalletId])
)

export const identityWalletSelector = createSelector(
  identityWalletByIdSelector,
  identityWalletAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const identityBTCWalletSelector = createSelector(
  identityWalletSelector,
  (identityWallet: any) => {
    const index = identityWallet.findIndex(wallet => wallet.chain === 'BITCOIN')

    return index !== -1 ? identityWallet[index] : null
  }
)

export const identityETHWalletSelector = createSelector(
  identityWalletSelector,
  (identityWallet: any) => {
    const index = identityWallet.findIndex(wallet => wallet.chain === 'ETHEREUM')

    return index !== -1 ? identityWallet[index] : null
  }
)

export const hasIdentityEOSWalletSelector = createSelector(
  identityWalletSelector,
  (identityWallets: any) => {
    if (identityWallets && identityWallets.length) {
      const index = identityWallets.findIndex((wallet: any) => wallet.chain === 'EOS')
      return !!(identityWallets[index] && identityWallets[index].address)
    }

    return false
  }
)

export const identityEOSWalletSelector = createSelector(
  identityWalletSelector,
  (identityWallet: any) => {
    const index = identityWallet.findIndex(wallet => wallet.chain === 'EOS')

    return index !== -1 ? identityWallet[index] : null
  }
)

export const identityEOSAccountsSelector = createSelector(
  identityEOSWalletSelector,
  (identityWallet: any) => {
    return identityWallet && identityWallet.accounts
  }
)

export const importedWalletSelector = createSelector(
  importedWalletByIdSelector,
  importedWalletAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const importedBTCWalletSelector = createSelector(
  importedWalletSelector,
  (importedWallet) => {
    const index = importedWallet.findIndex(wallet => wallet.chain === 'BITCOIN')

    return index !== -1 ? importedWallet[index] : null
  }
)

export const importedETHWalletSelector = createSelector(
  importedWalletSelector,
  (importedWallet) => {
    const index = importedWallet.findIndex(wallet => wallet.chain === 'ETHEREUM')

    return index !== -1 ? importedWallet[index] : null
  }
)

export const walletAddressesSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).map((wallet: any) => wallet.address).filter((address: string) => !!address)
)

export const eosAccountSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).filter((wallet) => wallet.chain === 'EOS').map((wallet: any) => wallet.address).filter((address: string) => !!address)
)

export const eosWalletSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).filter((wallet) => wallet.chain === 'EOS').filter((address: string) => !!address)
)

export const ethWalletSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).filter((wallet) => wallet.chain === 'ETHEREUM')
)

export const bridgeWalletListSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).filter((wallet) => wallet.chain === 'ETHEREUM' || wallet.chain === 'EOS').filter((wallet: string) => !!wallet.address)
)
