import React, {useState, useEffect} from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import "../../css/login.css"

import { useDispatch } from 'react-redux'
import { login, setToken } from "../../reducers/userSlice"

const ForgotPasswordToken = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [passwordData, setPasswordData] = useState({password: "", confirmPassword: ""})
  useEffect(() => {
    if(user.user.loggedIn) navigate("/");
    const validateToken = async () => {
      const valid = await fetch(`http://${window.location.hostname}:5000/api/user/forgotpassword/valid/${searchParams.get('token')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await valid.json();
      console.log(data);
      if(data.error) {
        setUser("")
        return;
      }
      setUser(data.email);
      return;
    }
    validateToken()
    .catch(console.error);
  }, [])
  const handleChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value.trim()
    })
  }
  const handleSubmit = async (event) =>{
    event.preventDefault();
    if(passwordData.password != passwordData.confirmPassword)
      return;
    const reset = await fetch(`http://${window.location.hostname}:5000/api/user/forgotpassword/reset/${searchParams.get('token')}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: passwordData.password
      })
    })
    var resetData = await reset.json();
    if(resetData.error) {
      console.log("u have an error idiot")
    }
    try {
      const foundUser = await fetch(`http://${window.location.hostname}:5000/api/user/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user,
          password: passwordData.password,
        })
      })
      var data = await foundUser.json();
      console.log(data)
      if(data.error) {
        throw data.error;
      }
      console.log(data);
      dispatch(login({
        user: data.user,
      }));
      dispatch(setToken(
        data.authToken
      ));
      navigate("/");
    }
    catch(err) {
      console.log(err)
    }
    console.log("successfully reset password")
  }
  return (
    
    <div className="d-flex justify-content-center">
      {user=="" && 
        <div className="bg-light p-3">
          <h3>          
            This token is not valid
         </h3>
         <div>
          <Link to="/login">Back to Login</Link>
          </div>
        </div>
      }
      {user!="" &&
      <form className="p-3 bg-light">
        <h3 className="mb-3">
          Reset Password for {user}
        </h3>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password </label>
          <input type="password" name="password" className="form-control" id="passwordinput" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password </label>
          <input type="password" name="confirmPassword" className="form-control" id="confirmPasswordInput" onChange={handleChange} />
        </div>
        {passwordData.password != passwordData.confirmPassword && 
        <div className="bg-warning mb-3 p-2">
          Passwords must match
        </div>
        }
        {passwordData.password.length < 8 &&
        <div className="bg-warning mb-3 p-2">
            Password must be at least 8 characters long
        </div>
        }
        <button type="submit" className="mb-3 btn btn-primary" onClick={handleSubmit} 
        disabled={passwordData.password != passwordData.confirmPassword || passwordData.password.length < 8}> Reset </button>
      </form>}

    </div>
  )
}

export default ForgotPasswordToken