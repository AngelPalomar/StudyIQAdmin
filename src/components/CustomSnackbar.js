import React from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

//Alerta
function MuiAlert(props) {
    return (
        <Alert elevation={3} variant="filled" {...props} />
    )
}

//Snackbar
function CustomSnackbar(props) {
    const { open, onClose, severity, children } = props

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MuiAlert onClose={onClose} severity={severity}>
                {children}
            </MuiAlert>
        </Snackbar>
    )
}

export default CustomSnackbar
