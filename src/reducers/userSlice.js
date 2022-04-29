import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userToken: "",
        user: {
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
            state.user = action.payload;
        }, 
        setToken: (state, action) => {
            state.userToken = action.payload;
        }
    }
})

export const selectUser = (state) => state.user;
export const selectUserId = (state) => state.user.id;
export const selectUserEmail = (state) => state.user.email;
export const selectUserRole = (state) => state.user.role;
export const selectUserName = (state) => state.user.name;
export const selectUserStatus = (state) => state.user.status;

export default userSlice.reducer