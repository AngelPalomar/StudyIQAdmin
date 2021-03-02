import { makeStyles } from '@material-ui/core'

const drawerWidth = 240
export const useStyles = makeStyles((theme) => ({
    //Header
    menuButton: {
        marginRight: theme.spacing(2),
        color: theme.palette.text.primary,
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        }
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.text.primary,
        }
    },
    app: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },

    //Drawer
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main
    },
    logo: {
        textAlign: "center",
        marginTop: theme.spacing(1.3)
    },
    logoSize: {
        width: '75%'
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.text.primary,
        }
    },

    //List
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    list: {
        backgroundColor: theme.palette.primary.main
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover': {
            textDecoration: 'none',
            color: theme.palette.text.primary
        }
    }
}))