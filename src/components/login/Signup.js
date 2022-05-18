import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  var navigate = useNavigate(0);
  var user = useSelector(state => state.user)

  var [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [handlingSubmit, setHandlingSubmit] = useState(false);

  var [emailUsed, setEmailUsed] = useState(0);
  var [success, setSuccess] = useState(false);

  useEffect(() => {
    if(user.user.loggedIn) navigate("/");
  }, [])
  const handleChange = (event) => {
    setSignupData({
      ...signupData,
      [event.target.name]: event.target.value.trim()
    })
  }
  //need to change handleSubmit
  const handleSubmit = async (event) =>{
    event.preventDefault();
    setHandlingSubmit(true);
    try {
      const user = await fetch(`http://${window.location.hostname}:5000/api/user/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password
        })
        
      })
      var data = await user.json();
      if(data.error) {
        setHandlingSubmit(false);
        if(data.error == 'An account with this email already exists!'){
          setEmailUsed(emailUsed +1);
        }
        throw data.error;
      }
      setSuccess(true);
      setHandlingSubmit(false);
      return;
    }
    catch(err) {
      setHandlingSubmit(false);
      console.log(err)
    }
  }
  const resendEmail = async (event) => {
    event.preventDefault();
    setHandlingSubmit(true);
    try {
      const user = await fetch(`http://${window.location.hostname}:5000/api/user/signup/email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: signupData.email,
        })
        
      })
      var data = await user.json();
      if(data.error) {
        setHandlingSubmit(false);
        throw data.error;
      }
      setHandlingSubmit(false);
      return;
    }
    catch(err) {
      setHandlingSubmit(false);
      console.log(err)
    }    
  }
  return (
    <div className="d-flex justify-content-center">
      {!success && 
      <form className="bg-light p-3 ">
        <h3 className='text-center mb-3'>
          Signup
        </h3>
        {
          emailUsed > 0&&
          <div className='mb-2 p-2 text-white bg-danger'>
            This email is already being used x{emailUsed}
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
        <div className="mb-3">
          <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password </label>
          <input type="password" name="confirmPassword" className="form-control" id="confirmPasswordInput" onChange={handleChange} />
        </div>
        <button type="submit" className="mb-3 btn btn-primary" disabled={handlingSubmit} onClick={handleSubmit}> Login </button>
        <div>
          <p className='forgot-password text-end'>
            <small>
            <Link to="/login">
              Signup
            </Link>
            </small>
          </p>
        </div>
      </form>
    }
    {success && 
      <div>
        
        Can't find the email? Click
         < button type="submit" className="mb-3 btn btn-primary" disabled={handlingSubmit} onClick={resendEmail}>here</button>
        to resend
      </div>
    }
    </div>
  )
}

export default Signup