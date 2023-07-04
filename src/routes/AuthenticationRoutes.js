import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('views/pages/reset_password/index')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    // element: <AuthLogin3 />,
    children: [
        {
            path: '/signin',
            element: <AuthLogin3 />
        },
        {
            path: '/register',
            element: <AuthRegister3 />
        },
        ,
        {
            path: '/forgot_password',
            element: <ForgotPassword />
        }
        ,
        {
            path: '/reset_password/:token',
            element: <ResetPassword />
        }
    ]
};

export default AuthenticationRoutes;
