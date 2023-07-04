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
import { useParams } from "react-router";
import { useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import Alert from "ui-component/Alert_SnackBar/Alert_SnackBar";



export default function AddDepartment() {
  const { id } = useParams()

  const [submitted, setSubmitted] = React.useState(0);
  const [employeeData, setEmployeeData] = React.useState({});
  const [designations, setDesignations] = React.useState([]);
  const [allRoles, setAllRoles] = React.useState([]);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [msgType, setMsgType] = React.useState("");


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

  const fetchEmployeeData = async () => {
    await axios.get("http://localhost:5000/employee/" + id).then((response) => {
      response.data.employee.role = response.data.employee.role._id
      response.data.employee.designation = response.data.employee.designation._id
      response.data.employee.profile_image = ''
      setEmployeeData(response.data);
    });
  }

  const handleChange = (e) => {
    let employeedata = { ...employeeData };
    if (e.target.name == 'profile_image') {

      employeedata.employee[e.target.name] = e.target.files[0];
      console.log(employeedata.employee)
    } else {

      employeedata.employee[e.target.name] = e.target.value;
    }
    setEmployeeData(employeedata);
  };

  const handleChangeDate = (value) => {
    let employeedata = { ...employeeData };
    employeedata.employee['joinning_date'] = value;
    setEmployeeData(employeedata);
  }



  const submitaddform = () => {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const d = new Date(employeeData.employee.joinning_date)
      const joinning_date = d.getDate() + "-" + months[d.getMonth()] + "-" + d.getFullYear()
    console.log("********************");
    console.log(employeeData.employee)
    console.log("********************");
    if (employeeData.length != 0) {
      axios.patch("http://localhost:5000/employee/"+id, employeeData.employee, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          // console.log(response)
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
            setSubmitted(submitted + 1);
          }
        });
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    fetchRoles();
    fetchDesignations();
  }, [submitted]);

  return (
    <MainCard title="Edit Employee">
      <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg} />
      {
          employeeData.employee ?
          <Grid container sx={{ marginTop: "20px" }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
            >
              <TextField
                fullWidth
                id="outlined-basic"
                label="Employee ID"
                variant="outlined"
                name="employee_id"
                onChange={handleChange}
                value={employeeData.employee.employee_id}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
            >
              <TextField
                fullWidth
                id="outlined-basic"
                label="Employee Name"
                variant="outlined"
                name="name"
                onChange={handleChange}
                value={employeeData.employee.name}
              />
            </Grid>
            <Grid
              item
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
                name="email"
                onChange={handleChange}
                value={employeeData.employee.email}
              />
            </Grid>
            <Grid
              item
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
                  value={employeeData.employee.gender}
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

              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
            >
              <TextField
                fullWidth
                id="outlined-basic"
                label="Phone Number"
                name="phone_number"
                variant="outlined"
                onChange={handleChange}
                value={employeeData.employee.phone_number}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "13px" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    fullWidth
                    onChange={(value) => handleChangeDate(value)}
                    label="Joinning Date"
                    value={dayjs(employeeData.employee.joinning_date)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid
              item
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
                  value={employeeData.employee.designation}
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
              item
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
                  value={employeeData.employee.role}
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
              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
            >
              <TextField
                fullWidth
                id="outlined-basic"
                label="Alllowance"
                name="allowance"
                variant="outlined"
                onChange={handleChange}
                value={employeeData.employee.allowance}
              />
            </Grid>
            <Grid
              item
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
                value={employeeData.employee.allowance_description}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "40px" }}
            >
              <TextField
                fullWidth
                id="outlined-basic"
                label="Current Salary"
                variant="outlined"
                name="current_salary"
                onChange={handleChange}
                value={employeeData.employee.current_salary}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "20px" }}
            >
              <FormControl fullWidth>
                <Typography >Choose Profile Image</Typography>
                <TextField
                  fullWidth
                  type={"file"}
                  id="outlined-basic"
                  name="profile_image"
                  variant="outlined"
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              container
              sx={{ marginTop: '50px' }}
            >
              <Button sx={{ backgroundColor: "#5e35b1" }} variant="contained" onClick={submitaddform}>
                Update Employee
              </Button>
            </Grid>
          </Grid>
          :
          <Grid>
            Loading Data......
          </Grid>
      }

    </MainCard>
  );
}