import * as React from 'react';
import Paper from '@mui/material/Paper';
import MainCard from 'ui-component/cards/MainCard';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Alert from 'ui-component/Alert_SnackBar/Alert_SnackBar';
import { useState } from 'react';
import TreeView from '@mui/lab/TreeView';
// import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Menu_Button from 'ui-component/Menu_Button/Menu_Button';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from '@react-spring/web';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileIcon from '@mui/icons-material/Description';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4
};


function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }
  
  function PlusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }
  
  function CloseSquare(props) {
    return (
      <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }
  function TransitionComponent(props) {
    const style = useSpring({
      from: {
        opacity: 0,
        transform: 'translate3d(20px,0,0)',
      },
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
      },
    });
  
    return (
      <animated.div style={style}>
        <Collapse {...props} />
      </animated.div>
    );
  }
  
  TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
  };
  
  const StyledTreeItem = styled((props) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
  ))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 1,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));

export default function TemplateDetail() {

    const { id } = useParams();
    const [templateDetail, setTemplateDetail] = React.useState({});
    const [functions, setFunction] = React.useState([]);
    const [functionTree, setFunctionTree] = React.useState([]);
    const [functionname, setFunctionName] = React.useState('');
    const [selectedFunction, setSelectedFunction] = React.useState('');
    const [selectedFunctionId, setSelectedFunctionId] = React.useState('');
    const [openSubFunctionModel, SetOpenSubFunctionModel] = React.useState(false);
    const handleOpenSubFunctionModel = () => SetOpenSubFunctionModel(true);
    const handleCloseSubFunctionModel = () => SetOpenSubFunctionModel(false);
    const [submitted, setSubmitted] = React.useState(0);
    // --------------------------For Snacbar Alert-----------------------------------
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('');
    const [expanded, setExpanded] = useState([]);

    const handleToggle = (nodeId) => {
      if (expanded.includes(nodeId)) {
        setExpanded(expanded.filter((id) => id !== nodeId));
      } else {
        setExpanded([...expanded, nodeId]);
      }
    };
    const handleClick = () => { 
        
        setOpenSnackBar(true);
    };
    const handleSnackClose = () => {
        setOpenSnackBar(false);
    };
   // --------------------------End Snacbar Alert-----------------------------------
  


    function fetchTemplate() {
        axios.get('http://localhost:5000/template/' + id).then((response) => {
            setTemplateDetail(response.data.template);
            const functions_data=transformToTree(response.data.functions);

            setFunctionTree(functions_data)
            setFunction(response.data.functions);

        });
    }

    const transformToTree = (functionData) => {
        const functionMap = {};
        const treeData = [];
      
        // Create a map of functions using their IDs as keys
        functionData.forEach((singleFunction) => {
          functionMap[singleFunction._id] = { ...singleFunction, children: [] };
        });
       
        // Build the tree structure by assigning child functions to their parent recursively
        functionData.forEach((singleFunction) => {
          if (singleFunction.parent_function_id) {
            const parentFunction = functionMap[singleFunction.parent_function_id];
            if (parentFunction) {
              parentFunction.children.push(functionMap[singleFunction._id]);
            }
          } else {
            treeData.push(functionMap[singleFunction._id]);
          }
        });
      
        return treeData;
      };
      const handleIconClick = (node) => {
        // Perform your specific task here
        setSelectedFunction(node.name)
        setSelectedFunctionId(node._id)
      };
      const renderTreeNodes = (nodes) => {
        return nodes.map((node) => (
          <TreeItem
          key={node._id}
          nodeId={node._id.toString()}
          label={
            <Box sx={{display:'flex'}} onClick={(e) =>{
                e.stopPropagation();
              }}>
              {Array.isArray(node.children) && node.children.length ? (
                <ChevronRightIcon  onClick={() => handleToggle(node._id)} />
              ) : (
                ''
              )}
              <Box component="div" sx={{ display: 'inline',marginTop:'5px'}} onClick={()=>{console.log("text clicked")}}>{node.name}</Box>
              {/* <span style={{marginTop:20}} onClick={()=>{console.log("text clicked")}}>{node.name}</span> */}
            </Box>
          }
        >
          {Array.isArray(node.children) ? renderTreeNodes(node.children) : null}
        </TreeItem>
        ));
      };

    const submitaddform=()=>{
        if(functionname.length!=0 ){
            console.log()
            axios.post('http://localhost:5000/functions/',{
                name:functionname,
                parent_template_id:id
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

  
    const handleKeyPress = (event) => {
        // Prevent user from typing numeric characters
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode >= 48 && charCode <= 57) {
          event.preventDefault();
        }
      };


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
            <MainCard title="Template Detail" sx={{ paddingBottom: '2%' }}>
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
                        <h4>Template Name:</h4> {templateDetail.name}
                    </Grid>
                    <Grid md={4} sm={12}>
                        <h4>Template Short Name:</h4> {templateDetail.shortname}
                    </Grid>
                    
                    <Grid md={4} sm={12}>
                        <h4>Template Creation Date :</h4> {extract_date(templateDetail.createdAt)}
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard title="Functions" sx={{ marginTop: '3%' }}>
                {
                    selectedFunction!=''? 
                    <Grid container spacing={2} display={'flex'} justifyContent={'end'}>
                    <Grid item>
                        <Menu_Button button_name={'Options for '+selectedFunction} action={
                            [{
                                name: 'Add Sub Function to '+selectedFunction,
                                link:`/admin/add_sub_function/${selectedFunctionId}/${templateDetail._id}`
                            },
                            {
                                name: 'Edit '+selectedFunction,
                                link:''
                            },
                            {
                            name: 'Delete '+selectedFunction,
                            link:''
                            }]
                        }/>
                    </Grid>
                </Grid>:''
                }
                
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Grid container >
                        <Grid item sm={3} md={3} lg={3}>
                            {functions.length!=0?
                                <TreeView
                                expanded={expanded}
                                // sx={{flexGrow: 1, maxWidth: 400, overflowY: 'auto', minHeight:'300px' }}
                                >
                                    {renderTreeNodes(functionTree)}
                                </TreeView>:''
                            }
                        </Grid>
                        <Grid item sm={9} md={9} lg={9}>
                        </Grid>
                    </Grid>
                    
                    
                </Paper>
            </MainCard>
        </>
    );
}
