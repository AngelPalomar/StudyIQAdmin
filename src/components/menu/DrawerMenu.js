import React from 'react'
import { Link } from 'react-router-dom'
import { Drawer, Typography } from '@material-ui/core'
import { useStyles } from './useStyles'

/**Lista */
import MenuList from './MenuList'

function NavMenu(props) {
    const classes = useStyles()

    return (
        <Drawer
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
            variant={props.variant}
            open={props.open}
            onClose={props.onClose ? props.onClose : null}
            anchor="left">
            <div className={classes.toolbar}>
                <div className={classes.logo}>
                    <Link to="/admin" className={classes.link}>
                        {/*<Logo className={classes.logoSize} />*/}
                        <Typography style={{ fontSize: '26px' }}>
                            StudyIQ
                        </Typography>
                    </Link>
                </div>
            </div>
            <MenuList close={props.onClose} url={props.url} />
        </Drawer>
    )
}

export default NavMenu
