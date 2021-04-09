const UID = 'uid'
const EMAIL = 'email'

//Función para guardar el id
export function login(uid, email) {
    localStorage.setItem(UID, uid)
    localStorage.setItem(EMAIL, email)
}

//Función para cerrar sesión
export function logout() {
    localStorage.removeItem(UID)
    localStorage.removeItem(EMAIL)
}

//Función para obtener el id del usuario
export function getUserUniqueId() {
    const userUid = localStorage.getItem(UID)

    if (!userUid || userUid === "null") {
        return null
    } else {
        return userUid
    }
}

//Función para obtener el email del usuario
export function getUserEmail() {
    const userEmail = localStorage.getItem(EMAIL)

    if (!userEmail || userEmail === "null") {
        return null
    } else {
        return userEmail
    }
}