import { Navigate} from 'react-router-dom';

import { useSelector } from 'react-redux';

export { AdminRoute };

function AdminRoute({ children }) {
    const user = useSelector(state => state.user);
    return user.user.loggedIn && (user.user.role === 'admin' ||
     user.user.role === 'owner') ? children : <Navigate to="/" /> 
}