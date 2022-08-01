import {USER_NAME, LOGIN, USER_ID, HISTORY, RESULT} from './action';
import { combineReducers } from 'redux';

const initialState = {
    login: false,
    loading: false
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN :
            return {
                ...state,
                login: action.payload
            }
        default :
            return state
    }
}

const userNameReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER_NAME :
            return {
                ...state,
                userName: action.payload
            }
        default :
            return state
    }
}

const userIdReducer = (state = initialState, action) => {
    switch(action.type) {
        case USER_ID :
            return {
                ...state,
                userId: action.payload
            }
        default :
            return state
    }
}

const historyReducer = (state = initialState, action) => {
    switch(action.type) {
        case HISTORY :
            return {
                ...state,
                history: action.payload
            }
        default :
            return state
    }
}

const resultReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESULT :
            return {
                ...state,
                result: action.payload
            }
        default: return state
    }
}

export const rootReducer = combineReducers({
    login: loginReducer,
    userName: userNameReducer,
    userId: userIdReducer,
    history: historyReducer,
    result: resultReducer
})
