import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, setToken } from "../../reducers/userSlice"
import "../../css/login.css"
import { useDispatch, useSelector } from 'react-redux';

const SignupCode = () => {
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  var user = useSelector(state => state.user);
  var dispatch = useDispatch();
  var navigate = useNavigate(); 
  useEffect(() => {
    if(user.user.loggedIn) navigate("/");
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
        return;
      }
      setCodeIsValid(true);
      dispatch(login(data.user));
      dispatch(setToken(data.authToken));
    }
    validateCode()
    .catch(console.error)
  }, [])  
  return (
    <div className="d-flex justify-content-center">
      
      <div className="width-400 bg-light p-3">
      { (codeIsValid) &&
        <div > 
        <h3>
        Successfully activated Account!
        </h3>
        <p>
          Click <Link to="/">here</Link> to continue
        </p>
        </div>
      } 

      {
        fetchError != "" &&
        <div>
        <h3 className="mb-3">
          {fetchError}
        </h3>
        Back to {"\n"}
        <Link to="/login">
           Login
        </Link>
        </div>
      }
      </div>
    </div>
  )
}

export default SignupCode