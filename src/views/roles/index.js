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
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

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
const columns = [{ id: 'name', label: 'Name', minWidth: 170 }, { id: 'shortname', label: 'Short Name', minWidth: 170 }];



export default function Roles() {


    const [rows, setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = () => setOpenEdit(true);
    const handleEditClose = () => setOpenEdit(false);
    const [RoleName, SetRoleName] = useState('');
    const [RoleShortName, SetRoleShortName] = useState('');
    const [RoleDescription, SetRoleDescription] = useState('');
    const [submitted, setSubmitted] = useState(0);
    const [modeldata, setModelData] = useState({});
    const [openDetail, setOpenDetail] = React.useState(false);
    const handleDetailOpen = () => setOpenDetail(true);
    const handleDetailClose = () => setOpenDetail(false);

    // --------------------------For Snacbar Alert-----------------------------------
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [msgType, setMsgType] = React.useState('');
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
        SetRoleName(e.target.value);
    };
    const handleChangeShortName = (e) => {
        SetRoleShortName(e.target.value);
    };
    const handleChangeDescription = (e) => {
        SetRoleDescription(e.target.value);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // ---------------------------Get All Roles-------------------------------------------
    function fetchRole() {
        axios.get('http://localhost:5000/roles/').then((response) => {
            setRows(response.data)
        });
    }

    // ---------------------------add Roles-------------------------------------------
    const submitaddform = () => {
        if (RoleName.length != 0) {
            axios.post('http://localhost:5000/roles/', {
                name: RoleName,
                shortname: RoleShortName,
                description: RoleDescription
            }).then((response) => {
                setOpen(false);
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();

                } else {
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
                SetRoleName('');
                setSubmitted(submitted + 1);
            });
        }
    }

    // --------------------------------Edit Roles-------------------------------------
    const submiteditform = () => {
        if (modeldata.name.length != 0) {
            axios.patch('http://localhost:5000/roles/' + modeldata._id, {
                name: modeldata.name,
                shortname: modeldata.shortname,
                description: modeldata.description
            }).then((response) => {
                handleEditClose();
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();

                } else {
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
                setSubmitted(submitted + 1);
            });
        }
    }
    // --------------------------------delete Roles-------------------------------------
    const deleteRole = (id) => {

        axios.delete('http://localhost:5000/roles/' + id).then((response) => {
            setSubmitted(submitted + 1);
        }).catch((err)=>{
            console.log(err)
            setMsg(err.response.data.message);
            setMsgType('error');
            handleClick();
        });
    }
    const openModel = (role) => {
        setModelData(role);
        handleEditOpen();
    }

    const handleEditNamefield = (e) => {
        let role_data = { ...modeldata };
        role_data.name = e.target.value;
        setModelData(role_data);
    };
    const handleEditShortNamefield = (e) => {
        let role_data = { ...modeldata };
        role_data.shortname = e.target.value;
        setModelData(role_data);
    };
    const handleEditDescriptionfield = (e) => {
        let role_data = { ...modeldata };
        role_data.description = e.target.value;
        setModelData(role_data);
    };

    const openDetailModel = (role) => {
        setModelData(role);
        handleDetailOpen();
      };
      const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };
    useEffect(() => {
        fetchRole()
    }, [submitted])


    return (
        <>

            <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg} />
            <MainCard title="Roles">
                <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={handleOpen}>
                    Add Role
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
                            Add Role
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-basic" label="Role Name" variant="outlined" value={RoleName} onChange={handleChangetext} onKeyPress={handleKeyPress} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth id="outlined-basic" label="Role Short Name" variant="outlined" value={RoleShortName} onChange={handleChangeShortName} onKeyPress={handleKeyPress} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline id="outlined-basic" label="Role Description" variant="outlined" value={RoleDescription} onChange={handleChangeDescription} />
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
                                    var user = JSON.parse(localStorage.getItem('user'));
                                    if (row.name != user.role.name) {
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

                                                        <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} onClick={()=>openDetailModel(row)}/>

                                                        <EditIcon sx={{ color: '#2196f3' }} onClick={() => openModel(row)} />
                                                        <DeleteIcon sx={{ color: 'red' }} onClick={() => deleteRole(row._id)} />
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        );
                                    }
                                })}
                                <Modal

                                    open={openEdit}
                                    onClose={handleEditClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h3" component="h2">
                                            Edit Role
                                        </Typography>
                                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                                            <Grid item xs={12}>
                                                <TextField fullWidth id="outlined-basic" label={'Role Name'} value={modeldata.name} variant="outlined" onChange={handleEditNamefield} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth id="outlined-basic" label={'Role Short Name'} value={modeldata.shortname} variant="outlined" onChange={handleEditShortNamefield} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth id="outlined-basic" label={'Role Description'} value={modeldata.description} variant="outlined" onChange={handleEditDescriptionfield} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button fullWidth sx={{ height: '50px', borderRadius: '8px' }} variant="outlined" onClick={submiteditform}>
                                                    Edit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Modal>
                                {/* -----------------------Detail Model ------------------------ */}
                            <Modal
                                fullWidth
                                open={openDetail}
                                onClose={handleDetailClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    minWidth: "450px",
                                    transform: "translate(-50%, -50%)",
                                    bgcolor: "background.paper",
                                    boxShadow: 24,
                                    borderRadius: 2,
                                    p: 3,
                                }}
                                >
                                <Typography
                                    id="modal-modal-title"
                                    variant="h3"
                                    component="h2"
                                >
                                    Role Detail
                                </Typography>
                                    <h3> Name: </h3><p> {modeldata.name}</p>
                                    <h3>Short Name: </h3> <p> {modeldata.shortname}</p> 
                                    {/* <h3>Tier: </h3> <p> {modeldata.tier.name}</p>  */}
                                    <h3>Role Description: </h3> <p> {modeldata.description}</p> 
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