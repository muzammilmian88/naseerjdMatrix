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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
const columns = [{ id: 'name', label: 'Name', minWidth: 170 },{ id: 'subject', label: 'Subject', minWidth: 170 },{ id: 'short_name', label: 'Short Name', minWidth: 170 },{ id: 'staff_name', label: 'Staff Name', minWidth: 170 },{ id: 'tier', label: 'Grade', minWidth: 170 }];



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
    const [designation,setDesignation]=useState({name:'',subject:'',shortname:'',staff_type:'',level_grade:''});
    const [submitted,setSubmitted]=useState(0);
    const [modeldata,setModelData]=useState({});
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const [msgType, setMsgType] = React.useState("");
    const [allStaffTypes, setAllStaffTypes] = React.useState([]);
    const [allTiers, setAllTiers] = React.useState([]);
  
  
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
        let designation_detail= {...designation};
        designation_detail[e.target.name]=e.target.value;
        setDesignation(designation_detail);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // ---------------------------Get All Staff  Types-------------------------------------------
    function fetchDesignation(){
        axios.get('http://localhost:5000/designation/').then((response)=>{
            setRows(response.data)
        });
    }
    function fetchStaffType(){
        axios.get('http://localhost:5000/staff_type/').then((response)=>{
            console.log(response)
            setAllStaffTypes(response.data)
        });
    }
    function fetchTier(){
        axios.get('http://localhost:5000/tier/').then((response)=>{
            setAllTiers(response.data)
        });
    }

    // ---------------------------add Staff Type-------------------------------------------
    const submitaddform=()=>{
        if(designation.name.length !=0 ){
            axios.post('http://localhost:5000/designation/',{
                name:designation.name,
                subject:designation.subject,
                shortname:designation.shortname,
                staff_type:designation.staff_type,
                level_grade:designation.level_grade,

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
                setDesignation({name:'',subject:'',shortname:'',staff_type:'',level_grade:''});
                setSubmitted(submitted+1);
            });
        }
    }
    
    // --------------------------------Edit Staff Type-------------------------------------
    const submiteditform=()=>{
        if(modeldata.name.length !=0){
            axios.patch('http://localhost:5000/designation/'+modeldata._id,{
                name:modeldata.name,
                subject:modeldata.subject,
                shortname:modeldata.shortname,
                staff_type:modeldata.staff_type,
                level_grade:modeldata.level_grade,

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
    const deleteDesignation=(id)=>{
        
        axios.delete('http://localhost:5000/designation/'+id).then((response)=>{
            setSubmitted(submitted+1);
        }).catch((err)=>{
            console.log(err)
            setMsg(err.response.data.message);
            setMsgType('error');
            handleClick();
        });
       
    }
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };
    const openModel=(data)=>{
        let model_data={...data};
        console.log(model_data)
        model_data.staff_type=model_data.staff_type._id
        model_data.level_grade=model_data.level_grade._id
        console.log(model_data)
        setModelData(model_data);
        console.log(modeldata)
        handleEditOpen();

    }

    const handleEditTxt = (e) => {
        let name_model={...modeldata};  
        name_model[e.target.name]=e.target.value;
        setModelData(name_model);
    };
   
    useEffect(()=>{
        fetchDesignation()
        fetchStaffType()
        fetchTier()
    },[submitted])

    

    return (
        <>
        <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
        
        <MainCard title="Designation">
            <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpen}>
                Add Designation
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
                        Add Designation
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                        <Grid item xs={12}>
                            <TextField fullWidth  id="outlined-basic" label="Name" variant="outlined" name="name" value={designation.name} onKeyPress={handleKeyPress} onChange={handleChangetext}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  id="outlined-basic" label="Subject" name="subject" variant="outlined" onKeyPress={handleKeyPress} value={designation.subject} onChange={handleChangetext}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  id="outlined-basic" label="Short Name" name="shortname" variant="outlined" onKeyPress={handleKeyPress} value={designation.shortname} onChange={handleChangetext}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Staff Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={designation.staff_type}
                                label="Staff Type"
                                name="staff_type"
                                onChange={handleChangetext}
                                >
                                    <MenuItem>{'Select Staff Type'}</MenuItem>
                                {
                                    allStaffTypes.map((staff)=>{
                                        return (
                                            <MenuItem value={staff._id}>{staff.name}</MenuItem>
                                        )
                                    })
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Grade/Level</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={designation.level_grade}
                                label="Grade/Level"
                                name="level_grade"
                                onChange={handleChangetext}
                                >
                                    <MenuItem>{'Select Grade'}</MenuItem>
                                {
                                    allTiers.map((tier)=>{
                                        return (
                                            <MenuItem value={tier._id}>{tier.level_grade}</MenuItem>
                                        )
                                    })
                                }
                                </Select>
                            </FormControl>
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
                                                {row.subject}
                                            </TableCell>
                                            <TableCell key={row._id}>
                                                {row.shortname}
                                            </TableCell>
                                            <TableCell key={row._id}>
                                                {row.staff_type.name}
                                            </TableCell>
                                            <TableCell key={row._id}>
                                                {row.level_grade.level_grade}
                                            </TableCell>
                                               
                                            <TableCell key={row.name}>
                                                <EditIcon sx={{ color: '#2196f3' }} onClick={()=>openModel(row)} />
                                                <DeleteIcon sx={{ color: 'red' }} onClick={()=>deleteDesignation(row._id)}/>
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
                                        Edit Designation
                                    </Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={' Name'} value={modeldata.name} variant="outlined" name="name" onChange={handleEditTxt}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={'Subject'} value={modeldata.subject} variant="outlined" name="subject" onChange={handleEditTxt}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={'Short Name'} value={modeldata.shortname} variant="outlined" name="shortname" onChange={handleEditTxt}/>
                                        </Grid> 
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Staff Type</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={modeldata.staff_type}
                                                label="Staff Type"
                                                name="staff_type"
                                                onChange={handleEditTxt}
                                                >
                                                    <MenuItem>{'Select Staff Type'}</MenuItem>
                                                {
                                                    allStaffTypes.map((staff)=>{
                                                        return (
                                                            <MenuItem value={staff._id}>{staff.name}</MenuItem>
                                                        )
                                                    })
                                                }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Grade/Level</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={modeldata.level_grade}
                                                label="Grade/Level"
                                                name="level_grade"
                                                onChange={handleEditTxt}
                                                >
                                                    <MenuItem>{'Select Grade'}</MenuItem>
                                                {
                                                    allTiers.map((tier)=>{
                                                        return (
                                                            <MenuItem value={tier._id}>{tier.level_grade}</MenuItem>
                                                        )
                                                    })
                                                }
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