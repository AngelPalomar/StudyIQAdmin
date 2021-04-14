import React, { useState, useEffect } from 'react'
import { Typography, CircularProgress } from '@material-ui/core'
import { ResponsiveFunnel } from '@nivo/funnel'
import firebase from '../../database/firebase'

function ConsultanciesPerStatus() {
    //Esatdos para guardar a los usuarios
    const [consults, setConsults] = useState([])
    //Datos para la gráfica
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    //Efeto que trae las asesorias
    useEffect(() => {
        getConsultsList()
    }, [])

    //Efeto que filtra
    useEffect(() => {
        if (consults.length > 0) {
            filterConsultancies()
        }
    }, [consults])

    //Función que trae las asesorías
    const getConsultsList = async () => {
        const docConsults = await firebase.db
            .collection('asesorias')
            .onSnapshot(querySnapshot => {
                let conList = []

                querySnapshot.docs.map((doc) => {
                    conList.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })

                setConsults(conList)
                setIsLoading(false)
            })
    }

    //Función que filtra el estadod e las asesorías
    const filterConsultancies = () => {
        let solicitadas = consults.filter(obj => obj.estado === 'solicitada')
        let aceptadas = consults.filter(obj => obj.estado === 'aceptada')
        let rechazadas = consults.filter(obj => obj.estado === 'rechazada')
        let canceladas = consults.filter(obj => obj.estado === 'cancelada')
        let terminadas = consults.filter(obj => obj.estado === 'terminada')

        //Guardo los datos filtrados para deplegarlos en la gráfica
        setData([
            {
                "id": "solicitadas",
                "value": solicitadas.length,
                "label": "Solicitadas"
            },
            {
                "id": "aceptadas",
                "value": aceptadas.length,
                "label": "Aceptadas"
            },
            {
                "id": "rechazadas",
                "value": rechazadas.length,
                "label": "Rechazadas"
            },
            {
                "id": "canceladas",
                "value": canceladas.length,
                "label": "Canceladas"
            },
            {
                "id": "terminadas",
                "value": terminadas.length,
                "label": "Terminadas"
            },
        ])
    }

    if (isLoading) {
        return (
            <>
                <Typography style={{ fontSize: 25 }}>Cantidad de asesorías por estado</Typography>
                <CircularProgress color="secondary" />
            </>
        )
    }

    return (
        <div>
            <Typography style={{ fontSize: 25 }}>Cantidad de asesorías por estado</Typography>
            <div style={{ height: '350px', color: "#000" }}>
                <ResponsiveFunnel
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    valueFormat=">-.1s"
                    colors={{ scheme: 'blues' }}
                    borderWidth={20}
                    labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
                    beforeSeparatorLength={100}
                    beforeSeparatorOffset={20}
                    afterSeparatorLength={100}
                    afterSeparatorOffset={20}
                    currentPartSizeExtension={10}
                    currentBorderWidth={40}
                    motionConfig="wobbly"
                />
            </div>
        </div>
    )
}

export default ConsultanciesPerStatus
