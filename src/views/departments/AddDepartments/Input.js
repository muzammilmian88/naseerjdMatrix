import { Grid, TextField } from '@mui/material';
import React from 'react';

export default function Input(props) {
    return (
        <Grid xs={props.col} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <TextField fullWidth id="outlined-basic" label={props.label} variant="outlined" />
        </Grid>
    );
}
