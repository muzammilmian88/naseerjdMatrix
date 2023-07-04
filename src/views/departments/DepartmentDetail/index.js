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
import Alert_SnackBar from 'ui-component/Alert_SnackBar/Alert_SnackBar';


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



export default function DepartmentDetail() {

    const { id } = useParams();
    const [page, setPage] = React.useState(0);
    const [depDetail, setDepDetail] = React.useState({});
    const [subDep, setSubDep] = React.useState([]);
    const [subDptName, setSubDptName] = React.useState('');
    const [editSubDptID, setEditSubDptID] = React.useState('');
    const [editSubDptName, setEditSubDptName] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    const [submitted, setSubmitted] = React.useState(0);
    // --------------------------For Snacbar Alert-----------------------------------
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [msgType, setMsgType] =React.useState('');
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

    const handlechangeText = (e) => {
        setSubDptName(e.target.value);
    }
   


    function fetchDepartment() {
        axios.get('http://localhost:5000/department/' + id).then((response) => {
            setDepDetail(response.data.department)
            setSubDep(response.data.sub_department)

        });
    }

    //-------------------- Add SubDept---------------------
    const submitAddDeptForm = async() => {
        if (subDptName != '') {
            await axios.post('http://localhost:5000/department/', {
                department: {
                    name: subDptName,
                    organization_id:depDetail.organization_id,
                    
                    parent_department_id: depDetail._id
                },
                sub_departments: []

            }).then((response) => {
                handleClose();
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                    
                }else{
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
                setSubDptName('');
                setSubmitted(submitted + 1);
                
            });
        }
    }
    const handleDelete=(id)=>{
        axios.delete('http://localhost:5000/department/'+id).then((response)=>{
            setMsg(response.data.message);
            setMsgType('success');
            handleClick();
            setSubmitted(submitted+1);
        }).catch((err)=>{
            setMsg(err.response.data.message);
            setMsgType('error');
            handleClick();
        });
    }
    const submiteditform=()=>{
        
        if(editSubDptID.length!=0 && editSubDptName.length!=0){
            axios.patch('http://localhost:5000/department/'+editSubDptID,{
                name:editSubDptName
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
    const handleModel=(data)=>{
        
        setEditSubDptName(data.name)
        setEditSubDptID(data._id)
        handleEditOpen();
    }


    const handleEditNameField=(e)=>{
        setEditSubDptName(e.target.value);
    }
    useEffect(() => {
        fetchDepartment();
    }, [submitted])

    const extract_date=(date)=>{
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const d=new Date(date)
        return d.getDate()+"-"+months[d.getMonth()]+"-"+d.getFullYear()
    }
    return (
        <>
            
            <Alert_SnackBar openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
            <MainCard title="Department Detail" sx={{ paddingBottom: '2%' }}>
                <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpen}>
                    Add Sub Department
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
                            Add Sub Department
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-basic" label="Sub Department Name" variant="outlined" value={subDptName} onChange={handlechangeText} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} variant="outlined" onClick={submitAddDeptForm}>
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>

                <Grid container sx={{ marginTop: '20px' }}>
                    <Grid md={4} sm={12}>
                        <h4>Department Full Name:</h4>  {depDetail.name}
                    </Grid>
                    {
                        depDetail.short_name != null ?
                        <Grid md={4} sm={12}>
                            <h4>Department Short Name :</h4>
                            {depDetail.short_name != null ? depDetail.short_name: ""}
                        </Grid>:
                        ''
                    }
                    
                    <Grid md={4} sm={12}>
                        <h4>Organization Name :</h4>
                        {depDetail.organization_id != null ? depDetail.organization_id.name: ""}
                    </Grid>
                    <Grid md={4} sm={12}>
                        <h4>Department Creation Date :</h4> {extract_date(depDetail.createdAt)}
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard title="Sub Deptartments" sx={{ marginTop: '3%' }}>
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
                                {subDep.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <>
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                
                                                <TableCell key={row.name}>
                                                    <a href={"/admin/departments/departmentDetail/"+row._id}>
                                                        <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} />
                                                    </a>
                                                    <EditIcon sx={{ color: '#2196f3' }} onClick={()=>handleModel(row)} />
                                                    <DeleteIcon sx={{ color: 'red' }}  onClick={()=>handleDelete(row._id)}/>
                                                    
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
                                                            <TextField fullWidth id="outlined-basic" label={'Sub Department Name'} value={editSubDptName} variant="outlined" onChange={handleEditNameField}/>
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
                        count={subDep.length}
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
