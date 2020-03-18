import { LOADING, LOGIN, USER_ID } from './action';
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

const loadingReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOADING : 
            return {
                ...state,
                loading: action.payload
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

export const rootReducer = combineReducers({
    login: loginReducer,
    loading: loadingReducer,
    userId: userIdReducer
})