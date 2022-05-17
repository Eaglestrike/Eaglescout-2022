import React from 'react'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, setToken } from './reducers/userSlice'
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"

import Login from "./components/login/Login"
import Signup from "./components/login/Signup"
import Account from "./components/login/Account"
import ForgotPassword from "./components/login/ForgotPassword"
import SignupCode from "./components/login/SignupCode"
import ForgotPasswordToken from "./components/login/ForgotPasswordToken"

import Scout from "./components/scout/Home"
import Teams from "./components/scout/Teams"
import Team from "./components/scout/Team"
import Ranking from "./components/scout/Ranking"
import EditObservations from "./components/scout/EditObservations"
import NewObservation from "./components/scout/NewObservation"
import NewPitScout from "./components/scout/NewPitScout"

import Admin from "./components/admin/Home"
import Users from "./components/admin/Users"
import Settings from "./components/admin/Settings"
import Game from "./components/admin/Game"



function App() {
  var dispatch = useDispatch();
  const user = useSelector(state => state.user);
  useEffect(() => {
    const fetchUser = async (token) => {
      var bearer = "bearer " + token;
      try{ 
        const user = await fetch(`http://${window.location.hostname}:5000/api/user`,
        {
          method: "GET",
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
          }
        });
        const data = await user.json();
        if(data.error){
          window.localStorage.setItem("authToken", "");
          dispatch(logout())
        }
        dispatch(
          login(data.user)
        )
      }
      catch(err){
        console.log(err);
      }
    }
    if(!user.user.loggedIn){
      var token = window.localStorage.getItem("authToken");
      if(!token) return;
      fetchUser(token)
      .catch(console.error);
    }
  },[])
  return (
    <Router>
      
      <Navbar />
      <br/>
      <Routes className="content">
        <Route path="/" exact element={<PrivateRoute><Dashboard /> </PrivateRoute>} />

        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/signup/code" exact element={<SignupCode />} />
        <Route path="/account" exact element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/forgotpassword/token" exact element={<ForgotPasswordToken />} />
        <Route path="/forgotpassword" exact element={<ForgotPassword />} />

        <Route path="/scout" exact element={<PrivateRoute><Scout /></PrivateRoute>} />
        <Route path="/scout/teams" exact element={<PrivateRoute><Teams /></PrivateRoute>} />
        <Route path="/scout/team/:team" exact element={<PrivateRoute><Team /></PrivateRoute>} />
        <Route path="/scout/ranking" exact element={<PrivateRoute><Ranking /></PrivateRoute>} />
        <Route path="/scout/editobservation/:id" exact element={<PrivateRoute><EditObservations /></PrivateRoute>} />
        <Route path="/scout/observation/new" exact element={<PrivateRoute><NewObservation /></PrivateRoute>} />
        <Route path="/scout/pitscouting/new" exact element={<PrivateRoute><NewPitScout /></PrivateRoute>} />
        
        <Route path="/admin" exact element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/users" exact element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/admin/settings" exact element={<AdminRoute><Settings /></AdminRoute>} />
        <Route path="/admin/game" exact element={<AdminRoute><Game /></AdminRoute>} />
     </Routes>
    </Router>
  );
}

export default App;
