
import {useSelector, useDispatch} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {logout} from "../reducers/userSlice"

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  var user = useSelector(state => state.user)
  const userLogin = () => {
    navigate('/login');
  }
  const userLogout = () => {
    dispatch(
      logout()
    )
    userLogin();
  }


  return (
    
    <nav className='navbar navbar-expand-sm navbar-light bg-light'>
      <div className="container-sm">
        <Link to="/" className="navbar-brand">
          <img src="/img/eaglestrike.png" width="30px" height="30px"></img>
        </Link>
 
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {
          (user.user.loggedIn) && 
            <li className="nav-item dropdown">
              <Link to="/scout" className="nav-link dropdown-toggle" id="scoutDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Scouting
              </Link>
              <div className="dropdown-menu" aria-labelledby="scoutDropdown">
                <Link to="/scout/teams" className="dropdown-item"> Teams </Link>
                <Link to="/scout/ranking" className="dropdown-item"> Ranking </Link>
                <Link to="/scout/observation/new" className="dropdown-item"> New Observation </Link>
                <Link to="/scout/pitscouting/new" className="dropdown-item"> New Pit Scouting Observation</Link>
              </div>
            </li>
          }
          {
            user.user.role == "admin" && 
            <li className="nav-item dropdown">
              <Link to="/admin" className="nav-link dropdown-toggle" id="adminDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Admin
              </Link>
              <div className="dropdown-menu" aria-labelledby="adminDropdown">
                <Link to="/admin/users" className="dropdown-item"> Users </Link>
                <Link to="/admin/settings" className="dropdown-item"> Settings </Link>
                <Link to="/admin/game" className="dropdown-item"> Game setup </Link>
              </div>
            </li>
          }
        </ul>
        {
          user.user.loggedIn &&
          <button type="button" className="nav-item btn btn-light btn-outline-dark" data-bs-toggle="modal" data-bs-target="#logoutModal">
            Logout
          </button>
        }
        {
          !user.user.loggedIn && 
          <button id="login" className="nav-item btn btn-light btn-outline-dark" onClick={userLogin}>
            Login
          </button>
        }
      </div>
      <div className="modal fade" id="logoutModal" aria-labelledby="logoutModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="logoutModalLabel">Confrim Logout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to logout?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={userLogout} data-bs-dismiss="modal" >Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    )
}

export default Navbar