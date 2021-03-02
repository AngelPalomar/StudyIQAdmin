import React, { useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import useStyles from './useStyles'

/**Componentes */
import UsersTable from './UsersTable'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'

/**Iconos */
import AddIcon from '@material-ui/icons/Add'

function Users() {
    const classes = useStyles()
    const [openCreateUser, setOpenCreateUser] = useState(false)

    return (
        <div className={classes.root}>
            <CreateUser open={openCreateUser} closeHandler={() => setOpenCreateUser(false)} />
            <Typography style={{
                fontSize: '4vh'
            }}>Usuarios</Typography>
            <UsersTable />
            <Button
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateUser(true)}>
                Agregar Usuario
            </Button>
        </div>
    )
}

export default Users
