import {createSlice} from "@reduxjs/toolkit"


const userSlice = createSlice({
    name: 'user',
    initialState: {
        userToken: "",
        user: {
            loggedIn: false,
            id: "",
            email: "",
            role: "",
            name: {
                first: "",
                last: ""
            },
            status: ""
        },
    },
    reducers: {
        login: (state, action) => { 
            state.user = {
                ...action.payload.user,
                loggedIn: true,
            }
        },
        logout: (state, action) => {
            state.user =  {
                loggedIn: false,
                id: "",
                email: "",
                role: "",
                name: {
                    first: "",
                    last: ""
                },
                status: ""
            }
            state.userToken = "";
        },
        setToken: (state, action) => {
            state.userToken = action.payload;
        }
    }
})

export const {login, logout, setToken} = userSlice.actions;

export default userSlice.reducer