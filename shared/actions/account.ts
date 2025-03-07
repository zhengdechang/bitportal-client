import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateAccount = createAction<AddAccountParams>('account/UPDATE')
export const removeAccount = createAction<RemoveAccountParams>('account/REMOVE')
export const getAccount = createAsyncAction('account/GET')
export const createEOSAccount = createAsyncAction<CreateAccountParams>('account/CREATE')
export const syncEOSAccount = createAsyncAction<SyncAccountParams>('account/SYNC')
