export function get_error(tipo) {
    switch (tipo) {
        case 'auth/email-already-in-use':
            return 'Usuario no disponible';
        case 'auth/invalid-email':
            return 'Correo electrónico inválido';
        case 'auth/user-not-found':
            return 'Usuario no encontrado';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta';
        case 'auth/user-disabled':
            return 'Esta cuenta ha sido inhabilitada por un administrador'
        case 'auth/too-many-requests':
            return 'Demasiados intentos, vuelva más tarde'
        default:
            return tipo;
    }
}