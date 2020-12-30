const LOGIN_STATUS = Symbol('login success')
export default {
    LOGIN_STATUS
}

export const updateLoginStatus = (payload) => {
    return {
        type: LOGIN_STATUS,
        payload: payload
    }
}