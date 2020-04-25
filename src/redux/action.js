export const LOGIN = 'LOGIN'
export const LOADING = 'LOADING'
export const USER_ID = 'USER_ID'
export const HISTORY = 'HISTORY'

export const login = (status) => {
    return{
        type: LOGIN,
        payload: status
    }
}

export const loading = (status) => {
    return{
        type: LOADING,
        payload: status
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