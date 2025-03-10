import { handleActions } from 'utils/redux'
import * as actions from 'actions/keyAccount'

export const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateKeyAccount] (state, action) {
    const account = action.payload
    state.byId[account.id] = account
    const index = state.allIds.findIndex((v: any) => v === account.id)
    if (index === -1) state.allIds.push(account.id)
  },
  [actions.removeKeyAccount] (state, action) {
    const id = action.payload
    const index = state.allIds.findIndex((v: any) => v === id)
    state.allIds.splice(index, 1)
    delete state.byId[id]
  }
}, initialState)
