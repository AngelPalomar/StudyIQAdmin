import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    paper: {
        marginTop: theme.spacing(13),
        width: '360px',
        padding: theme.spacing(2)
    },
    title: {
        fontSize: '5vh',
        textAlign: 'center',
        marginBottom: theme.spacing(3)
    },
    formContainer: {
        marginBlock: theme.spacing(2)
    },
    buttonContainer: {
        marginBlock: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        marginBlock: theme.spacing(1)
    }
}))