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
];



export default function FunctionDetail() {

    const { id } = useParams();
    const [page, setPage] = React.useState(0);
    const [functionDetail, setFunctionDetail] = React.useState({});
    const [subFunctions, setSubFunctions] = React.useState([]);
    const [functionname, setFunctionName] = React.useState('');
    const [editFunctionID, setEditFunctionID] = React.useState('');
    const [editFunctionName, setEditFunctionName] = React.useState('');
    const [editFunctionShortName, setEditFunctionShortName] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [openSubFunctionModel, SetOpenSubFunctionModel] = React.useState(false);
    const handleOpenSubFunctionModel = () => SetOpenSubFunctionModel(true);
    const handleCloseSubFunctionModel = () => SetOpenSubFunctionModel(false);
    const [openActivityModel, SetOpenActivityModel] = React.useState(false);
    const handleOpenActivityModel = () => SetOpenActivityModel(true);
    const handleCloseActivityModel = () => SetOpenActivityModel(false);
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




    function fetchTemplate() {
        axios.get('http://localhost:5000/functions/' + id).then((response) => {
            setFunctionDetail(response.data.singleFunction)
            setSubFunctions(response.data.sub_functions)

        });
    }
    const submitaddform=()=>{
        if(functionname.length!=0 ){
            console.log()
            axios.post('http://localhost:5000/functions/',{
                name:functionname,
                parent_function_id:id
            }).then((response)=>{
                
                    if (!response.data.error) {
                        setMsg(response.data.message);
                        setMsgType('success');
                        handleClick();
                        
                    }else{
                        setMsg(response.data.message);
                        setMsgType('error');
                        handleClick();
                    }
                
               
                setFunctionName('');
                handleCloseSubFunctionModel();
                setSubmitted(submitted+1);
            }).catch((err)=>{
                console.log(err)
                setMsg(err.response.data.message);
                setMsgType('error');
                handleClick();
            });
        }
    }
    const submiteditform=()=>{
        if(editFunctionID.length!=0 && editFunctionName.length!=0){
            axios.patch('http://localhost:5000/functions/'+editFunctionID,{
                name:editFunctionName,
                parent_function_id:id
            }).then((response)=>{
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                    
                }else{
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
                handleEditClose();
                setSubmitted(submitted+1);
            });
        }
    }
    const handleDelete= (id)=>{ 
        
        axios.delete('http://localhost:5000/functions/'+id).then((response)=>{
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
        
        setEditFunctionName(data.name)
        setEditFunctionID(data._id)
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
        setEditFunctionName(e.target.value);
    }
    
    useEffect(() => {
        fetchTemplate();
    }, [submitted])
    const extract_date=(date)=>{
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const d=new Date(date)
        return d.getDate()+"-"+months[d.getMonth()]+"-"+d.getFullYear()
    }
    return (
        <>
        <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
            <MainCard title="Function Detail" sx={{ paddingBottom: '2%' }}>
                <Grid container spacing={2} display={'flex'} justifyContent={'end'}>
                    <Grid item>
                    <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpenSubFunctionModel}>
                        Add Function
                    </Button>
                    </Grid>
                    
                    
                </Grid>

                <Modal
                fullWidth
                open={openSubFunctionModel}
                onClose={handleCloseSubFunctionModel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h3" component="h2">
                            Add Function
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                            <Grid item xs={12}>
                                <TextField fullWidth onKeyPress={handleKeyPress}  id="outlined-basic" label="Function Name" variant="outlined" value={functionname} onChange={(e)=>{setFunctionName(e.target.value)}}/>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} onClick={submitaddform} variant="outlined" >
                                    Add Function
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
                
               
            

                <Grid container sx={{ marginTop: '20px' }}>
                    <Grid md={4} sm={12}>
                        <h4>Function Name:</h4> {functionDetail.name}
                    </Grid>
                    {functionDetail.parent_template_id!= null?
                    <Grid md={4} sm={12}>
                        <h4>Template Name:</h4>  {functionDetail.parent_template_id.name}
                    </Grid>
                        :''
                    }
                    
                    <Grid md={4} sm={12}>
                        <h4>Function Creation Date :</h4> {extract_date(functionDetail.createdAt)}
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard title="Sub Functions" sx={{ marginTop: '3%' }}>
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
                            
                                {subFunctions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <>
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell key={row.name}>
                                                    <a href={"/admin/template/function_detail/"+row._id}>
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
                                                            <TextField fullWidth id="outlined-basic" label={'Function Name'} onKeyPress={handleKeyPress} value={editFunctionName} variant="outlined" onChange={handleEditNameField}/>
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
                        count={subFunctions.length}
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
