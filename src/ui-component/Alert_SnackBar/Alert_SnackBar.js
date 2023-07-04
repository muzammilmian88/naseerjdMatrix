import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Alert_SnackBar(props) {
  return (
    <Snackbar open={props.openSnackBar} autoHideDuration={3000} onClose={props.handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{marginTop:'70px'}}>
        <Alert onClose={props.handleClose} severity={props.msgType} sx={{ width: '100%' }}>
            {props.msg}
        </Alert>
    </Snackbar>
  )
}
