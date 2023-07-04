import * as React from 'react';

import MainCard from 'ui-component/cards/MainCard';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Grid, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { Link, useParams } from 'react-router-dom';
import img from '../../../assets/images/users/dummy_profile.png';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BadgeSharpIcon from '@mui/icons-material/BadgeSharp';
import Skeleton from '@mui/material/Skeleton';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
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
  { id: 'name', label: 'Department', minWidth: 170 },
];
export default function EmployeeDetail() {
  const { id } = useParams();
  const [data,setData]=useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function fetchDepartments() {
    axios.get("http://localhost:5000/tier/").then((response) => {
      setRows(response.data);
      console.log(rows)
    });
  }

  function fetchEmplData () {
    axios.get('http://localhost:5000/employee/'+ id).then((response) => {
      setData(response.data)
    })
  }


  useEffect(() => {
    fetchDepartments();
    fetchEmplData();
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}
        md={4}
        sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {data.employee ? (
        <MainCard title="Profile Detail">
           {/* Render profile details when data.employee is not empty */}
          <div>
            <CardMedia
              component="img"
              width={'100%'}
              image={data.employee.profile_image!=null ? data.employee.profile_image.url : img}
              sx={{ borderRadius: '20px' }}
              alt="Profile Image"
            />
            <Grid display="flex" justifyContent="center" alignItems="center" container sx={{ marginTop: '30px' }}>
              <Grid>
                <Grid display="flex">
                  <BadgeSharpIcon />
                  <Typography sx={{ marginTop: '5px', marginLeft: '10px' }}>
                    Employee ID: {data.employee.employee_id}
                  </Typography>
                </Grid>
                <Grid display="flex" sx={{ marginTop: '10px' }}>
                  <PersonIcon />
                  <Typography sx={{ marginTop: '5px', marginLeft: '10px' }}>
                    Name: {data.employee.name}
                  </Typography>
                </Grid>
                <Grid display="flex" sx={{ marginTop: '10px' }}>
                  <MailIcon />
                  <Typography sx={{ marginTop: '5px', marginLeft: '10px' }}>
                    Email: {data.employee.email}
                  </Typography>
                </Grid>
                <Grid display="flex" sx={{ marginTop: '10px' }}>
                  <LocalPhoneIcon />
                  <Typography sx={{ marginTop: '5px', marginLeft: '10px' }}>
                    Phone: {data.employee.phone_number}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </div>
          </MainCard>
        ) : (
          // Render loading message when data.employee is empty
            <>
              <Skeleton variant="rounded" fullWidth height={60} animation="wave"  />
              <Skeleton variant="rounded" fullWidth height={400} animation="wave" style={{marginTop:'2px'}} />
            </>
          // <Typography>Loading profile details...</Typography>
        )}
      </Grid>
      <Grid item xs={12}
        md={8}
        sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {data.employee ? (
        <MainCard title="Other Details">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography>
                <b>Designation:</b> {data.employee.designation.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                <b>Staff Type:</b> {data.staff.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                <b>Tier:</b> {data.tier.level_grade}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                <b>Joinning Date:</b> {data.employee.joinning_date}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                <b>Current Sallay:</b> {data.employee.current_salary}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>
                <b>Allowance:</b> {data.employee.allowance}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography>
                <b>Allowance Description:</b> {data.employee.allowance_description}
              </Typography>
            </Grid>

          </Grid>
        </MainCard>
          ) : (
            // Render loading message when data.employee is empty
            <>
              <Skeleton variant="rounded" fullWidth height={60} animation="wave" />
              <Skeleton variant="rounded" fullWidth height={200} animation="wave" style={{marginTop:'2px'}} />
            </>
            // <Typography>Loading profile details...</Typography>
          )}

          {
            data.employee  ?
            <MainCard title="Departments" sx={{ marginTop: '20px' }}>
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
                      <TableRow hover role="checkbox" tabIndex={-1} >
  
                        <TableCell>
                          {row.level_grade}
                        </TableCell>
                        <TableCell>
                          <Link to={"/admin/users/detail/"}>
                            <FormatListBulletedIcon sx={{ color: '#2196f3', marginRight: '5px' }} />
                          </Link>
                          <EditIcon sx={{ color: '#2196f3' }} />
                          <DeleteIcon sx={{ color: 'red' }} />
                        </TableCell>
                      </TableRow>
  
                    </>
                     );
                     })}
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
            :
            
            <>
              <Skeleton variant="rounded" fullWidth height={60} animation="wave" style={{marginTop:'30px'}} />
              <Skeleton variant="rounded" fullWidth height={200} animation="wave" style={{marginTop:'2px'}} />
            </>
          }
         
      </Grid>
    </Grid>
  );
}
