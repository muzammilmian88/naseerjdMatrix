import { Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
import { useParams } from 'react-router';
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';

export default function AddSubFunction() {
    const {parent_id}=useParams();
    const {template_id}=useParams();
   
    const [templateName, setTemplateName] = React.useState('');
    const [templateShortName, setTemplateShortName] = React.useState('');
    

    const [subFunction, setSubFunction] = React.useState({name:''});
    const [functions, setFunctions] = React.useState([]);
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
    const addfunctions = () => {
        let sub_function = [...functions];
        sub_function.push({name:''});
        setFunctions(sub_function);
    };
    const submitaddform = () => {
        
        if (subFunction.length != 0 ) {
            functions.unshift(subFunction);
            
            axios.post('http://localhost:5000/functions/sub_functions/', {
                functions: functions,
                parent_template_id:template_id,
                parent_function_id:parent_id,
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
                    
                    setFunctions([]);
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
        const sub_fn= {
            name:e.target.value,
        }
        setSubFunction(sub_fn);
    };
    const handleShortNameField = (e) => {
        setTemplateShortName(e.target.value);
    };
    const handletemplatettField = (index) => (e) => {
        let sub_function = [...functions];
        sub_function[index].name = e.target.value;
        setFunctions(sub_function);
    };
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };
    
    const removeField = (index) => {
        let sub_function = [...functions];
        sub_function.splice(index, 1);
        setFunctions(sub_function);
    }

    return (
        <MainCard title="Add Sub Function">
           <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
            <Grid container sx={{ marginTop: '20px' }}>
                <Grid xs={12} md={6} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Sub Function Name"
                        variant="outlined"
                        onKeyPress={handleKeyPress}
                        onChange={handleNameField}
                        value={subFunction.name}
                    />
                </Grid>
            </Grid>
            <Grid container sx={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <Button sx={{ float: 'right', backgroundColor: '#5e35b1' }} variant="contained" onClick={addfunctions}>
                        Add More Sub Funtion
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {functions.map((singlefunction, index) => {
                        
                        return (
                            <Grid container sx={{ marginTop: '20px' }}>
                                <Grid item md={6} xs={12} key={index} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="Funtion name"
                                        value={singlefunction.name}
                                        variant="outlined"
                                        onKeyPress={handleKeyPress}
                                        onChange={handletemplatettField(index)}
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
                        {'Add Sub Functions'}
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
}
