import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { useStyles } from './useStyles'

/**comp */
import UsuariosPorPais from './UsuariosPorPais'
import UsersTypePie from '../../../components/charts/UsersTypePie'
import ConsultanciesPerStatus from '../../../components/charts/ConsultanciesPerStatus'
import ActiveInactiveUsers from '../../../components/charts/ActiveInactiveUsers'

function Dashboard() {
    const classes = useStyles()

    useEffect(() => {
        document.title = "StudyIQ - Resumen general"
    }, [])

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item lg={6}>
                    <UsersTypePie />
                </Grid>
                <Grid item lg={6}>
                    <ConsultanciesPerStatus />
                </Grid>
                <Grid item lg={6}>
                    <ActiveInactiveUsers />
                </Grid>
            </Grid>
            <UsuariosPorPais />
        </div>
    )
}

export default Dashboard
