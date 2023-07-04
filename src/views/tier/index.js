import * as React from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MainCard from "ui-component/cards/MainCard";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Alert from "ui-component/Alert_SnackBar/Alert_SnackBar";

import EditIcon from "@mui/icons-material/Edit";
import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const columns = [{ id: "level", label: "Level", minWidth: 170 },];

export default function Tier() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDetailOpen = () => setOpenDetail(true);
  const handleDetailClose = () => setOpenDetail(false);
  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  const [tierLevel, SetTierLevel] = useState("");
  // const [designation, setDesignation] = useState("");
  const [submitted, setSubmitted] = useState(0);
  const [modeldata, setModelData] = useState({});
  const [designations, setDesignations] = useState([]);

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [msgType, setMsgType] = React.useState("");


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
    SetTierLevel(e.target.value);
  };
  // const handleChangeDesc = (e) => {
  //   setDesignation(e.target.value);
  // };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // ---------------------------Get All tiers-------------------------------------------
  // function fetchDesignations() {
  //   axios.get("http://localhost:5000/designation/").then((response) => {
  //     setDesignations(response.data);
  //   });
  // }
  function fetchTier() {
    axios.get("http://localhost:5000/tier/").then((response) => {
      setRows(response.data);
    });
  }

  // ---------------------------add tier-------------------------------------------

  const submitaddform = () => {
    if (tierLevel.length != 0) {
      axios
        .post("http://localhost:5000/tier/", {
          level_grade: tierLevel,
        })
        .then((response) => {
          if (response.error == true) {
            setMsg(response.data.message);
            setMsgType('error');
            handleClick();
          } else {
            setMsg(response.data.message);
            setMsgType('success');
            handleClick();
          }
          SetTierLevel('');
          setOpen(false);
          setSubmitted(submitted + 1);
        });
    }
  };

  // --------------------------------Edit tier-------------------------------------
  const submiteditform = () => {
    if (modeldata.level_grade.length != 0) {
      axios
        .patch("http://localhost:5000/tier/" + modeldata._id, {
          level_grade: modeldata.level_grade,
        })
        .then((response) => {
          if (response.error == true) {
            setMsg(response.data.message);
            setMsgType('error');
            handleClick();
          } else {
            setMsg(response.data.message);
            setMsgType('success');
            handleClick();
          }
          handleEditClose();
          setSubmitted(submitted + 1);
        });
    }
  };
  // --------------------------------delete tier-------------------------------------
  const deleteOrg = (id) => {
    axios.delete("http://localhost:5000/tier/" + id).then((response) => {
      setSubmitted(submitted + 1);
    }).catch((err)=>{
      console.log(err)
      setMsg(err.response.data.message);
      setMsgType('error');
      handleClick();
  });
  };
  const openModel = (tier) => {
    let data = { ...tier };

    setModelData(data);
    handleEditOpen();
  };
  const openDetailModel = (org) => {
    setModelData(org);
    handleDetailOpen();
  };

  const handleEditLevelfield = (e) => {
    let org_data = { ...modeldata };
    org_data.level_grade = e.target.value;
    setModelData(org_data);
  };
  // const handleEditDesignation = (e) => {
  //   let org_data = { ...modeldata };
  //   org_data.designation = e.target.value;
  //   setModelData(org_data);
  // };


  // =================================
  const ApiCalling = () => {
    const formData = new FormData()
    formData.append('email', 'sajjad@gmail.com');
    formData.append('password', '123456');
    try {
      axios.post('http://client.qubitars.com/api/login',formData ).then((responseJson) => {
          console.log(responseJson.data)
          console.log("Yess")
        })
        .catch((error) => {
          console.log(error)

        });
    } catch (e) {
      alert(e)
    }
  };
 
  useEffect(() => {
    fetchTier();
  }, [submitted]);

  return (
    <>
      <Alert openSnackBar={openSnackBar} handleClose={handleSnackClose} msgType={msgType} msg={msg} />
      <MainCard title="Tiers">
        <Button
          sx={{ float: "right", backgroundColor: "#5e35b1" }}
          variant="contained"
          onClick={handleOpen}
        >
          Add Tier
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
              Add Tier
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Level"
                  variant="outlined"
                  value={tierLevel}
                  onChange={handleChangetext}
                />
              </Grid>


              <Grid item xs={12}>
                <Button
                  fullWidth
                  sx={{ height: "50px", borderRadius: "8px" }}
                  variant="outlined"
                  onClick={submitaddform}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer
            sx={{ marginTop: "3%", maxHeight: 440, borderRadius: "10px" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#5e35b1",
                        color: "white",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                    style={{
                      minWidth: 170,
                      backgroundColor: "#5e35b1",
                      color: "white",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.level_grade}
                        >
                          <TableCell key={row._id}>{row.level_grade}</TableCell>

                          <TableCell key={row.level_grade}>
                            <EditIcon
                              sx={{ color: "#2196f3" }}
                              onClick={() => openModel(row)}
                            />
                            <DeleteIcon
                              sx={{ color: "red" }}
                              onClick={() => deleteOrg(row._id)}
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                <Modal
                  open={openEdit}
                  onClose={handleEditClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h3"
                      component="h2"
                    >
                      Edit Tier
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label={"Level"}
                          value={modeldata.level_grade}
                          variant="outlined"
                          onChange={handleEditLevelfield}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          sx={{ height: "50px", borderRadius: "8px" }}
                          variant="outlined"
                          onClick={submiteditform}
                        >
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
