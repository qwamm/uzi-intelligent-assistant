import * as React from 'react';
import '@fontsource/poppins/700.css'
import GlobalStyles from '@mui/material/GlobalStyles';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Box,
    Button,
    Checkbox, Chip,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Slide, Stack,
    styled,
    TextField,
} from "@mui/material";
import 'dayjs/locale/ru';
import Grid from '@mui/material/Grid';

import axios from "axios";
import {useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import GalleryUpdate from "./GalleryUpdate";

const theme = createTheme()
export const TextFieldResult = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 1px;
  }

,
'& label': marginLeft: "100%",
`;
export const TextFieldNew = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #1e5a7a;
    border-width: 1px;
  }

,
'& label': marginLeft: "100%",
`;
function BootstrapDialogTitle(props) {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{width: 2000}}{...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const UpdatePageInterface = (props) => {
    const {number2} = useParams();
    return (

        <UpdatePage props={number2} url={props.url}></UpdatePage>

    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class UpdatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            segmentation: null,
            patientCard: 1,
            uziDate: new Date(),
            tiradsType: [],
            doctorTiradsType: [],
            predictedTypes: new Set([]),
            doctorTypes: new Set([]),
            clicked: false,
            uploadImage: false,
            patients: [],
            patientPolicy: null,
            startData: null,
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            linkEditingImage: "",
            openSuccess: false,
            openCopy: false,
            openAdd: false,
            openUpdate: false,
            open: false,
            openError: false,
            date: new Date(),
            imageId: 1,
            nodule_amount: 0,
            checked: false,
            groupId: 0,
            currentType: 1,
            currentWidth: 1,
            currentLength: 1,
            currentHeight: 1,
            newType: 1,
            newWidth: 1,
            newLength: 1,
            newHeight: 1,
            newGroupFields: false,
            slide_template: [],
            image_count: 0,
        }
    }
    componentDidMount() {
        this.handleStartPage();
    }

    handleResponse = () => {
        this.handleExport()
    };
    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                this.setState({startData: response.data.info})
                console.log(response.data)
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                if(response.data.segmentation.nodule_type === undefined){
                    let ar = [false, false, false, false, false]
                    let ar2 = [false, false, false, false, false]
                    this.state.predictedTypes.clear()
                    this.state.doctorTypes.clear()
                    for(let item of response.data.segmentation){
                        if(!item.is_ai){
                            this.setState({
                                checked: true,
                                groupId: item.id,
                                currentType: Number(item.details.nodule_type),
                                currentWidth: item.details.nodule_width,
                                currentLength: item.details.nodule_length,
                                currentHeight: item.details.nodule_height,

                            })
                            this.state.doctorTypes.add(item)
                        }
                        else {
                            this.state.predictedTypes.add(item)
                        }
                        if(item.details.nodule_type === 1){
                            if(!item.is_ai){
                                ar2[0] = true
                            }
                            else{
                                ar[0] = true
                            }
                        }
                        if(item.details.nodule_type === 2){
                            if(!item.is_ai){
                                ar2[1] = true
                            }
                            else{
                                ar[1] = true
                            }
                        }
                        if(item.details.nodule_type === 3){
                            if(!item.is_ai){
                                ar2[2] = true
                            }
                            else{
                                ar[2] = true
                            }
                        }
                        if(item.details.nodule_type === 4){
                            if(!item.is_ai){
                                ar2[3] = true
                            }
                            else{
                                ar[3] = true
                            }
                        }
                        if(item.details.nodule_type === 5){
                            if(!item.is_ai){
                                ar2[4] = true
                            }
                            else{
                                ar[4] = true
                            }
                        }
                    }
                    this.setState({
                        tiradsType: ar,
                        doctorTiradsType: ar2
                    })
                }
                this.setState({
                    uziDate: new Date(response.data.info.diagnos_date),
                    slide_template: response.data.image.slide_template,
                    image_count: response.data.image.image_count,
                    nodule_amount: response.data.segmentation.length,
                    segmentation: response.data.segmentation,
                    patientCard: response.data.info.patient.id,
                    patientPolicy: response.data.info.patient.personal_policy,
                    patientLastName: response.data.info.patient.last_name,
                    patientFirstName: response.data.info.patient.first_name,
                    patientFathersName: response.data.info.patient.fathers_name,
                    originalImage: response.data.image.image,
                    imageId: response.data.image.id
                })
                console.log(this.state.predictedTypes)
                console.log(this.state.doctorTypes)
            })

    }
    handleCopy = () => {
        for(let item of this.state.predictedTypes){
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
            const formData = {details: item.details}
            axios.post(this.props.url + "/uzi/segment/group/create/solo/" + this.state.imageId+'/', formData).then(async (response) => {
                var tmp = response.data
                tmp.data = []
                for(let cur of item.data) {
                    const formData = {points: cur.points, segment_group: response.data.id}
                    await axios.post(this.props.url + "/uzi/segment/add/", formData).then((response) => {
                        tmp.data.push(response.data)
                    })
                }
                console.log(tmp)
                this.setState({
                    doctorTypes: new Set([...Array.from(this.state.doctorTypes), tmp])
                })
                this.setState({
                    openCopy: true
                })
            })


        }
    }

    handleNewGroup = () => {
        this.setState({
            open: true
        })
    }
    handleCloseDialog = () => {
        this.setState({
            open: false
        })
    };

    handleUpdateGroup = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        const formData = {details: {nodule_type: this.state.currentType, nodule_width: this.state.currentWidth,
                nodule_length: this.state.currentLength, nodule_height: this.state.currentHeight, nodule_2_3: this.state.currentType === 2 || this.state.currentType === 3? 1: 0,
                nodule_4: this.state.currentType === 4? 1: 0,
                nodule_5: this.state.currentType === 5? 1: 0,}}
        axios.put(this.props.url + "/uzi/segment/group/update/" + this.state.groupId+'/', formData).then((response) => {
            axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json").then((response)=>{
                this.state.doctorTypes.clear()
                for(let item of response.data.segmentation) {
                    if (!item.is_ai) {
                        this.state.doctorTypes.add(item)
                    }
                }
                this.setState({
                    doctorTypes: new Set([...Array.from(this.state.doctorTypes)])
                })
            })
        })
        this.setState({
            open: false,
            openUpdate: true
        })
    }
    handleCreateNewGroup = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        const formData = {details: {nodule_type: this.state.newType, nodule_width: this.state.newWidth,
                nodule_length: this.state.newLength, nodule_height: this.state.newHeight, nodule_2_3: this.state.newType === 2 || this.state.newType === 3? 1: 0,
                nodule_4: this.state.newType === 4? 1: 0,
                nodule_5: this.state.newType === 5? 1: 0,}}
        axios.post(this.props.url + "/uzi/segment/group/create/solo/" + this.state.imageId+'/', formData).then((response) => {
            let tmp = response.data
            axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json").then((response)=>{
                this.state.doctorTypes.clear()
                for(let item of response.data.segmentation) {
                    if (!item.is_ai) {
                        this.state.doctorTypes.add(item)
                    }
                }
                this.setState({
                    doctorTypes: new Set([...Array.from(this.state.doctorTypes)])
                })
            })

        })
        this.setState({
            open: false,
            openAdd: true
        })
    }

    handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json").then((response) => {
            const formData = {patient_card: {}, details: {}}
            formData.patient_card.patient = response.data.info.patient.id
            formData.acceptance_datetime = this.state.uziDate
            formData.patient_card.has_nodules = this.state.shortResult ? 'T' : 'F'
            formData.patient_card.diagnosis = this.state.diagnosis
            formData.details.projection_type = this.state.projectionType
            formData.details.nodule_type = this.state.tiradsType
            formData.uzi_device = this.state.uziDevice.id
            formData.details.cdk = this.state.cdk
            formData.details.echogenicity = this.state.echogenicity
            formData.details.isthmus = this.state.isthmus
            formData.details.left_depth = this.state.left_depth
            formData.details.left_length = this.state.left_length
            formData.details.left_width = this.state.left_width
            formData.details.position = this.state.position
            formData.details.profile = this.state.profile
            formData.details.result = this.state.result
            formData.details.right_depth = this.state.right_depth
            formData.details.right_length = this.state.right_length
            formData.details.right_width = this.state.right_width
            formData.details.rln = this.state.rln
            formData.details.structure = this.state.structure
            formData.details.additional_data = this.state.additional_data
            var index = 0
            const tmp_ai_info = []
            for(let item of this.state.tiradsType){
                if(item){
                    tmp_ai_info.push({nodule_type: index+1, nodule_2_3: index === 1 || index === 2? 1: 0,nodule_4: index === 3? 1: 0, nodule_5: index === 4? 1: 0, nodule_height: 1, nodule_length: 1, nodule_width: 1 })
                }
                index++
            }
            formData.details.ai_info = tmp_ai_info
            console.log(formData)
            axios.put(this.props.url + "/uzi/" + this.props.props + '/update/', formData).then(() => {
                this.setState({
                    openSuccess: true,
                })
                //console.log(this.state.openSuccess)
            }).catch(() => {
                this.setState({
                    openError: true,
                })
                // console.log(this.state.openError)
            })
        })

    };


    handleClick1 = () => {

        this.setState({
            tiradsType: [!this.state.tiradsType[0], this.state.tiradsType[1], this.state.tiradsType[2], this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick2 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], !this.state.tiradsType[1], this.state.tiradsType[2], this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick3 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], this.state.tiradsType[1], !this.state.tiradsType[2], this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick4 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], this.state.tiradsType[1], this.state.tiradsType[2], !this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick5 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], this.state.tiradsType[1], this.state.tiradsType[2], this.state.tiradsType[3], !this.state.tiradsType[4] ]
        })
    }

    handleClick11 = () => {

        this.setState({
            doctorTiradsType: [!this.state.doctorTiradsType[0], this.state.doctorTiradsType[1], this.state.doctorTiradsType[2], this.state.doctorTiradsType[3], this.state.doctorTiradsType[4] ]
        })
    }
    handleClick21 = () => {
        this.setState({
            doctorTiradsType: [this.state.doctorTiradsType[0], !this.state.doctorTiradsType[1], this.state.doctorTiradsType[2], this.state.doctorTiradsType[3], this.state.doctorTiradsType[4] ]
        })
    }
    handleClick31 = () => {
        this.setState({
            doctorTiradsType: [this.state.doctorTiradsType[0], this.state.doctorTiradsType[1], !this.state.doctorTiradsType[2], this.state.doctorTiradsType[3], this.state.doctorTiradsType[4] ]
        })
    }
    handleClick41 = () => {
        this.setState({
            doctorTiradsType: [this.state.doctorTiradsType[0], this.state.doctorTiradsType[1], this.state.doctorTiradsType[2], !this.state.doctorTiradsType[3], this.state.doctorTiradsType[4] ]
        })
    }
    handleClick51 = () => {
        this.setState({
            doctorTiradsType: [this.state.doctorTiradsType[0], this.state.doctorTiradsType[1], this.state.doctorTiradsType[2], this.state.doctorTiradsType[3], !this.state.doctorTiradsType[4] ]
        })
    }


    handleGroup = (event) => {
        this.setState({
            groupId: event.target.value,
        });
        console.log(this.state.doctorTypes)
        this.state.doctorTypes.forEach((value) => {
            if(value.id === event.target.value){
                this.setState({
                    currentType: value.details.nodule_type,
                    currentWidth: value.details.nodule_width,
                    currentLength: value.details.nodule_length,
                    currentHeight: value.details.nodule_height,
                });
            }
        })
    };


    handleType = (event) => {
        this.setState({
            currentType: event.target.value,
        });
    };
    handleWidth = (event) => {
        this.setState({
            currentWidth: event.target.value,
        });
    };
    handleLength = (event) => {
        this.setState({
            currentLength: event.target.value,
        });
    };
    handleHeight = (event) => {
        this.setState({
            currentHeight: event.target.value,
        });
    };
    handleNewType = (event) => {
        this.setState({
            newType: event.target.value,
        });
    };
    handleNewWidth = (event) => {
        this.setState({
            newWidth: event.target.value,
        });
    };
    handleNewLength = (event) => {
        this.setState({
            newLength: event.target.value,
        });
    };
    handleNewHeight = (event) => {
        this.setState({
            newHeight: event.target.value,
        });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
            openError: false,
            openCopy: false,
            openAdd: false
        })
    };


    render() {
        return (
            <FormControl sx={{height: '100%', width: '100%'}}>
                <Snackbar open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Результат сохранен!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Изменения сохранены!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openAdd} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Группа добавлена!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openCopy} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Данные ассистента добавлены!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}}
                           onClose={this.handleClose}>Возникла ошибка при сохранении</Alert>
                </Snackbar>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 15,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderTopLeftRadius: 130,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },
                }} color={theme.palette.secondary.contrastText}>
                    <Grid component={""} container direction={'column'} alignContent={'center'} justifyContent={'center'} sx={{marginBlock: -1}}>
                        <Grid component={""} item>
                            <Box component={""} sx={{flexDirection: 'column'}}>
                                <FormGroup>
                                    <FormControlLabel label={this.state.checked?"Проверено специалистом":"Не проверено специалистом"} disabled
                                                      sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                                      labelPlacement="end"
                                                      control={<Checkbox checked={this.state.checked} sx={{
                                                          color: 'dimgray', '&.Mui-checked': {
                                                              color: '#4fb3ea',
                                                          }
                                                      }} icon={<ClearIcon/>}
                                                                         checkedIcon={<DoneSharpIcon/>}
                                                      />}/>
                                </FormGroup>
                            </Box>
                            <Grid component={""} item>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Пациент: </h3>
                                    <h3>  {this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h3>
                                </Box>
                            </Grid>
                            <Grid component={""} item>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Полис: </h3>
                                    <h3>  {this.state.patientPolicy}</h3>
                                </Box>
                            </Grid>
                            <Stack direction="row" sx={{paddingTop: 1}}>
                                <h3 style={{
                                    color: 'dimgray',
                                    fontSize: 20,
                                    fontFamily: "Roboto",
                                    fontWeight: 'normal',
                                    whiteSpace: 'normal',
                                    marginBlockStart: 0,
                                    marginBlockEnd: 0,
                                    marginInlineEnd: 5,
                                }}>Дата: </h3>
                                <h3>  {this.state.uziDate.toLocaleDateString()}</h3>
                            </Stack>
                            <Stack direction={'column'}>
                                <h3 style={{
                                    color: 'dimgray',
                                    fontSize: 15,
                                    fontFamily: "Roboto",
                                    fontWeight: 'normal',
                                    whiteSpace: 'normal',
                                    marginBlockStart: 4.5,
                                    marginInlineEnd: 5,
                                }}>Типы новообразований, определенные ассистентом: </h3>
                                <Stack direction="row" spacing={1} sx={{paddingTop: 1, alignContent:'center'}}>
                                    <Chip label="TI-RADS 1" sx={{color: this.state.tiradsType[0]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[0]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[0]? "standard" : "outlined"} />
                                    <Chip label="TI-RADS 2" sx={{color: this.state.tiradsType[1]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[1]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[1]? "filled" : "outlined"} />
                                    <Chip label="TI-RADS 3" sx={{color: this.state.tiradsType[2]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[2]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[2]? "filled" : "outlined"} />
                                    <Chip label="TI-RADS 4" sx={{color: this.state.tiradsType[3]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[3]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[3]? "filled" : "outlined"} />
                                    <Chip label="TI-RADS 5" sx={{color: this.state.tiradsType[4]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[4]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[4]? "filled" : "outlined"} />
                                </Stack>
                            </Stack>
                            <Stack direction={'column'}>
                                <h3 style={{
                                    color: 'dimgray',
                                    fontSize: 15,
                                    fontFamily: "Roboto",
                                    fontWeight: 'normal',
                                    whiteSpace: 'normal',
                                    marginBlockStart: 4.5,
                                    marginInlineEnd: 5,
                                }}>Типы новообразований, определенные специалистом: </h3>
                                <Stack direction="row" spacing={1} sx={{paddingTop: 1}}>
                                    <Chip label="TI-RADS 1" sx={{color: this.state.doctorTiradsType[0]? '#ffffff' : '#194964', borderColor: '#1c4962', backgroundColor: !this.state.doctorTiradsType[0]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[0]? "standard" : "outlined"} />
                                    <Chip label="TI-RADS 2" sx={{color: this.state.doctorTiradsType[1]? '#ffffff' : '#1e4960', borderColor: '#1f495f', backgroundColor: !this.state.doctorTiradsType[1]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[1]? "filled" : "outlined"} />
                                    <Chip label="TI-RADS 3" sx={{color: this.state.doctorTiradsType[2]? '#ffffff' : '#1f495f', borderColor: '#21495e', backgroundColor: !this.state.doctorTiradsType[2]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[2]? "filled" : "outlined"} />
                                    <Chip label="TI-RADS 4" sx={{color: this.state.doctorTiradsType[3]? '#ffffff' : '#22495d', borderColor: '#21495e', backgroundColor: !this.state.doctorTiradsType[3]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[3]? "filled" : "outlined"} />
                                    <Chip label="TI-RADS 5" sx={{color: this.state.doctorTiradsType[4]? '#ffffff' : '#1c4962', borderColor: '#21495e', backgroundColor: !this.state.doctorTiradsType[4]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[4]? "filled" : "outlined"} />
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid component={""} item container justifyContent={'center'} sx={{paddingTop: 0, flexDirection: 'row'}}>
                            <GalleryUpdate url={this.props.url} props={this.props.props} link1={this.state.originalImage} group={this.state.groupId} image_count={this.state.image_count} slide_template={this.state.slide_template}
                                           number={this.props.props} type={this.state.tiradsType} seg={this.state.doctorTypes} imageid={this.state.imageId}></GalleryUpdate>
                            <Box component={""} sx={{display: 'flex', flexDirection: 'column', paddingTop: 2}}>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{
                                        width: 300,
                                        borderRadius: 3,
                                        paddingBottom: 2, paddingTop: 5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center'
                                    }}><Button sx={{
                                        width: '100%',
                                        color: '#1e5a7a', borderColor: '#1e5a7a',
                                        '&:focus': {},
                                        '&:hover': {},
                                        fontFamily: 'Roboto'
                                    }} className={'first-step'} variant={'outlined'} onClick={this.handleCopy}> <ContentCopyIcon></ContentCopyIcon>
                                        Добавить прогноз ассистента
                                    </Button>
                                    </Box>
                                </Box>
                                <Box component={""} sx={{
                                    width: 300,
                                    borderRadius: 3,
                                    paddingBottom: 2, paddingLeft: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}>
                                    <Button sx={{
                                        width: '100%',
                                        color: '#1e5a7a', borderColor: '#1e5a7a',
                                        '&:focus': {},
                                        '&:hover': {},
                                        fontFamily: 'Roboto'
                                    }} className={'third-step'} variant={'outlined'} onClick={this.handleNewGroup}> <AddIcon></AddIcon>  Добавить новую группу
                                    </Button>
                                </Box>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                        <FormControl className={'fourth-step'} variant={'outlined'} fullWidth>
                                            <TextFieldResult
                                                InputLabelProps={{shrink: true}}
                                                value={this.state.groupId}
                                                label="Текущая группа сегментов"
                                                onChange={this.handleGroup}
                                                variant='outlined'
                                                select
                                            >
                                                {Array.from(this.state.doctorTypes).map((data, index) =>
                                                    <MenuItem key={data.id} value={data.id}>
                                                        <Box key={data.id} sx={{width: 'auto', heigth: 10, backgroundColor: data.details.nodule_type === 2 || data.details.nodule_type === 3? '#00D995FF': data.details.nodule_type === 4? '#FF6200FF': '#d9007b'   }}>
                                                            Группа с TI-RADS {data.details.nodule_type}
                                                        </Box>
                                                    </MenuItem>

                                                )}
                                            </TextFieldResult>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                        <FormControl className={'tenth-step'} variant={'outlined'} fullWidth>
                                            <TextFieldResult
                                                InputLabelProps={{shrink: true}}
                                                value={this.state.currentType}
                                                label="Тип EU TI-RADS"
                                                onChange={this.handleType}
                                                variant='outlined'
                                                select
                                            >
                                                <MenuItem value={1}>TI-RADS 1</MenuItem>
                                                <MenuItem value={2}>TI-RADS 2</MenuItem>
                                                <MenuItem value={3}>TI-RADS 3</MenuItem>
                                                <MenuItem value={4}>TI-RADS 4</MenuItem>
                                                <MenuItem value={5}>TI-RADS 5</MenuItem>
                                            </TextFieldResult>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                        <FormControl variant={'outlined'} fullWidth>
                                            <TextFieldResult
                                                InputLabelProps={{shrink: true}}
                                                value={this.state.currentWidth}
                                                label="Ширина"
                                                onChange={this.handleWidth}
                                                variant='outlined'
                                            >
                                            </TextFieldResult>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                        <FormControl variant={'outlined'} fullWidth>
                                            <TextFieldResult
                                                InputLabelProps={{shrink: true}}
                                                value={this.state.currentLength}
                                                label="Длина"
                                                onChange={this.handleLength}
                                                variant='outlined'
                                            >
                                            </TextFieldResult>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                        <FormControl variant={'outlined'} fullWidth>
                                            <TextFieldResult
                                                InputLabelProps={{shrink: true}}
                                                value={this.state.currentHeight}
                                                label="Толщина"
                                                onChange={this.handleHeight}
                                                variant='outlined'
                                            >
                                            </TextFieldResult>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                    <Box component={""} sx={{
                                        width: 300,
                                        borderRadius: 3,
                                        paddingBottom: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center'
                                    }}><Button sx={{
                                        width: '100%',
                                        color: '#1e5a7a', borderColor: '#1e5a7a',
                                        '&:focus': {},
                                        '&:hover': {},
                                        fontFamily: 'Roboto'
                                    }} className={'eighth-step'} variant={'outlined'} disabled={this.state.groupId === 0} onClick={this.handleUpdateGroup}> <ContentCopyIcon></ContentCopyIcon>
                                        Сохранить изменения для группы
                                    </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Dialog PaperProps={{sx: {borderRadius: 3, width: 400}}}
                        open={this.state.open}
                        keepMounted
                        onClose={this.handleCloseDialog}
                        aria-describedby="alert-dialog-slide-description"
                        BackdropProps={{style: {opacity: 0.3}}}
                >

                    <BootstrapDialogTitle color={'#4fb3ea'} fontWeight={'lighter'} fontSize={25}
                                          sx={{marginBottom: -2}} onClose={this.handleCloseDialog}>Добавление новой группы</BootstrapDialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" fontFamily={'Roboto'}
                                           fontWeight={'lighter'} color={'dimgray'} fontSize={10}
                                           sx={{marginBlock: 0}}>
                            Заполните необходимые поля
                        </DialogContentText>
                        <Box component={""} sx={{
                            width: 300,
                            borderRadius: 3,
                            paddingBottom: 2, paddingLeft: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center', flexDirection: 'column'
                        }}>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldNew
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.newType}
                                            label="Тип EU TI-RADS"
                                            onChange={this.handleNewType}
                                            variant='outlined'
                                            select
                                        >
                                            <MenuItem value={1}>TI-RADS 1</MenuItem>
                                            <MenuItem value={2}>TI-RADS 2</MenuItem>
                                            <MenuItem value={3}>TI-RADS 3</MenuItem>
                                            <MenuItem value={4}>TI-RADS 4</MenuItem>
                                            <MenuItem value={5}>TI-RADS 5</MenuItem>
                                        </TextFieldNew>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldNew
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.newWidth}
                                            label="Ширина"
                                            onChange={this.handleNewWidth}
                                            variant='outlined'
                                        >
                                        </TextFieldNew>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2,paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldNew
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.newLength}
                                            label="Длина"
                                            onChange={this.handleNewLength}
                                            variant='outlined'
                                        >
                                        </TextFieldNew>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldNew
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.newHeight}
                                            label="Толщина"
                                            onChange={this.handleNewHeight}
                                            variant='outlined'
                                        >
                                        </TextFieldNew>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{
                                    width: 300,
                                    borderRadius: 3,
                                    paddingBottom: 2, paddingTop: 5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}><Button sx={{
                                    width: '100%',
                                    color: '#1e5a7a', borderColor: '#1e5a7a',
                                    '&:focus': {},
                                    '&:hover': {},
                                    fontFamily: 'Roboto'
                                }} variant={'outlined'} onClick={this.handleCreateNewGroup}> <AddIcon></AddIcon>
                                    Добавить
                                </Button>
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
            </FormControl>
        )

    }
}

export default UpdatePageInterface;