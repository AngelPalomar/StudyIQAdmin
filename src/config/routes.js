import Login from '../pages/public/Login'
import LayoutAdmin from '../layouts/LayoutAdmin'

import Dashboard from '../pages/admin/dashboard'
import Users from '../pages/admin/users'
import UpdateUser from '../pages/admin/users/UpdateUser'

const routes = [
    /**Página principal */
    {
        path: '/',
        component: Login,
        exact: true,
        routes: [
            {
                component: null
            }
        ]
    },
    {
        path: '/admin',
        component: LayoutAdmin,
        exact: false,
        routes: [
            {
                path: '/admin',
                component: Dashboard,
                exact: true,
            },
            {
                path: '/admin/usuarios',
                component: Users,
                exact: true,
            },
            {
                path: '/admin/usuarios/:id',
                component: UpdateUser,
                exact: true,
            },
            {
                component: null
            }
        ]
    },
]

export default routes