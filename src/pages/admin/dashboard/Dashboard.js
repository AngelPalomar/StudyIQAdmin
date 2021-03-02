import React, { useEffect } from 'react'
import { Typography } from '@material-ui/core'

function Dashboard() {

    useEffect(() => {
        document.title = "StudyIQ - Resumen general"
    }, [])

    return (
        <Typography>
            Dashboard
        </Typography>
    )
}

export default Dashboard
