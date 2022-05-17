import { Route, Navigate} from 'react-router-dom';

import { useSelector } from 'react-redux';

export { PrivateRoute };

function PrivateRoute({ children }) {
    const user = useSelector(state => state.user);
    return (user.user.loggedIn) ? children : <Navigate to="/login" />
}