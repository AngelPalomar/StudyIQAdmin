import React, { useState, useEffect } from 'react'
import { Typography, CircularProgress } from '@material-ui/core'
import { ResponsivePie } from '@nivo/pie'
import firebase from '../../database/firebase'

function UsersTypePie() {
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
        //Filtro de usuarios tipo admin
        let adminUsers = users.filter(obj => obj.tipoUsuario === 'Administrador')
        //Filtro de usuarios tipo maestro
        let tutorUsers = users.filter(obj => obj.tipoUsuario === 'Maestro')
        //Filtro de usuarios tipo alumno
        let studentsUsers = users.filter(obj => obj.tipoUsuario === 'Alumno')

        //Arma los datos para la gráfica
        setData([
            {
                "id": "Administradores",
                "label": "Administradores",
                "value": adminUsers.length,
                "color": "#8A99D5"
            },
            {
                "id": "Maestros",
                "label": "Maestros",
                "value": tutorUsers.length,
                "color": "#9FABDC"
            },
            {
                "id": "Alumnos",
                "label": "Alumnos",
                "value": studentsUsers.length,
                "color": "#D9DEF1"
            },
        ])
    }

    if (isLoading) {
        return (
            <>
                <Typography style={{ fontSize: 25 }}>Distribución de usuarios por tipo</Typography>
                <CircularProgress color="secondary" />
            </>
        )
    }

    return (
        <div>
            <Typography style={{ fontSize: 25 }}>Distribución de usuarios por tipo</Typography>
            <div style={{ height: '350px', color: "#000" }}>
                <ResponsivePie
                    data={data}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    theme={{
                        textColor: "#FFF"
                    }}
                    colors={{ datum: 'data.color' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextColor="#D9DEF1"
                    radialLabelsLinkColor={{ from: 'color' }}
                    sliceLabelsSkipAngle={10}
                    sliceLabelsTextColor="#273469"
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 20,
                            translateY: 56,
                            itemsSpacing: 25,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#D9DEF1',
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]} />
            </div>
        </div>
    )
}

export default UsersTypePie
