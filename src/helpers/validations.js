/**Función para validar el correo */
export function emailValidation(email) {
    const regex = /^([a-zA-Z0-9_.])+@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //Si el email no es váliso
    if (regex.test(email)) {
        return true
    } else {
        return false
    }
}

/**Función para validar campos */
export function minLengthValidation(n, value) {
    //Si la longitud requerida es la correcta
    if (value.length >= n) {
        return true
    } else {
        return false
    }
}