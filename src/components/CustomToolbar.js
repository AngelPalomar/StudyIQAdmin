import React from 'react'
import {
    GridToolbarContainer,
    GridColumnsToolbarButton,
    GridFilterToolbarButton,
    GridToolbarExport,
    GridDensitySelector
} from '@material-ui/data-grid'

function CustomToolbar() {
    return (
        <GridToolbarContainer style={{ background: '#9FABDC' }}>
            <GridColumnsToolbarButton />
            <GridFilterToolbarButton />
            <GridDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    )
}

export default CustomToolbar
