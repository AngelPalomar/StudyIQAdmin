import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.primary
    },
    inputs: {
        width: '100%'
    },
    formContainer: {
        marginBlock: 10
    },
    link: {
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none'
        }
    }
}))

export default useStyles