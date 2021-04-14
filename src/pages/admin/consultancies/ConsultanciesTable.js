import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import firebase from '../../../database/firebase'
import { LinearProgress } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'

/**Componenes */
import CustomToolbar from '../../../components/CustomToolbar'

/**Iconos */
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import SendIcon from '@material-ui/icons/Send'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'

function ConsultanciesTable() {
    //Estado del usuario
    const [consulData, setConsulData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [rowIdSelected, setRowIdSelected] = useState('')

    //Columnas
    const columns = [
        { field: 'id', headerName: 'ID (Doc)', width: 100, hide: true },
        { field: 'titulo', headerName: 'Titulo', width: 125 },
        { field: 'descripcion', headerName: 'Descripción', width: 125 },
        { field: 'fechaString', headerName: 'Fecha', width: 125 },
        { field: 'alumno', headerName: 'Alumno solicitante', width: 200 },
        { field: 'maestro', headerName: 'Maestro solicitado', width: 200 },
        { field: 'duracion', headerName: 'Duración (horas)', width: 90, type: 'number' },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
                params.getValue('estado') === "solicitada" ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <SendIcon />
                        <span style={{ marginLeft: 5 }}>Solicitada</span>
                    </div> :
                    params.getValue('estado') === "aceptada" ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ThumbUpAltIcon />
                            <span style={{ marginLeft: 5 }}>Aceptada</span>
                        </div> :
                        params.getValue('estado') === "rechazada" ?
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ThumbDownIcon />
                                <span style={{ marginLeft: 5 }}>Rechazada</span>
                            </div> :
                            params.getValue('estado') === "cancelada" ?
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CancelIcon />
                                    <span style={{ marginLeft: 5 }}>Cancelada</span>
                                </div> :
                                params.getValue('estado') === "terminada" ?
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <CheckCircleIcon />
                                        <span style={{ marginLeft: 5 }}>Terminada</span>
                                    </div> : null
            ),
            description:
                'Estado de la asesoría',
        }
    ]

    //Efecto que toma los datos de Firebase
    useEffect(() => {
        firebase.db.collection('asesorias').onSnapshot((querySnapshot) => {
            let consultant = []

            querySnapshot.docs.map((doc) => {
                consultant.push({
                    ...doc.data(),
                    id: doc.id,
                    fechaString: `${doc.data().inicia.anio}-${doc.data().inicia.mes}-${doc.data().inicia.dia}`
                })
            })

            setConsulData(consultant)
            setIsLoading(false)
        })
    }, [])

    //Si seleccionó un usuario, redirige
    if (rowIdSelected !== '') {
        return <Redirect to={`/admin/asesorias/${rowIdSelected}`} />
    }

    //Retorna tabla
    return (
        <div style={{ height: 400, marginBlock: 15 }}>
            <DataGrid
                columns={columns}
                rows={consulData}
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

export default ConsultanciesTable
