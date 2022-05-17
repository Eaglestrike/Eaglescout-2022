import {configureStore} from "@reduxjs/toolkit"
import userReducer from "../reducers/userSlice"

function saveToLocalStorage(state){
    try{
        var serialized = JSON.stringify(state);
        localStorage.setItem("persistantState", serialized);
    }
    catch(err) {
        console.log(err);
    }
}

function loadLocalStorage() {
    try {
        var state = localStorage.getItem("persistantState");
        if(!state) return undefined;
        return JSON.parse(state); 
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
}
const store = configureStore({
    reducer: {
        user: userReducer,
    },
    preloadedState: loadLocalStorage()
})

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;