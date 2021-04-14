import Login from '../pages/public/Login'
import LayoutAdmin from '../layouts/LayoutAdmin'

import Dashboard from '../pages/admin/dashboard'

/**Usuarios */
import Users from '../pages/admin/users'
import UpdateUser from '../pages/admin/users/UpdateUser'

/**Publicaciones */
import Posts from '../pages/admin/posts/Posts'
import UpdatePost from '../pages/admin/posts/UpdatePost'

/**Asesorías */
import Consultancies from '../pages/admin/consultancies/Consultancies'
import UpdateConsultancy from '../pages/admin/consultancies/UpdateConsultancy'

/**Areas */
import Areas from '../pages/admin/areas/Areas'

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
                path: '/admin/posts',
                component: Posts,
                exact: true,
            },
            {
                path: '/admin/posts/:id',
                component: UpdatePost,
                exact: true,
            },
            {
                path: '/admin/asesorias',
                component: Consultancies,
                exact: true,
            },
            {
                path: '/admin/asesorias/:id',
                component: UpdateConsultancy,
                exact: true,
            },
            {
                path: '/admin/areas',
                component: Areas,
                exact: true,
            },
            {
                component: null
            }
        ]
    },
]

export default routes