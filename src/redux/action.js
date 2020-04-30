export const LOGIN = 'LOGIN'
export const USER_NAME = 'USER_NAME'
export const USER_ID = 'USER_ID'
export const HISTORY = 'HISTORY'

export const login = (status) => {
    return{
        type: LOGIN,
        payload: status
    }
}

export const userName = (userName) => {
    return{
        type: USER_NAME,
        payload: userName
    }
}

export const userId = (userId) => {
    return{
        type: USER_ID,
        payload: userId
    }
}

export const history = (status) => {
    return {
        type: HISTORY,
        payload: status
    }
}
