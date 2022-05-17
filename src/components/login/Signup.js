import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  var navigate = useNavigate(0);
  var user = useSelector(state => state.user)
  useEffect(() => {
    if(user.user.loggedIn) navigate("/");
  }, [])
  return (
    <div>signup</div>
  )
}

export default Signup