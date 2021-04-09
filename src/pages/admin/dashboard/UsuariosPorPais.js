import React, { useState, useEffect } from 'react'
import {
    Grid, Typography, FormControl, InputLabel, Select,
    MenuItem
} from '@material-ui/core'
import { useStyles } from './useStyles'
import GoogleMap from 'google-map-react'
import firebase from '../../../database/firebase'

/**COmpo */
import Marker from '../../../components/Marker'

/**APIs */
import { getPaises, getPaisByNombre } from '../../../api/paises'

function UsuariosPorPais() {
    const classes = useStyles()

    //Estado para los paises
    const [listaPaises, setListaPaises] = useState([])
    const [cantidadUsuarios, setCantidadUsuarios] = useState(0)
    const [selectedPais, setSelectedPais] = useState('Afghanistan')
    let usuariosDoc = null

    //Coordenadas del mapa
    const [coordinates, setCoordinates] = useState({
        lat: 0,
        lng: 0
    })

    //Efecto para traer la lista
    useEffect(() => {
        getPaises().then(response => {
            setListaPaises(response)
        })

        getUsuariosPais()
    }, [])

    useEffect(() => {
        //Busca la info del país
        getPaisByNombre(selectedPais).then(response => {
            const { latlng } = response[0]
            setCoordinates({ ...coordinates, lat: latlng[0], lng: latlng[1] })
        })

        getUsuariosPais()
    }, [selectedPais])

    const getUsuariosPais = async () => {
        let datos = []
        try {
            //Busca los usuarios por país
            usuariosDoc = await firebase.db.collection('usuarios')
                .where('pais', '==', `${selectedPais}`)
                .get().then(query => {
                    query.forEach(doc => {
                        if (doc.exists) {
                            datos.push(doc.data())
                        }
                    })
                })
        } catch (error) {
            console.log(error)
        }

        setCantidadUsuarios(datos.length)
    }

    //Función para obtener el cambio del pais
    const changePaisValue = (e) => {
        setSelectedPais(e.target.value)
    }

    return (
        <div>
            <Typography style={{ fontSize: 25 }}>Usuarios por país</Typography>
            <Grid container spacing={2} style={{ marginBlock: 10 }}>
                <Grid item lg={4} md={2} sm={12} xs={12}>
                    <FormControl variant="filled" color="secondary" className={classes.input}>
                        <InputLabel>Seleccione un país</InputLabel>
                        <Select
                            defaultValue={selectedPais ? selectedPais : " "}
                            onChange={changePaisValue}>
                            {
                                listaPaises.map((value, index) => (
                                    <MenuItem key={index} value={value.name ? value.name : " "}>{value.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item lg={8} md={10} sm={12} xs={12}>
                    <div style={{
                        height: '400px',
                        width: '100%'
                    }}>
                        <GoogleMap
                            bootstrapURLKeys={{
                                key: 'AIzaSyDu9upVa3rGN8yO2jBaoj8ZvPIXXxqqMR0',
                                language: 'es',
                                region: 'mx',
                                libraries: ['places']
                            }}
                            center={coordinates}
                            defaultZoom={5}>

                            <Marker
                                showLabels={true}
                                country={selectedPais}
                                info={`Cantidad: ${cantidadUsuarios}`}
                                lat={coordinates.lat}
                                lng={coordinates.lng} />
                        </GoogleMap>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default UsuariosPorPais
