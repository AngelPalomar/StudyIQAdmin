import React, { useState, useEffect } from 'react'
import { Typography } from '@material-ui/core'
import { useStyles } from './useStyles'

import GoogleMap from 'google-map-react'

/**comp */
import UsuariosPorPais from './UsuariosPorPais'

function Dashboard() {
    const classes = useStyles()

    useEffect(() => {
        document.title = "StudyIQ - Resumen general"
    }, [])

    return (
        <div className={classes.root}>
            <UsuariosPorPais />
        </div>
    )
}

export default Dashboard
