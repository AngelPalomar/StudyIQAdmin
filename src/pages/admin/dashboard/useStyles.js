import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.primary
    },
    input: {
        width: '100%'
    }
}))