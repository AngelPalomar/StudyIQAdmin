import React from 'react'
import {
    Typography, AppBar, Toolbar,
    Button, Container, IconButton
} from '@material-ui/core'
import { useStyles } from './useStyles'

/**APIs */
import { logout, getUserEmail } from '../../api/user'

/**Iconos */
import MenuIcon from '@material-ui/icons/Menu'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'

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
                <Typography>{getUserEmail()}</Typography>
                <Button
                    color="inherit"
                    style={{
                        marginInline: 10,
                        paddingInline: 20
                    }}
                    startIcon={<PowerSettingsNewIcon />}
                    onClick={() => {
                        //Cierra sesión
                        logout()

                        //Redirige al inicio
                        window.location.href = '/'
                    }}>Salir</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header
