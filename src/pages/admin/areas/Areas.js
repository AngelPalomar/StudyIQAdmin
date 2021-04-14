import React, { useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import useStyles from './useStyles'

/**Componentes */

/**Iconos */
import AddIcon from '@material-ui/icons/Add'

function Areas() {
    const classes = useStyles()
    const [openCreateArea, setOpenCreateArea] = useState(false)

    return (
        <div className={classes.root}>

            <Typography style={{
                fontSize: '4vh'
            }}>Áreas de enseñanza</Typography>

            <Button
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateArea(true)}>
                Agregar Área de enseñanza
            </Button>
        </div>
    )
}

export default Areas
