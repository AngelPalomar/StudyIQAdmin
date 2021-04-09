import React from 'react'

/**Icons */
import RoomIcon from '@material-ui/icons/Room'
import { Typography } from '@material-ui/core'

function Marker(props) {
    const { showLabels, country, info } = props

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            margin: -20,
            marginBottom: 0
        }}>
            {
                showLabels ?
                    <div style={{
                        background: '#FFF',
                        border: 1,
                        borderColor: '#000',
                        borderStyle: 'solid',
                        height: 30,
                        width: 130
                    }}>
                        <Typography style={{ fontSize: 10, color: '#000' }}>
                            {country}
                        </Typography>
                        <Typography style={{ fontSize: 10, color: '#000' }}>
                            {info}
                        </Typography>
                    </div> : null
            }
            <RoomIcon style={{
                color: '#D1193B',
                fontSize: 36,
                textShadow: '5px 5px 5px #FFFFFF',
            }} />
        </div>
    )
}

export default Marker
