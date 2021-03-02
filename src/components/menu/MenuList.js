import React from 'react'
import { Link } from "react-router-dom";
import { makeStyles, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { useStyles } from './useStyles'

/**Icons */
import DashboardIcon from '@material-ui/icons/Dashboard'
import GroupIcon from '@material-ui/icons/Group'
import RateReviewIcon from '@material-ui/icons/RateReview'
import KeyboardIcon from '@material-ui/icons/Keyboard'
import BookmarkIcon from '@material-ui/icons/Bookmark'

function MenuList(props) {
    const { url } = props
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <List component="nav" className={classes.list}>
                <Link to={'/admin'} className={classes.link}>
                    <ListItem button onClick={props.close} selected={url === '/admin' ? true : false}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Resumen" />
                    </ListItem>
                </Link>
                <Link to={'/admin/usuarios'} className={classes.link}>
                    <ListItem button onClick={props.close} selected={url === '/admin/usuarios' ? true : false}>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Usuarios" />
                    </ListItem>
                </Link>
                <Link to={'/admin/asesorias'} className={classes.link}>
                    <ListItem button onClick={props.close} selected={url === '/admin/asesorias' ? true : false}>
                        <ListItemIcon>
                            <RateReviewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Asesorías" />
                    </ListItem>
                </Link>
                <Link to={'/admin/posts'} className={classes.link}>
                    <ListItem button onClick={props.close} selected={url === '/admin/posts' ? true : false}>
                        <ListItemIcon>
                            <KeyboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Publicaciones" />
                    </ListItem>
                </Link>
                <Link to={'/admin/areas'} className={classes.link}>
                    <ListItem button onClick={props.close} selected={url === '/admin/areas' ? true : false}>
                        <ListItemIcon>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Areas de enseñanza" />
                    </ListItem>
                </Link>
            </List>
        </div>
    )
}

export default MenuList
