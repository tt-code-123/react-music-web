import { createStore, applyMiddleware } from 'redux'
// 引入devtool
import { composeWithDevTools } from 'redux-devtools-extension'
// 引入thunk
import thunk from 'redux-thunk'
// 引入reducer
import reducers from './reducers'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))