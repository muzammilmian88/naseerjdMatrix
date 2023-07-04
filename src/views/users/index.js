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
    { id: 'organization_id', label: 'Email', minWidth: 170 },
    { id: 'email', label: 'Gender', minWidth: 170 },
    { id: 'designation', label: 'Designation', minWidth: 170 }
];





export default function Departments() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows,setRows]=useState([]);
    const [allEmployee,setAllEmployee]=useState([]);
 
    const [submitted,setSubmitted]=useState(0);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function fetchEmployee(){
        axios.get('http://localhost:5000/employee/').then((response)=>{
            setRows(response.data)
        });
    }
    const deleteEmployee = (id) => {
        axios.delete("http://localhost:5000/employee/" + id).then((response) => {
          setSubmitted(submitted + 1);
        });
      };
  
    useEffect(()=>{
        fetchEmployee();
    },[submitted])

    return (
        <MainCard title="Employee">
            <Link to="/admin/users/add">
                <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained">
                    Add Employee
                </Button>
            </Link>

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
                                        <TableRow hover role="checkbox" tabIndex={-1} >

                                            <TableCell>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.email}
                                                    
                                            </TableCell>
                                            <TableCell>
                                                {row.gender}
                                            </TableCell>
                                            <TableCell>
                                                {row.designation.name}
                                                    
                                            </TableCell>
                                            <TableCell>
                                                <Link to={"/admin/users/detail/"+row._id}>
                                                    <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} />
                                                </Link> 
                                                <Link to={"/admin/users/edit/"+row._id}>
                                                <EditIcon sx={{ color: '#2196f3' }}  />
                                                </Link> 
                                                <DeleteIcon sx={{ color: 'red' }} onClick={()=>deleteEmployee(row._id)}/>
                                            </TableCell>
                                        </TableRow>
                                       
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
