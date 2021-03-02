import React from 'react'
import {
    makeStyles, Typography, AppBar, Toolbar,
    Button, Container
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    app: {
        width: '100%',
        display: 'block'
    },
}))

function PublicHeader() {
    const classes = useStyles()

    return (
        <AppBar className={classes.app} >
            <Toolbar>
                <Container>
                    <Typography variant="h6">StudyIQ - Panel</Typography>
                </Container>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}

export default PublicHeader
