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
import ListAltIcon from '@mui/icons-material/ListAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';
import { useState } from 'react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 500,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 2,
    p: 4
};
const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'short_name', label: 'Short Name', minWidth: 170 },
];



export default function OrganizationDetail() {

    const { id } = useParams();
    const [page, setPage] = React.useState(0);
    const [OrgDetail, setOrgDetail] = React.useState({});
    const [dpt, setDpt] = React.useState([]);
    const [subDptName, setDptName] = React.useState('');
    const [editDptID, setEditDptID] = React.useState('');
    const [editDptName, setEditDptName] = React.useState('');
    const [editDptShortName, setEditDptShortName] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    const [submitted, setSubmitted] = React.useState(0);
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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };




    function fetchOrgartment() {
        axios.get('http://localhost:5000/organization/' + id).then((response) => {
            setOrgDetail(response.data.organization)
            setDpt(response.data.departments)

        });
    }
    const submiteditform=()=>{
        if(editDptID.length!=0 && editDptName.length!=0){
            axios.patch('http://localhost:5000/department/'+editDptID,{
                name:editDptName,
                short_name:editDptShortName
            }).then((response)=>{
                handleEditClose();
                setSubmitted(submitted+1);
            });
        }
    }
    const handleDelete= (id)=>{ 
        
        axios.delete('http://localhost:5000/department/'+id).then((response)=>{
            setMsg(response.data.message);
            setMsgType('success');
            handleClick();
            setSubmitted(submitted+1);
        }).catch((err)=>{
            console.log(err)
            setMsg(err.response.data.message);
            setMsgType('error');
            handleClick();
        });
    }

    const handleModel=(data)=>{
        
        setEditDptName(data.name)
        setEditDptID(data._id)
        setEditDptShortName(data.short_name)
        handleEditOpen();
    }
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };


    const handleEditNameField=(e)=>{
        setEditDptName(e.target.value);
    }
    const handleEditShortNameField=(e)=>{
        setEditDptShortName(e.target.value);
    }
    useEffect(() => {
        fetchOrgartment();
    }, [submitted])
    const extract_date=(date)=>{
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const d=new Date(date)
        return d.getDate()+"-"+months[d.getMonth()]+"-"+d.getFullYear()
    }
    return (
        <>
        <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
            <MainCard title="Organizaton Detail" sx={{ paddingBottom: '2%' }}>
            <Link to={"/admin/departments/add/"+id}>
                <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained">
                    Add Department
                </Button>
            </Link>

                <Grid container sx={{ marginTop: '20px' }}>
                    <Grid md={4} sm={12}>
                        <h4>Organization Name:</h4> {OrgDetail.name}
                    </Grid>
                    
                    <Grid md={4} sm={12}>
                        <h4>Organization Creation Date :</h4> {extract_date(OrgDetail.createdAt)}
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard title="Departments" sx={{ marginTop: '3%' }}>
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
                                {dpt.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <>
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.short_name}
                                                </TableCell>
                                                <TableCell key={row.name}>
                                                    <a href={"/admin/departments/departmentDetail/"+row._id}>
                                                        <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} />
                                                    </a>
                                                    <EditIcon sx={{ color: '#2196f3' }} onClick={()=>handleModel(row)} />
                                                    <DeleteIcon sx={{ color: 'red' }} onClick={()=>handleDelete(row._id)}/>
                                                </TableCell>
                                            </TableRow>
                                            <Modal
                                                open={editOpen}
                                                onClose={handleEditClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>
                                                    <Typography id="modal-modal-title" variant="h3" component="h2">
                                                        Edit Department
                                                    </Typography>
                                                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="outlined-basic" label={'Sub Orgartment Name'} onKeyPress={handleKeyPress} value={editDptName} variant="outlined" onChange={handleEditNameField}/>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="outlined-basic" label={'Orgartment Short Name'} onKeyPress={handleKeyPress} value={editDptShortName} variant="outlined" onChange={handleEditShortNameField}/>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Button
                                                                fullWidth
                                                                sx={{ height: '50px', borderRadius: '8px' }}
                                                                variant="outlined" onClick={submiteditform}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Modal>
                                        </>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 20, 50]}
                        component="div"
                        count={dpt.length}
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
