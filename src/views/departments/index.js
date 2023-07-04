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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useEffect } from 'react';
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
    { id: 'organization_id', label: 'Organization Name', minWidth: 170 }
];





export default function Departments() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openEdit, setEditOpen] = React.useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    const [rows,setRows]=useState([]);
    const [allOrganization,setAllOrganization]=useState([]);
    const [modelData,setModelData]=useState({});
    const [dptID,setDptID]=useState('');
    const [dptName,setDptName]=useState('');
    const [dptorg,setDptOrg]=useState('');
    const [submitted,setSubmitted]=useState(0);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function fetchDepartments(){
        axios.get('http://localhost:5000/department/').then((response)=>{
            setRows(response.data)
        });
    }

    function fetchOrganizations(){
        axios.get('http://localhost:5000/organization/').then((response)=>{
            setAllOrganization(response.data)
        });
    }
    const submiteditform=()=>{
        if(dptID.length!=0 && dptName.length!=0 && dptorg.length!=0){
            axios.patch('http://localhost:5000/department/'+dptID,{
                name:dptName,
                organization_id:dptorg
            }).then((response)=>{
                handleEditClose();
                setSubmitted(submitted+1);
            });
        }
    }
    useEffect(()=>{
        fetchDepartments();
        fetchOrganizations();
    },[submitted])


    const handleModel=(data)=>{
        
        setDptID(data._id)
        setDptName(data.name)
        setDptOrg(data.organization_id)
        handleEditOpen();
    }


    const handleDptField=(e)=>{
        setDptName(e.target.value);
    }
    const handleOrgField=(e)=>{


        setDptOrg(e.target.value);
    }



    return (
        <MainCard title="Departments">
            {/* <Link to="/departments/add">
                <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained">
                    Add Department
                </Button>
            </Link> */}

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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>

                                            <TableCell>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.organization_detail.length>0? row.organization_detail[0].name : "None"}
                                                    
                                            </TableCell>
                                            <TableCell>
                                                <Link to={"/admin/departments/departmentDetail/"+row._id}>
                                                    <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} />
                                                </Link> 
                                                <EditIcon sx={{ color: '#2196f3' }} onClick={()=>handleModel(row)} />
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </TableCell>
                                        </TableRow>
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
                                                        <TextField fullWidth id="outlined-basic" label="Department Name" variant="outlined" value={dptName} onChange={handleDptField}/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Organization</InputLabel>
                                                        <Select
                                                            fullWidth
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={dptorg}
                                                            label="Organization"
                                                            onChange={handleOrgField}
                                                        >
                                                            <MenuItem>{'Organization'}</MenuItem>
                                                            {allOrganization.map((org) => {
                                                                return(
                                                                    <MenuItem value={org._id}>{org.name}</MenuItem>
                                                                )
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} variant="outlined" onClick={submiteditform}>
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
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
    );
}
