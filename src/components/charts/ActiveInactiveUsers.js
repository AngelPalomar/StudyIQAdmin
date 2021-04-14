import React, { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { Typography, CircularProgress } from '@material-ui/core'
import firebase from '../../database/firebase'

function ActiveInactiveUsers() {
    //Esatdos para guardar a los usuarios
    const [users, setUsers] = useState([])
    //Datos para la gráfica
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        //Traer los usuarios
        getUsersList()
    }, [])

    useEffect(() => {
        if (users.length > 0) {
            usersFilterByType()
        }
    }, [users])

    //Función que trae los usuarios
    const getUsersList = async () => {
        const docUsers = await firebase.db
            .collection('usuarios')
            .onSnapshot(querySnapshot => {
                let usersList = []

                querySnapshot.docs.map((doc) => {
                    usersList.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })

                setUsers(usersList)
                setIsLoading(false)
            })
    }

    //Función que filtra los datos de usuarios para armar la gráfica
    const usersFilterByType = () => {
        //Filtro de usuarios activos
        let activeUsers = users.filter(obj => obj.activo)
        //Filtro de usuarios inactivos
        let inactiveUsers = users.filter(obj => !obj.activo)

        //Arma los datos para la gráfica
        setData([
            {
                "id": "Activo",
                "label": "Usuarios activos",
                "Activo": activeUsers.length,
                "color": "#3C50A2"
            },
            {
                "id": "Inactivo",
                "label": "Usuarios inactivos",
                "Inactivo": inactiveUsers.length,
                "color": "#8A99D5"
            }
        ])
    }

    if (isLoading) {
        return (
            <>
                <Typography style={{ fontSize: 25 }}>Comparativa de usuarios activos e inactivos</Typography>
                <CircularProgress color="secondary" />
            </>
        )
    }

    return (
        <div>
            <Typography style={{ fontSize: 25 }}>Comparativa de usuarios activos e inactivos</Typography>
            <div style={{
                height: '350px',
                color: "#000"
            }}>
                <ResponsiveBar
                    data={data}
                    keys={['Activo', 'Inactivo']}
                    indexBy="id"
                    theme={{
                        textColor: "#FFF"
                    }}
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ datum: 'data.color' }}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    borderRadius={6}
                    axisTop={null}
                    axisRight={null}
                    labelTextColor="#FFF"
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Estado del usuario',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Cantidad',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15} />
            </div>
        </div>
    )
}

export default ActiveInactiveUsers
