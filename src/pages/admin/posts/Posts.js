import React, { useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import useStyles from './useStyles'

/**Componentes */
import PostsTable from './PostsTable'

/**Iconos */
import AddIcon from '@material-ui/icons/Add'
import CreatePost from './CreatePost'

function Posts() {
    const classes = useStyles()
    const [openCreatePost, setOpenCreatePost] = useState(false)

    return (
        <div className={classes.root}>
            <CreatePost open={openCreatePost} closeHandler={() => setOpenCreatePost(false)} />
            <Typography style={{
                fontSize: '4vh'
            }}>Publicaciones</Typography>
            <PostsTable />
            <Button
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreatePost(true)}>
                Agregar Usuario
            </Button>
        </div>
    )
}

export default Posts
