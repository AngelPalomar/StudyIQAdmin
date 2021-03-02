import React from 'react'
import {
    Typography, AppBar, Toolbar,
    Button, Container, IconButton
} from '@material-ui/core'
import { useStyles } from './useStyles'

/**Iconos */
import MenuIcon from '@material-ui/icons/Menu'

function Header(props) {
    const classes = useStyles()

    return (
        <AppBar className={classes.app} >
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton}
                    aria-label="menu" onClick={() => props.OpenAction()}>
                    <MenuIcon />
                </IconButton>
                <Container>
                    <Typography variant="h6">Panel de administración</Typography>
                </Container>
                <Button color="inherit">Salir</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header
