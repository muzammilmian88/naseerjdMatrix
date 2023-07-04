import { Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
import { useParams } from 'react-router';
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';

export default function AddDepartment() {

    const { org_id } = useParams();
    const [depName, setDeptName] = React.useState('');
    const [depShortName, setDeptShortName] = React.useState('');
    const [subdpt, setSubdpt] = React.useState([]);
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
    const addsubdpt = () => {
        let sub_dpt = [...subdpt];
        sub_dpt.push({name:''});
        setSubdpt(sub_dpt);
    };
    const submitaddform = () => {
        if (depName.length != 0 ) {
            axios.post('http://localhost:5000/department/', {
                department: {
                    name: depName,
                    organization_id: org_id,
                    short_name:depShortName
                },
                sub_departments: subdpt
            }).then((response) => {
                if (!response.data.error) {
                    handleClick();
                    if (!response.data.error) {
                        setMsg(response.data.message);
                        setMsgType('success');
                        handleClick();
                        
                    }else{
                        setMsg(response.data.message);
                        setMsgType('error');
                        handleClick();
                    }
                    setDeptName('');
                    setDeptShortName('');
                    setSubdpt([]);
                    setSubmitted(submitted + 1);
                }
            }).catch((err)=>{
                console.log(err)
                setMsg(err.response.data.message);
                setMsgType('error');
                handleClick();
            });
        }
    }
    const handleNameField = (e) => {
        setDeptName(e.target.value);
    };
    const handleShortNameField = (e) => {
        setDeptShortName(e.target.value);
    };
    const handlesubdepttField = (index) => (e) => {
        let sub_dpt = [...subdpt];
        sub_dpt[index].name = e.target.value;
        setSubdpt(sub_dpt);
    };
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };
    
    const removeField = (index) => {
        let sub_dpt = [...subdpt];
        sub_dpt.splice(index, 1);
        setSubdpt(sub_dpt);
    }

    return (
        <MainCard title="Add Department">
           <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
            <Grid container sx={{ marginTop: '20px' }}>
                <Grid xs={12} md={6} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Department Name"
                        variant="outlined"
                        onKeyPress={handleKeyPress}
                        onChange={handleNameField}
                        value={depName}
                    />
                </Grid>
                
                <Grid xs={12} md={6} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        onKeyPress={handleKeyPress}
                        label="Short Name Of Department"
                        variant="outlined"
                        onChange={handleShortNameField}
                        value={depShortName}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={addsubdpt}>
                        Add Sub-Department
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {subdpt.map((dpt, index) => {
                        
                        return (
                            <Grid container sx={{ marginTop: '20px' }}>
                                <Grid item md={6} xs={12} key={index} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="sub department name"
                                        value={dpt.name}
                                        variant="outlined"
                                        onKeyPress={handleKeyPress}
                                        onChange={handlesubdepttField(index)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <CloseIcon sx={{ color: 'red', fontSize: '30px', marginTop: '10px', marginLeft: '10px' }} onClick={() => { removeField(index) }} />
                                </Grid>
                            </Grid>
                            
                        );
                    })}
                </Grid>
                <Grid display="flex" justifyContent="center" alignItems="center" container>
                    <Button variant="contained" sx={{ backgroundColor: '#5e35b1', marginTop: '50px' }} onClick={submitaddform}>
                        {'Add Department'}
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
}
