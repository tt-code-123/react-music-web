import { combineReducers } from 'redux'
import loginReducer from './login-reducer'
import defaultPlaylistReducer from './playlist-reducer'
import playReducer from './play-reducer'
import likePlaylistReducer from './likelist-reducer'

const allReducer = combineReducers({
  userInfo: loginReducer,
  defaultPlaylist: defaultPlaylistReducer,
  likePlaylist:likePlaylistReducer,
  currentPlayingInfo: playReducer
})
export type ReducerStates = ReturnType<typeof allReducer>

export default allReducer