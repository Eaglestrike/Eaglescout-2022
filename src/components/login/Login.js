import React from 'react'
import { useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import '../../css/login.css'
import {login, setToken} from '../../reducers/userSlice'


const Login = () => {
  var dispatch = useDispatch();
  var [loginData, setLoginData] = useState({email: "", password: ""})
  const [loginFail, setLoginFail] = useState(0);
  var user = useSelector(state => state.user);
  var navigate = useNavigate();

  useEffect(() => {
    if(user.user.loggedIn) navigate("/");
  })

  const handleChange = (event) => {

    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value.trim()
    })
  }

  const handleSubmit = async (event) =>{
    event.preventDefault();
    try {
      const user = await fetch(`http://${window.location.hostname}:5000/api/user/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
        
      })
      var data = await user.json();
      if(data.error) {
        setLoginFail(true);
        throw data.error;
      }
      console.log(data);
      dispatch(login({
        user: data.user,
      }));
      dispatch( setToken(
        data.authToken
      ));
      navigate("/");
    }
    catch(err) {
      setLoginFail(loginFail+1);
      console.log(err)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <form className="bg-light p-3 ">
        <h3 className='text-center mb-3'>
          Login
        </h3>
        {loginFail > 0 &&
        <div className='mb-2 p-2 text-white bg-danger'>
            Email and password do not match x{loginFail}
        </div>
        }
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email Address </label>
          <input type="email" name="email" className="form-control" id="emailInput" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password </label>
          <input type="password" name="password" className="form-control" id="passwordInput" onChange={handleChange} />
        </div>
        <button type="submit" className="mb-3 btn btn-primary" onClick={handleSubmit}> Login </button>
        <div>
          <p className='forgot-password text-end'>
            <small>
            Forgot <Link to="/forgotpassword">
              Password
            </Link>
            </small>
          </p>
          <p className='login text-end'>
            <small>
            <Link to="/signup">
              Signup
            </Link>
            </small>
          </p>
          
        </div>
      </form>
    </div>

   )
}

export default Login