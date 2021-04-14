import React, { useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import useStyles from './useStyles'

/**Componentes */
import ConsultanciesTable from './ConsultanciesTable'
import CreateConsultancy from './CreateConsultancy'

/**Iconos */
import AddIcon from '@material-ui/icons/Add'

function Consultancies() {
    const classes = useStyles()
    const [openCreateConsult, setOpenCreateConsult] = useState(false)

    return (
        <div className={classes.root}>
            <CreateConsultancy open={openCreateConsult} closeHandler={() => setOpenCreateConsult(false)} />
            <Typography style={{
                fontSize: '4vh'
            }}>Asesorías</Typography>
            <ConsultanciesTable />
            <Button
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateConsult(true)}>
                Crear solicitud de asesoría
            </Button>
        </div>
    )
}

export default Consultancies
