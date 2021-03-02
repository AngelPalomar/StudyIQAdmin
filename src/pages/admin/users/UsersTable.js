import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../../../database/firebase'
import { Button, LinearProgress } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'

/**Componenes */
import CustomToolbar from '../../../components/CustomToolbar'

/**Iconos */
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'

function UsersTable() {
    //Estado del usuario
    const [userData, setUserData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [rowIdSelected, setRowIdSelected] = useState('')

    //Columnas
    const columns = [
        { field: 'authId', headerName: 'ID (Auth)', width: 100 },
        { field: 'id', headerName: 'ID (Doc)', width: 100, hide: true },
        { field: 'nombres', headerName: 'Nombres', hide: true },
        { field: 'apellidos', headerName: 'Apellido paterno', hide: true },
        {
            field: 'nombreCompleto',
            headerName: 'Nombre Completo',
            width: 200,
            valueGetter: (params) =>
                `${params.getValue('nombres') || ''} ${params.getValue('apellidos') || ''}`,
        },
        { field: 'email', headerName: 'Correo electrónico', width: 200 },
        { field: 'tipoUsuario', headerName: 'Tipo', width: 120 },
        { field: 'gradoEscolar', headerName: 'Grado escolar', width: 140 },
        {
            field: 'pais',
            headerName: 'País',
            width: 100
        },
        {
            field: 'activo',
            headerName: 'Activo',
            width: 120,
            renderCell: (params) => (
                params.getValue('activo') ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CheckCircleIcon />
                        <span style={{ marginLeft: 5 }}>Activo</span>
                    </div> :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CancelIcon />
                        <span style={{ marginLeft: 5 }}>Inactivo</span>
                    </div>
            ),
            description:
                'Estado del usuario',
        }
    ]

    //Efecto que toma los datos de Firebase
    useEffect(() => {
        firebase.db.collection('usuarios').onSnapshot((querySnapshot) => {
            let users = []

            querySnapshot.docs.map((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id
                })
            })

            setUserData(users)
            setIsLoading(false)
        })
    }, [])

    //Si seleccionó un usuario, redirige
    if (rowIdSelected !== '') {
        return <Redirect to={`/admin/usuarios/${rowIdSelected}`} />
    }

    //Retorna tabla
    return (
        <div style={{ height: 400, marginBlock: 15 }}>
            <DataGrid
                columns={columns}
                rows={userData}
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

export default UsersTable
