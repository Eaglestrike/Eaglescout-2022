import React, {useState, useEffect} from 'react'

import { useSearchParams } from 'react-router-dom'
import "../../css/login.css"

const ForgotPasswordToken = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState("");
  const [passwordData, setPasswordData] = useState({password: "", confirmPassword: ""})
  useEffect(() => {
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
      if(data.err) {
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
  const handleSubmit = (event) =>{
    event.preventDefault();
    
  }
  return (
    <div className="d-flex justify-content-center">
      {user=="" && 
        <p>
          This token is not valid
        </p>
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
        <button type="submit" className="mb-3 btn btn-primary" onClick={handleSubmit}> Reset </button>
      </form>}
    </div>
  )
}

export default ForgotPasswordToken