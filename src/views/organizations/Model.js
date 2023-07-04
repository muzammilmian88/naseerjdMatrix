import React from 'react'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { useState } from 'react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4
};


export default function Model(props) {

    const [openEdit, setOpenEdit] = useState(false);
    const handleEditOpen = () => setOpenEdit(true);
    const handleEditClose = () => setOpenEdit(false);

  return (

      <Modal
                                            
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h3" component="h2">
                    Edit Organization
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                    <Grid item xs={12}>
                        <TextField fullWidth id="outlined-basic" label={props.org.id} variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} variant="outlined">
                            Edit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    
  )
}
