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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Alert from "ui-component/Alert_SnackBar/Alert_SnackBar";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

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
const columns = [{ id: 'staff', label: 'Staff', minWidth: 170 },{ id: 'Dsignation', label: 'Designation', minWidth: 170 },{ id: 'tier', label: 'Tier/Grade', minWidth: 170 }];



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
    const [level_of_employee,setLevelOfEmployee]=useState({staff_type:'',designation:'',tier:''});
    const [allTiers,setAllTiers]=useState([]);
    const [allStaff,setAllStaff]=useState([]);
    const [allDesignations,setAllDesignations]=useState([]);
    const [submitted,setSubmitted]=useState(0);
    const [modeldata,setModelData]=useState({});
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const [msgType, setMsgType] = React.useState("");
  
    const [openDetail, setOpenDetail] = React.useState(false);
    const handleDetailOpen = () => setOpenDetail(true);
  const handleDetailClose = () => setOpenDetail(false);
  
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
        let level_detail= {...level_of_employee};

        level_detail[e.target.name]=e.target.value;
        setLevelOfEmployee(level_detail);
        
    };
    // -------------------------fetch tiers---------------------------------------
    const fetchTiers=(designation)=>{
        axios.get('http://localhost:5000/tier/'+designation).then((response)=>{
            setAllTiers(response.data);
            
        });
       }
    const handleChangeDesignation = (e) => {
        let level_detail= {...level_of_employee};
        level_detail[e.target.name]=e.target.value;
        setLevelOfEmployee(level_detail);
        fetchTiers(e.target.value);
        
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    // ---------------------------Get All Level Of employee-------------------------------------------
    function fetchLevel(){
        axios.get('http://localhost:5000/level/').then((response)=>{
            setRows(response.data)
        });
    }
    // ---------------------------Get All Staff  Types-------------------------------------------
    function fetchStaff(){
        axios.get('http://localhost:5000/staff_type/').then((response)=>{
            setAllStaff(response.data)
        });
    }
    // ---------------------------Get All Designation-------------------------------------------
    function fetchDesignation(){
        axios.get('http://localhost:5000/designation/').then((response)=>{
            setAllDesignations(response.data)
        });
    }

    // ---------------------------add Staff Type-------------------------------------------
    const submitaddform=()=>{
        if(level_of_employee.staff_type.length !=0 && level_of_employee.designation.length !=0){
            axios.post('http://localhost:5000/level/',{
                staff:level_of_employee.staff_type,
                designation:level_of_employee.designation,
                level_grade:level_of_employee.tier,
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
        if(modeldata.level.length !=0){
            axios.patch('http://localhost:5000/level/'+modeldata._id,{
                staff:modeldata.staff,
                designation:modeldata.designation,
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
    const deleteStaffType=(id)=>{
        
        axios.delete('http://localhost:5000/level/'+id).then((response)=>{
            setSubmitted(submitted+1);
        });
       
    }
    const openModel=(staff)=>{
        let staff_data={...staff}
        staff_data['staff']=staff.staff._id;
        staff_data['designation']=staff.designation._id;
        staff_data['level_grade']=staff.level_grade._id;
        setModelData(staff_data);
        handleEditOpen();

    }

    const handleEditTxt = (e) => {
        let name_model={...modeldata};  
        name_model[e.target.name]=e.target.value;
        setModelData(name_model);
        
    };
   
   const openDetailModel = (level) => {
    setModelData(level);
    handleDetailOpen();
  };
    useEffect(()=>{
        fetchStaff();
        fetchDesignation();
        fetchLevel();
    },[submitted])

    

    return (
        <>
        <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
        
        <MainCard title="Level Of Employee">
            <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpen}>
                Add Level
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
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Staff</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={level_of_employee.staff_type}
                                label="Staff"
                                name="staff_type"
                                onChange={handleChangetext}
                                >
                                    <MenuItem>{'Select Staff'}</MenuItem>
                                {
                                    allStaff.map((staff)=>{
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
                                <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={level_of_employee.designation}
                                label="Designation"
                                name="designation"
                                onChange={handleChangeDesignation}
                                >
                                    <MenuItem>{'Select Designation'}</MenuItem>
                                {
                                    allDesignations.map((designation)=>{
                                        return (
                                            <MenuItem value={designation._id}>{designation.name}</MenuItem>
                                        )
                                    })
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tier</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                // id="demo-simple-select"
                                value={level_of_employee.tier}
                                label="Tier"
                                name="tier"
                                onChange={handleChangetext}
                                >
                                    <MenuItem>{'Select Tier'}</MenuItem>
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
                                                {row.staff.name}
                                            </TableCell>
                                            <TableCell key={row._id}>
                                                {row.designation.name}
                                            </TableCell>
                                            <TableCell key={row._id}>
                                                {row.level_grade.level_grade}
                                            </TableCell>
                                            
                                               
                                            <TableCell key={row.name}>
                                                <EditIcon sx={{ color: '#2196f3' }} onClick={()=>openModel(row)} />
                                                <DeleteIcon sx={{ color: 'red' }} onClick={()=>deleteStaffType(row._id)}/>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                            {/* -------------------Edit Level Of Employee */}
                            <Modal
                                            
                                open={openEdit}
                                onClose={handleEditClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h3" component="h2">
                                        Edit Level
                                    </Typography>
                                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={'Level'} value={modeldata.level} variant="outlined" name="level" onChange={handleEditTxt}/>
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={'Short Name'} value={modeldata.shortname} variant="outlined" name="shortname" onChange={handleEditTxt}/>
                                        </Grid> 
                                        <Grid item xs={12}>
                                            <TextField fullWidth id="outlined-basic" label={'Description'} value={modeldata.description} variant="outlined" multiline name="description" onChange={handleEditTxt}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Tier</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={modeldata.tier}
                                                label="Tier"
                                                name="tier"
                                                onChange={handleEditTxt}
                                                >
                                                    <MenuItem>{'Select Tier'}</MenuItem>
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