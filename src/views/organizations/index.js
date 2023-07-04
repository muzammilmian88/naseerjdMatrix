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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4
};
const columns = [{ id: 'name', label: 'Name', minWidth: 170 }];



export default function Organisations() {


    const [rows,setRows]=useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => setOpenEdit(true);
    const handleEditClose = () => setOpenEdit(false);
    const [OrgName,SetOrgName]=useState('');
    const [submitted,setSubmitted]=useState(0);
    const [modeldata,setModelData]=useState({});
    // --------------------------For Snacbar Alert-----------------------------------
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('');
    const handleClick = () => { 
        
        setOpenSnackBar(true);
    };
    const handleSnackClose = () => {
        setOpenSnackBar(false);
    };
   // --------------------------End Snacbar Alert-----------------------------------

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangetext = (e) => {
        SetOrgName(e.target.value);
    };
   

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // ---------------------------Get All Organizations-------------------------------------------
    function fetchOrganizaion(){
        axios.get('http://localhost:5000/organization/').then((response)=>{
            setRows(response.data)
        });
    }

    // ---------------------------add Organization-------------------------------------------
    const submitaddform=()=>{
        if(OrgName.length !=0 ){
            axios.post('http://localhost:5000/organization/',{
                name:OrgName
            }).then((response)=>{
                setOpen(false);
                
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                    
                }else{
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
                SetOrgName('');
                setSubmitted(submitted+1);
            });
        }
    }
    
    // --------------------------------Edit Organization-------------------------------------
    const submiteditform=()=>{
        if(modeldata.name.length !=0){
            axios.patch('http://localhost:5000/organization/'+modeldata._id,{
                name:modeldata.name
            }).then((response)=>{
                handleEditClose();
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                    
                }else{
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
                setSubmitted(submitted+1);
            });
        }
    }
    // --------------------------------delete Organization-------------------------------------
    const deleteOrg=(id)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:5000/organization/'+id).then((response)=>{
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                    setSubmitted(submitted+1);
                }).catch((err)=>{
                    setMsg(err.response.data.message);
                    setMsgType('error');
                    handleClick();
                });
              
            }
          })
       
       
    }
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };
    const openModel=(org)=>{
        setModelData(org);
        handleEditOpen();
    }

    const handleEditNamefield = (e) => {
        let org_data={...modeldata};
        org_data.name=e.target.value;
        setModelData(org_data);
    };



    useEffect(()=>{
        fetchOrganizaion()
    },[submitted])

    

    return (
        <>
        <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
        <MainCard title="Organizations">
            <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpen}>
                Add Organization
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
                        Add Organization
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                        <Grid item xs={12}>
                            <TextField fullWidth onKeyPress={handleKeyPress}  id="outlined-basic" label="Organization Name" variant="outlined" value={OrgName} onChange={handleChangetext}/>
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
                                               
                                            <TableCell key={row.name}>
                                                <Link to={"organization_detail/"+row._id}>
                                                    <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} />
                                                </Link>
                                                <EditIcon sx={{ color: '#2196f3' }} onClick={()=>openModel(row)} />
                                                <DeleteIcon sx={{ color: 'red' }} onClick={()=>deleteOrg(row._id)}/>
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
                                        Edit Organization
                                    </Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                                        <Grid item xs={12}>
                                            <TextField fullWidth onKeyPress={handleKeyPress} id="outlined-basic" label={'Organization Name'} value={modeldata.name} variant="outlined" onChange={handleEditNamefield}/>
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
