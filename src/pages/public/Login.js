import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Paper, Typography, TextField, Button, CircularProgress } from '@material-ui/core'
import { useStyles } from './useStyles'
import firebase from '../../database/firebase'
import firebase2 from 'firebase'

/**Componenet */
import PublicHeader from '../../components/PublicHeader'
import Snackbar from '../../components/CustomSnackbar'

/**Helpers */
import { emailValidation } from '../../helpers/validations'
import { get_error } from '../../helpers/errors_es_mx'

/**APIs */
import { login, getUserUniqueId } from '../../api/user'

//Iconos
import PersonIcon from '@material-ui/icons/Person'
import FacebookIcon from '@material-ui/icons/Facebook'

//Imagenes
import googleIcon from '../../assets/google-logo.png'

function Login() {
    const classes = useStyles()

    //Inicia sesión
    let usuario = null

    //Estado para el loading
    const [isLoading, setIsLoading] = useState(false)
    const [googleData, setGoogleData] = useState({})

    //Estados que redirigen
    const [wasLogged, setWasLogged] = useState(false)

    //Estado para las credenciales
    const [inputs, setInputs] = useState({
        email: '',
        pin: ''
    })

    //Estado para las alertas
    const [openSnack, setOpenSnack] = useState(false)
    const [message, setMessage] = useState("")

    //Función qur guarda los datos en el estado
    const changeValues = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    //Función para uniciar sesión
    const loginUser = async (e) => {
        e.preventDefault()

        //Validaciones
        if (inputs.email === '' || inputs.pin === '') {
            setOpenSnack(true)
            setMessage('Todos los campos son requeridos')
            return
        }

        //Valida email
        if (!emailValidation(inputs.email)) {
            setOpenSnack(true)
            setMessage('Ingrese un correo válido')
            return
        }

        //Inicia carga
        setIsLoading(true)

        try {
            //Inicia sesión con credenciales
            usuario = await firebase.auth.signInWithEmailAndPassword(
                inputs.email,
                inputs.pin
            )

            //Busca el documento e inicia sesió
            getDocumentLoginUsingAPI(usuario.user)
        } catch (error) {
            //Para carga
            setIsLoading(false)

            //Muestra mensaje de error
            setOpenSnack(true)
            setMessage(error.toString())
        }
    }

    //Función para el inicio de sesión con Google
    const responseGoogle = () => {
        //Proveedor
        let provider = new firebase2.auth.GoogleAuthProvider()

        //Abrimos el modal de Google
        let googleAuth = firebase2.auth()
            .signInWithPopup(provider)
            .then(googleAuth => {
                //Buscamos sus datos en la BD
                getDocumentLoginUsingAPI(googleAuth.user)
            }).catch(error => {
                //Para carga
                setIsLoading(false)

                //Muestra mensaje de error
                setOpenSnack(true)
                setMessage(error.toString())
            })
    }

    //Función para traer los datos de facebook
    const responseFacebook = () => {
        let provider = new firebase2.auth.FacebookAuthProvider()

        //Abrimos el modal
        let facebookAuth = firebase2.auth()
            .signInWithPopup(provider)
            .then(faceAuth => {
                //Crea el usuario en la BD
                getDocumentLoginUsingAPI(faceAuth.user)
            }).catch(error => {
                //Para carga
                setIsLoading(false)

                //Muestra mensaje de error
                setOpenSnack(true)
                setMessage(error.toString())
            })
    }

    //Buscar documento de usuario por API
    const getDocumentLoginUsingAPI = (user) => {

        //Inicia la carga
        setIsLoading(true)

        //Busca su usuario en firebase
        const usuarioDoc = firebase.db.collection('usuarios')
            .where('email', '==', `${user.email}`)

        usuarioDoc.get().then(doc => {
            if (!doc.empty) {
                //Verifica que el usuario sea administrador y que esté activo
                if (doc.docs[0].data().tipoUsuario !== "Administrador") {
                    //Muestra mensaje de error
                    setIsLoading(false)
                    setOpenSnack(true)
                    setMessage("Usuario no disponible")
                } else {
                    //Si no está activo
                    if (!doc.docs[0].data().activo) {
                        //Muestra mensaje de error
                        setIsLoading(false)
                        setOpenSnack(true)
                        setMessage("Usuario no disponible")
                    } else {
                        //Guarda el auth id en el local storage
                        login(user.uid, user.email)

                        //Redirige al panel
                        setWasLogged(true)
                    }
                }
            } else {
                //Creación de cuenta si no existe
                createUserFromAPI(user)
            }
        }).catch(error => {
            //Para carga
            setIsLoading(false)

            //Muestra mensaje de error
            setOpenSnack(true)
            setMessage(error.toString())
        })
    }

    //Función para crear usuario desde API
    const createUserFromAPI = (user) => {
        const createUserDoc = firebase.db
            .collection('usuarios')

        //modifica la contraseña del usuario creado en el auth
        user.updatePassword(user.uid)

        //Crea el nuevo usuario
        createUserDoc.add({
            nombres: user.displayName,
            apellidos: '',
            email: user.email,
            pin: user.uid,
            tipoUsuario: 'Administrador',
            gradoEscolar: 'Universidad',
            pais: 'Mexico',
            authId: user.uid,
            avatar: user.photoURL,
            activo: false
        }).then(() => {
            //Para la carga
            setIsLoading(false)

            //Muestra mensaje de creación de cuenta
            setOpenSnack(true)
            setMessage("Tu cuenta ha sido creada, sin embargo, necesita ser habilitada por un administrador")
        }).catch(error => {
            setOpenSnack(true)
            setMessage(error.toString())
        })
    }

    //Si la sesión ya está, redirige al panel
    if (getUserUniqueId()) {
        return <Redirect to="/admin" />
    }

    //Si se inició sesión, se envía al panel
    if (wasLogged) {
        return <Redirect to="/admin" />
    }

    return (
        <>
            <PublicHeader />
            <Snackbar open={openSnack} onClose={() => setOpenSnack(false)} severity="error">
                {message}
            </Snackbar>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography className={classes.title}>Iniciar sesión</Typography>
                    <Typography>* Todos los campos son requeridos</Typography>
                    <form onSubmit={loginUser} onChange={changeValues} className={classes.formContainer}>
                        <TextField
                            name="email"
                            label="Correo electrónico"
                            variant="filled"
                            color="secondary"
                            className={classes.input} />
                        <TextField
                            name="pin"
                            type="password"
                            label="Contraseña"
                            variant="filled"
                            color="secondary"
                            className={classes.input} />
                        <div className={classes.buttonContainer}>
                            {
                                !isLoading ?
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<PersonIcon />}
                                            style={{ marginBottom: 10 }}>
                                            Ingresar
                                        </Button>
                                        <Button
                                            onClick={responseGoogle}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<img src={googleIcon} style={{ width: 18 }} alt="google-logo.png" />}
                                            style={{ marginBottom: 10 }}>
                                            Ingresar con Google
                                        </Button>
                                        <Button
                                            onClick={responseFacebook}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<FacebookIcon />}
                                            style={{ marginBottom: 10 }}>
                                            Ingresar con Facebook
                                </Button>

                                    </div> :
                                    <CircularProgress color="secondary" />
                            }
                        </div>
                    </form>
                </Paper>
            </div>
        </>
    )
}

export default Login
