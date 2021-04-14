import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../../../database/firebase'
import { LinearProgress } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'

/**Componenes */
import CustomToolbar from '../../../components/CustomToolbar'

/**Iconos */
import CreateIcon from '@material-ui/icons/Create'
import StarIcon from '@material-ui/icons/Star'

function PostsTable() {
    //Estado del usuario
    const [postData, setPostData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [rowIdSelected, setRowIdSelected] = useState('')

    //Columnas
    const columns = [
        { field: 'id', headerName: 'ID (Doc)', width: 100, hide: true },
        { field: 'autor', headerName: 'Autor', width: 200 },
        { field: 'fechaString', headerName: 'Fecha', width: 200 },
        { field: 'texto', headerName: 'Texto', width: 300 },
        {
            field: 'imagenUrl',
            headerName: 'Imagen',
            with: 100,
            renderCell: (params) => (
                params.getValue('imagenUrl') && (
                    <img
                        src={params.getValue('imagenUrl')}
                        style={{ width: 50, height: 50 }}
                        alt="imagen.png" />
                )
            )
        },
        {
            field: 'editado',
            headerName: 'Editado',
            width: 120,
            renderCell: (params) => (
                params.getValue('editado') ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CreateIcon />
                        <span style={{ marginLeft: 5 }}>Editado</span>
                    </div> :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <StarIcon />
                        <span style={{ marginLeft: 5 }}>Original</span>
                    </div>
            ),
            description:
                'Indicador de edición',
        }
    ]

    //Efecto que toma los datos de Firebase
    useEffect(() => {
        firebase.db.collection('publicaciones').onSnapshot((querySnapshot) => {
            let posts = []

            querySnapshot.docs.map((doc) => {
                posts.push({
                    ...doc.data(),
                    id: doc.id,
                    fechaString: new Date(
                        doc.data().fecha.anio,
                        doc.data().fecha.mes,
                        doc.data().fecha.dia,
                        doc.data().fecha.hora,
                        doc.data().fecha.minuto
                    ).toString()
                })
            })

            setPostData(posts)
            setIsLoading(false)
        })
    }, [])

    //Si seleccionó un usuario, redirige
    if (rowIdSelected !== '') {
        return <Redirect to={`/admin/posts/${rowIdSelected}`} />
    }

    //Retorna tabla
    return (
        <div style={{ height: 400, marginBlock: 15 }}>
            <DataGrid
                columns={columns}
                rows={postData}
                pageSize={10}
                onCellClick={(GridCellParams) => {
                    setRowIdSelected(GridCellParams.row.id)
                }}
                loading={isLoading}
                components={{
                    LoadingOverlay: LinearProgress,
                    Toolbar: CustomToolbar
                }} />
        </div>
    )
}

export default PostsTable
