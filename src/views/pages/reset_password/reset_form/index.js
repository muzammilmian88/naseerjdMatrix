import { useState } from 'react';
import { useSelector } from 'react-redux';
    // material-ui
    import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import axios from 'axios';


import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';




// ============================|| FIREBASE - LOGIN ||============================ //




const ChangePasswordForm = ({ ...others }) => {
    const {token}=useParams();
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [checked, setChecked] = useState(true);
    const navigate= useNavigate();
    
    // --------------------------For Snacbar Alert-----------------------------------
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('');
    const handleClick = () => {
        setOpenSnackBar(true);
        // console.log('abc')
    };
    const handleSnackClose = () => {
        setOpenSnackBar(false);
    };
   // --------------------------End Snacbar Alert-----------------------------------

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
 
    // ----------------------Api Login-----------------------------------------------
    const submitForm= async (values)=>{
        if (values.confirm_password == values.new_password  ) {
            await axios.patch('http://localhost:5000/auth/reset-password/'+token, {
                password: values.new_password,
            }).then((response) => {
                if (!response.data.error) {
                    setMsg(response.data.message);
                    setMsgType('success');
                    handleClick();
                }else{
                    setMsg(response.data.message);
                    setMsgType('error');
                    handleClick();
                }
            }).catch((err)=>{
                setMsg(err.response.data.message);
                    setMsgType('error');
                    handleClick();
            });
        }else{
            setMsg("New Password and Confirm Password must be same");
                    setMsgType('error');
                    handleClick();
        }
        
    }
    // ----------------------End Api Login-----------------------------------------------

    return (
        <>
           <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg}/>
            <Formik
                initialValues={{
                    new_password: '',
                    confirm_password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    new_password: Yup.string().max(255).required('New Password is required'),
                    confirm_password: Yup.string().max(255).required('Confirm Password is required')
                })}
                onSubmit={async (values) => {
                    
                    submitForm(values);
                }}
            >
                {
                ({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.new_password && errors.new_password)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">New Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                
                                value={values.new_password}
                                name="new_password"
                                onBlur={handleBlur}
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {touched.email && errors.new_password && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.new_password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.confirm_password && errors.confirm_password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirm_password}
                                name="confirm_password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.confirm_password && errors.confirm_password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.confirm_password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    RESET
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default ChangePasswordForm;
