import React from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography
} from '@material-ui/core'

function CustomNotification(props) {
    const { children, title, open, onClose, onAccept } = props

    return (
        <Dialog
            open={open}
            onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>Cancelar</Button>
                <Button color="secondary" onClick={onAccept}>Aceptar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomNotification
