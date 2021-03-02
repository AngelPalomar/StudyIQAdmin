import React, { useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Hidden } from '@material-ui/core'
import { useStyles } from './useStyles'

/**Components */
import DrawerMenu from '../components/menu/DrawerMenu'
import Header from '../components/menu/Header'

function LayoutAdmin(props) {
    const classes = useStyles()
    const { routes, match: { path } } = props
    const [open, setOpen] = useState(false)

    /**Menu lateral */
    const OpenAction = () => {
        setOpen(!open)
    }

    return (
        <div>
            <div className={classes.root}>
                <Header position="fixed" OpenAction={OpenAction} />
                <Hidden xsDown>
                    <DrawerMenu
                        variant="permanent"
                        open={true} title={path}
                        url={props.location.pathname} />
                </Hidden>
                <Hidden smUp>
                    <DrawerMenu
                        variant="temporary"
                        open={open}
                        onClose={OpenAction}
                        url={props.location.pathname}
                    />
                </Hidden>
                <div className={classes.content}>
                    <div className={classes.toolbar}></div>
                    <LoadRoute routes={routes} />
                </div>
            </div>
        </div>
    )
}

function LoadRoute({ routes }) {
    return (
        <Switch>
            {
                routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.component} />
                ))
            }
        </Switch>
    )
}

export default LayoutAdmin
