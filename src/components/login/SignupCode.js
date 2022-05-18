import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { login, setToken } from "../../reducers/userSlice"
import "../../css/login.css"
import { useDispatch } from 'react-redux';

const SignupCode = () => {
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  var dispatch = useDispatch();
  useEffect(() => {
    const validateCode = async () => {
      const valid = await fetch(`http://${window.location.hostname}:5000/api/user/signup/token/${searchParams.get('code')}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      var data = await valid.json();
      if(data.error) {
        setCodeIsValid(false);
        setFetchError(data.error);
      }
      dispatch(login(data.user));
      dispatch(setToken(data.authToken));
    }
    validateCode()
    .catch(console.error)
  }, [])  
  return (
    <div className="d-flex width-400 justify-content-center bg-light">
      { (codeIsValid) &&
        <div className="bg-light"> 
        <p>
        Successfully activated Account!
        </p>
        <p>
          Click <Link to="/">here</Link> to continue
        </p>
        </div>
      } 
      {
        fetchError != "" &&
        <div className="">
          {fetchError}
        </div>
      }
    </div>
  )
}

export default SignupCode