import { Grid, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import MainCard from "ui-component/cards/MainCard";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axios from "axios";
import LoadingButton from '@mui/lab/LoadingButton';
import { useParams } from "react-router";
import { useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from "ui-component/Alert_SnackBar/Alert_SnackBar";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';



export default function AddDepartment() {
  const [userData, setUserData] = React.useState({
    emp_id: "",
    name: "",
    email: "",
    gender: "",
    phone_number: "",
    joinning_date: Date.now(),
    designation: "",
    current_salary: "",
    allowance: "",
    allowance_description: "",
    profile_image: null,
    role: "",
  });
  const [submitted, setSubmitted] = React.useState(0);
  const [designations, setDesignations] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [allRoles, setAllRoles] = React.useState([]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [msgType, setMsgType] = React.useState("");
  const [loading, setLoading] = React.useState(false);


  const handleClick = () => {
    setOpenSnackBar(true);
  };
  const handleSnackClose = () => {
    setOpenSnackBar(false);
  };

  const fetchDesignations = async () => {
    await axios.get("http://localhost:5000/designation/").then((response) => {
      setDesignations(response.data);
    });
  };
  const fetchRoles = async () => {
    await axios.get("http://localhost:5000/roles/").then((response) => {
      setAllRoles(response.data);
    });
  };
  const fetchDepartments = async () => {
    await axios.get("http://localhost:5000/department/").then((response) => {


      let prev_departments = [...departments];
      prev_departments.push([...response.data])
      setDepartments(prev_departments);



    }).catch((err) => {
      console.log(err);
    });
  }
  useEffect(() => {
    fetchRoles();
    fetchDesignations();
    fetchDepartments();
  }, []);

  const handleChangeDepartment = async (e) => {
    let select_name = e.target.name;
    let index = select_name.split('_')[1];
    
    let prev = [...departments];
    prev = prev.slice(0, parseInt(index) + 1);
    setDepartments(prev);
  
    console.log('********************************');
    let dep_id = e.target.value;
    const response = await axios.get("http://localhost:5000/department/" + dep_id);
    if (response.data.sub_department.length > 0) {
      console.log(response.data.sub_department);
      let prev_departments = [...prev];
      prev_departments.push([...response.data.sub_department]);
      setDepartments(prev_departments);
    }
  };

  const handleChange = (e) => {
    let user = { ...userData };
    if (e.target.name == 'profile_image') {

      user[e.target.name] = e.target.files[0];
    } else {

      user[e.target.name] = e.target.value;
    }
    setUserData(user);
  };
  const handleChangeDate = (value) => {
    let user = { ...userData };
    user['joinning_date'] = value;
    setUserData(user);
  }
  const handleKeyPress = (event) => {
    // Prevent user from typing numeric characters
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  };
  const handleAlphaKeyPress = (event) => {
    // Prevent user from typing alphabetic characters
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      event.preventDefault();
    }
  };


  const submitaddform = (event) => {
    event.preventDefault();
    if (userData.name.length != 0) {
      setLoading(true);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const d = new Date(userData.joinning_date)
      const joinning_date = d.getDate() + "-" + months[d.getMonth()] + "-" + d.getFullYear()
      axios.post("http://localhost:5000/employee/", {
        employee_id: userData.emp_id,
        name: userData.name,
        email: userData.email,
        gender: userData.gender,
        phone_number: userData.phone_number,
        joinning_date: joinning_date,
        designation: userData.designation,
        current_salary: userData.current_salary,
        allowance: userData.allowance,
        allowance_description: userData.allowance_description,
        profile_image: userData.profile_image,
        role: userData.role
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          setLoading(false);
          if (!response.data.error) {
            if (response.error == true) {
              setMsg(response.data.message);
              setMsgType('error');
              handleClick();
            } else {
              setMsg(response.data.message);
              setMsgType('success');
              handleClick();
            }
            setUserData({
              emp_id: "",
              name: "",
              email: "",
              gender: "",
              phone_number: "",
              joinning_date: "01-01-0001",
              designation: "",
              current_salary: "",
              allowance: "",
              allowance_description: "",
              profile_image: null,
              role: "",
            })
            setSubmitted(submitted + 1);
          }
        }).catch((err) => {
          console.log(err)
        });
    }
  };

  return (
    <MainCard title="Add Employee">
      <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg} />
      <form onSubmit={submitaddform} method="POST">
        <Grid container sx={{ marginTop: "20px" }}>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <TextField
              fullWidth
              required
              id="outlined-basic"
              label="Employee ID"
              variant="outlined"
              name="emp_id"
              onKeyPress={handleAlphaKeyPress}
              onChange={handleChange}
              value={userData.emp_id}
            />
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <TextField
              fullWidth
              required
              id="outlined-basic"
              label="Employee Name"
              variant="outlined"
              name="name"
              onKeyPress={handleKeyPress}
              onChange={handleChange}
              value={userData.name}
            />
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <TextField
              fullWidth
              id="outlined-basic"
              label="Employee Email"
              variant="outlined"
              type={'email'}
              required
              name="email"
              onChange={handleChange}
              value={userData.email}
            />
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="gender"
                required
                value={userData.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem>{"Select Gender"}</MenuItem>
                <MenuItem value={"Male"}>{"Male"}</MenuItem>
                <MenuItem value={"Female"}>{"Female"}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <TextField
              fullWidth
              id="outlined-basic"
              label="Phone Number"
              name="phone_number"
              required
              onKeyPress={handleAlphaKeyPress}
              inputProps={{ maxLength: 13 }}
              variant="outlined"
              onChange={handleChange}
              value={userData.phone_number}
            />
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "13px" }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  sx={{ width: "100%" }}
                  fullWidth
                  required
                  onChange={(value) => handleChangeDate(value)}
                  label="Joinning Date"
                  value={dayjs(userData.joinning_date)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Designations</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="designation"
                required
                value={userData.designation}
                label="Designations"
                onChange={handleChange}
              >
                <MenuItem>{"Select Designations"}</MenuItem>
                {designations.map((designation) => {
                  return (
                    <MenuItem key={designation._id} value={designation._id}>
                      {designation.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="role"
                required
                value={userData.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem>{"Select Role"}</MenuItem>
                {allRoles.map((role) => {
                  return (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>


          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <TextField
              fullWidth
              id="outlined-basic"
              label="Alllowance"
              name="allowance"
              required
              onKeyPress={handleAlphaKeyPress}
              variant="outlined"
              onChange={handleChange}
              value={userData.allowance}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <TextField
              fullWidth
              rows={5}
              multiline
              id="outlined-basic"
              label="Allowance Description"
              name="allowance_description"
              variant="outlined"
              onChange={handleChange}
              value={userData.allowance_description}
            />
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "40px" }}
          >
            <TextField
              fullWidth
              id="outlined-basic"
              label="Current Salary"
              variant="outlined"
              required
              onKeyPress={handleAlphaKeyPress}
              name="current_salary"
              onChange={handleChange}
              value={userData.current_salary}
            />
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <FormControl fullWidth>
              <Typography >Choose Profile Image</Typography>
              <TextField
                fullWidth
                class=""
                type={"file"}
                id="outlined-basic"
                name="profile_image"
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            md={12}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <Typography variant="h4">
              Department
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Departments</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name={`designation_${0}`}
                // id={`designation_${0}`}
                id='ddd'
                required
                label="Designations"
                onChange={handleChangeDepartment}
              >
                <MenuItem>{"Select Designations"}</MenuItem>
                {
                  departments.length != 0 ? departments[0].map((department,index) => {
                    return (
                      <MenuItem key={department._id} value={department._id} name={0}>
                        {department.name}
                      </MenuItem>
                    );
                  }) : 'loading'
                }
              </Select>
            </FormControl>
          </Grid>


          {
            departments.length>1?
            departments.slice(1).map((sub_department,index)=>{
              return (
                <Grid
            xs={12}
            md={4}
            sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sub Departments</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name={`designation_${index+1}`}
                required
                // value={userData.designation}
                label="Designations"
                onChange={handleChangeDepartment}
              >
                <MenuItem>{"Select Designations"}</MenuItem>
                {
                  sub_department.map((department) => {
                    return (
                      <MenuItem key={department._id} value={department._id} >
                        {department.name}
                      </MenuItem>
                    );
                  }) 
                }
              </Select>
            </FormControl>
          </Grid>
              )
            }):''
            
          }

          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            container
            sx={{ marginTop: '50px' }}
          >

            <Button disabled={loading} sx={{ backgroundColor: "#5e35b1" }} type="submit" variant="contained" >
              {loading ? <CircularProgress color="inherit" /> : 'Add Employee'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}