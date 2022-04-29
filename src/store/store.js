import {configureStore} from "redux"
import userReducer from "../reducers/userSlice"

export default configureStore({
    reducer: {
        user: userReducer,
        
    }
})