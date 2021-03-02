import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    typography: {
        fontFamily: "Roboto, sans-serif",
        button: {
            textTransform: "none",
            fontSize: "1rem"
        }
    },

    palette: {
        type: 'dark',
        primary: {
            light: "#3C50A2",
            main: "#273469",
            dark: "#243061"
        },
        secondary: {
            light: "#D9DEF1",
            main: "#9FABDC",
            dark: "#8A99D5"
        },
        background: {
            paper: "#30343f"
        }
    },
})

export default theme