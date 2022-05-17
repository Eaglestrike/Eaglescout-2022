import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import '../../css/login.css'

const ForgotPassword = () => {
  const [emailData, setEmailData] = useState({email: ""});
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFail, setEmailFail] = useState(0);
  var navigate = useNavigate();
  var curUser = useSelector(state => state.user)
  useEffect(() => {
    if(curUser.user.loggedIn) navigate("/");
  }, [])
  const handleChange = (event) => {
    setEmailData({
      ...emailData,
      [event.target.name]: event.target.value.trim()
    })
  }

  const handleSubmit = async (event) =>{
    event.preventDefault();
    if(sendingEmail) return;
    setSendingEmail(true);
    try {
      const user = await fetch(`http://${window.location.hostname}:5000/api/user/forgotPassword/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
        
      })
      var data = await user.json();
      if(data.error) {
        setEmailFail(emailFail+1)
        throw data.error;
      }
      setSendingEmail(false);
      setEmailSent(true)
    }
    catch(err) {
      // setLoginFail(loginFail+1);
      console.log(err)
      setSendingEmail(false);
      setEmailFail(emailFail+1)
    }
  }
  return (
    
    <div className="d-flex justify-content-center">
      {!emailSent &&
      <form className="bg-light p-3 ">
        <h3 className='text-center mb-3'>
          Forgot Password
        </h3>
        {emailFail > 0 &&
        <div className='mb-2 p-2 text-white bg-danger'>
           User does not exist x{emailFail}
        </div>
        }
        <p >
          Enter your email to get a password recovery link
        </p>
        
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email Address </label>
          <input type="email" name="email" className="form-control" id="emailInput" onChange={handleChange} />
        </div>
        <button type="submit" className="mb-3 btn btn-primary" onClick={handleSubmit}> Send Email </button>
        <div>
          <p className='login text-end'>
             <Link to="/login">
              Login
            </Link>
          </p>
          <p className='signup text-end'>
            <Link to="/signup">
              Signup
            </Link>
          </p>
        </div>
      </form>
      }
      {emailSent &&
        <div>
          Email has been sent, please check your email!
        </div>
      }
    </div>
  )
}

export default ForgotPassword