import Taro from '@tarojs/taro'
import userActions from './action'

const INITIAL_STATE ={
    loginStatus:false
}

export default function Store(state, action) {
    if(state === void 0){
        state = INITIAL_STATE
    }
    switch (action.type) {
        case userActions.LOGIN_STATUS:
            return {
                ...state,
                loginStatus:action.payload
            }
        default:
            return state
    }
}