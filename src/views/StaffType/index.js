import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';

import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Alert from "ui-component/Alert_SnackBar/Alert_SnackBar";

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
const columns = [{ id: 'name', label: 'Name', minWidth: 170 },{ id: 'short_name', label: 'Short Name', minWidth: 170 }];



export default function Index() {


    const [rows,setRows]=useState([]);
    const [page, setPage] =useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(5);
    const [open, setOpen] =useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => setOpenEdit(true);
    const handleEditClose = () => setOpenEdit(false);
    const [staff_name,Setstaff_name]=useState('');
    const [staff_short_name,set_staff_short_name]=useState('');
    const [submitted,setSubmitted]=useState(0);
    const [modeldata,setModelData]=useState({});
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const [msgType, setMsgType] = React.useState("");
  
  
    const handleClick = () => {
      setOpenSnackBar(true);
    };
    const handleSnackClose = () => {
      setOpenSnackBar(false);
    };
  

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangetext = (e) => {
        Setstaff_name(e.target.value);
    };
    const handleShortName = (e) => {
        set_staff_short_name(e.target.value);
    };
   

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // ---------------------------Get All Staff  Types-------------------------------------------
    function fetchStaffType(){
        axios.get('http://localhost:5000/staff_type/').then((response)=>{
            setRows(response.data)
        });
    }

    // ---------------------------add Staff  Type-------------------------------------------
    const submitaddform=()=>{
        if(staff_name.length !=0 ){
            axios.post('http://localhost:5000/staff_type/',{
                name:staff_name,
                shortname:staff_short_name,

            }).then((response)=>{
                if(response.error==true){
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }else{
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                }
                setOpen(false);
                setSubmitted(submitted+1);
            });
        }
    }
    
    // --------------------------------Edit Staff Type-------------------------------------
    const submiteditform=()=>{
        if(modeldata.name.length !=0){
            axios.patch('http://localhost:5000/staff_type/'+modeldata._id,{
                name:modeldata.name,
                shortname:modeldata.shortname,

            }).then((response)=>{
                if(response.error==true){
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }else{
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                }
                handleEditClose();
                setSubmitted(submitted+1);
            });
        }
    }
    // --------------------------------delete Staff Type-------------------------------------
    const deleteStaffType=(id)=>{
        
        axios.delete('http://localhost:5000/staff_type/'+id).then((response)=>{
            setSubmitted(submitted+1);
        }).catch((err)=>{
            console.log(err)
            setMsg(err.response.data.message);
            setMsgType('error');
            handleClick();
        });
       
    }
    const openModel=(staff)=>{
        setModelData(staff);
        handleEditOpen();

    }

    const handleEditNamefield = (e) => {
        let name_model={...modeldata};
        name_model.name=e.target.value;
        setModelData(name_model);
    };
    const handleEditShortNamefield = (e) => {
        let model_data={...modeldata};
        model_data.shortname=e.target.value;
        setModelData(model_data);
    };
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };
    useEffect(()=>{
        fetchStaffType()
    },[submitted])

    

    return (
        <>
        <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
        
        <MainCard title="Staff Types">
            <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpen}>
                Add Staff Type
            </Button>
            <Modal
                fullWidth
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h3" component="h2">
                        Add Staff Type
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                        <Grid item xs={12}>
                            <TextField fullWidth  id="outlined-basic" label="Name" variant="outlined" value={staff_name} onKeyPress={handleKeyPress} onChange={handleChangetext}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  id="outlined-basic" label="Short Name" variant="outlined" value={staff_short_name} onKeyPress={handleKeyPress} onChange={handleShortName}/>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} variant="outlined" onClick={submitaddform}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ marginTop: '3%', maxHeight: 440, borderRadius: '10px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, backgroundColor: '#5e35b1', color: 'white' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell style={{ minWidth: 170, backgroundColor: '#5e35b1', color: 'white' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <>
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                            
                                            <TableCell key={row._id}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell key={row._id}>
                                                {row.shortname}
                                            </TableCell>
                                               
                                            <TableCell key={row.name}>
                                                <EditIcon sx={{ color: '#2196f3' }} onClick={()=>openModel(row)} />
                                                <DeleteIcon sx={{ color: 'red' }} onClick={()=>deleteStaffType(row._id)}/>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                            <Modal
                                            
                                open={openEdit}
                                onClose={handleEditClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h3" component="h2">
                                        Edit Staff Type
                                    </Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={' Name'} value={modeldata.name} variant="outlined" onChange={handleEditNamefield}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={'Short Name'} value={modeldata.shortname} variant="outlined" onChange={handleEditShortNamefield}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} variant="outlined" onClick={submiteditform}>
                                                Edit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Modal>
                            
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 20, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
        </>
    );
}