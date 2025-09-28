import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {Autocomplete, Button, CircularProgress, createTheme, IconButton, Slide,} from "@mui/material";
import {FormControl} from "@mui/material";

import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";

import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import axios from "axios";
import {Link} from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import {jwtDecode} from "jwt-decode";



const theme = createTheme()
export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 1px;
  }
`;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            uziDevice: "",
            deviceName:{id: 0, name: ""},
            projectionType: "",
            patientCard: "",
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            typeText: "Выберите файл в формате .png или .tiff",
            imageFile: "",
            imageChoosen: false,
            patients: [],
            patientPolicy: null,
            result: false,
            resultid: 0,
            devices: [],
            openSuccess: false,
            openError: false,
            loading: false,
            patient:{id:0, last_name: "", first_name: "", fathers_name:"", personal_policy: ""},
            ref: React.createRef()
        };
    }
    componentDidMount() {
        this.handlePatientList()
        this.handleDevicesList()
    }

    handleUploadFile = (event) => {
        var imageFile = event.target.files[0];
        console.log(imageFile.name)
        const reader = new FileReader();
        reader.readAsDataURL(imageFile)
        reader.addEventListener("load", () => {
            this.setState({
                originalImage: reader.result,
                typeText: imageFile.name,
                imageFile: imageFile,
                imageChoosen: true
            });
            event.target.value = ''
        }, false)
    }
    handleChooseDevice = (object, value) => {
        object.preventDefault()
        var device1 = 0;
        for (let device of this.state.devices) {
            if (device.name === value.name) {
                device1 = device.id;
            }
        }
        this.setState({
            deviceName: {id: value.id, name: value.name},
            uziDevice: device1,
            deviceChosen: true
        });
    };


    handleChooseProjection = (event) => {
        this.setState({
            projectionType: event.target.value,
            projectionChosen: true,
        });
    };

    handleChoosePatient = (object, value) => {
        object.preventDefault()
        var patient1 = 0;
        var patient = null;
        for (patient of this.state.patients) {
            if (patient.data.personal_policy === value.data.personal_policy) {
                patient1 = patient.id;
            }
        }
        this.setState({
            patientCard: patient1,
            patientChosen: true,
            patientPolicy: value.data.personal_policy,
            patient:{id: value.data.id, last_name: value.data.last_name, first_name: value.data.first_name, fathers_name: value.data.fathers_name, personal_policy: value.data.personal_policy}
        });
    };
    handlePatientList = () => {

        const token = localStorage.getItem('access')
        if (token !== null){
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
            axios.get(this.props.url + '/med_worker/patients/'+jwtDecode(typeof localStorage.getItem('access') === "string"? localStorage.getItem('access'):"").user_id)
                .then((response) => {
                        console.log(response)
                        const tmp = []
                        for (let cur of response.data.results.cards){
                            tmp.push({id: cur.id, data: cur.patient})
                        }
                        console.log(tmp)
                        this.setState({
                            patients: tmp
                        })

                    }
                ).catch((er) => {
                console.log(er)
                // if(er.status === 401){
                //     const formData = new FormData()
                //     formData.append('refresh', localStorage.getItem('refresh'))
                //     axios.post(this.props.url + "/auth/token/refresh/?format=json", formData).then((response) => {
                //         localStorage.setItem('access', response.data.access.toString())
                //         this.context.setSignIn(false)
                //         localStorage.setItem('id', jwt_decode(response.data.access.toString()).user_id)
                //     }).catch(() => {
                //         this.context.setSignIn(true)
                //     })
                // }
            });
        }

    };
    handleDevicesList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/uzi/devices/?format=json")
            .then((response) => this.setState({devices: response.data.results}))
    };

    handleResult = () => {
        this.setState({
            loading: true
        })
        const formData = new FormData();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        formData.append("uzi_device", this.state.uziDevice);
        formData.append("projection_type", this.state.projectionType);
        formData.append("patient_card", this.state.patientCard);

        formData.append("original_image", this.state.imageFile);
        const response = axios.post(this.props.url + "/uzi/create/", formData).catch( () => {
                this.setState({
                    openError: true,
                    loading: false
                })
            }
        )
        response.then((response) => {
            console.log(response.data.image_id)
            this.setState({
                resultid: response.data.image_id,
            })
            // var storedNames = JSON.parse(localStorage.getItem("names"));
            // if (storedNames === null) {
            //     storedNames = []
            // }
            // for (let tmp of storedNames) {
            //     if (tmp === response.data.image_id) {
            //         return;
            //     }
            // }
            if (response.data.image_id !== 0){
                // storedNames.push(response.data.image_id)
                // //console.log(storedNames)
                // localStorage.setItem("names", JSON.stringify(storedNames))
                this.handleWhat();
                this.setState({
                    uziDevice: null,
                    projectionType: '',
                    patientCard: null,
                    imageFile: null,
                    typeText: "Выберите файл в формате .png или .tiff",
                    deviceName: {id: 0, name: ""},
                    patient:{id:0, last_name: "", first_name: "", fathers_name:"", personal_policy: ""},
                    deviceChosen: false,
                    projectionChosen: false,
                    patientChosen: false,
                    imageChoosen: false
                })
                //this.inputField.value = null
            }

        })
    };

    handleWhat = () => {
        this.setState({
            result: true,
            openSuccess: true,
            loading: false
        })
    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
            openError: false,
        })
    };


    render() {
        return (
            <FormControl fullWidth sx={{height: '100%', width: '100%'}}>
                <Snackbar  open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                           TransitionComponent={Slide}
                           action={
                               <IconButton
                                   aria-label="close"
                                   color="inherit"
                                   onClick={this.handleClose}
                               >
                                   <CloseIcon/>
                               </IconButton>}>
                    <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995'}} onClose={this.handleClose}>Снимок загружен!</Alert>
                </Snackbar>
                <Snackbar  open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                           TransitionComponent={Slide}
                           action={
                               <IconButton
                                   aria-label="close"
                                   color="inherit"
                                   onClick={this.handleClose}
                               >
                                   <CloseIcon/>
                               </IconButton>}>
                    <Alert severity="error" sx={{width:'100%',backgroundColor: '#d9007b'}} onClose={this.handleClose}>Снимок не загружен. Проверьте формат загружаемого файла.</Alert>
                </Snackbar>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 20,
                    paddingTop: 15,
                    borderTopLeftRadius: 130,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    }
                }} display={'flex'} color={theme.palette.secondary.contrastText}>
                    <Grid component={""} container direction={'row'} spacing={5}>
                        <Grid component={""} item  xs justifyItems={'center'}>
                            <Box className="zero-step" component={""} sx={{display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center'}}>
                                <GlobalStyles styles={{
                                    h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto", fontWeight: 'lighter',},
                                    h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
                                }}/>
                                <h1>Новый снимок УЗИ</h1>
                                <Box  className='first-step' component={""} sx={{width: 400, borderRadius: 3}}>
                                    <FormControl variant={'outlined'} fullWidth >
                                        <Autocomplete
                                            id="devices"
                                            sx={{width: 400}}
                                            options={this.state.devices}
                                            autoHighlight
                                            onChange={this.handleChooseDevice}
                                            value={this.state.deviceName}
                                            style={{whiteSpace: 'normal'}}
                                            getOptionLabel={(option) => option.name}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props} sx={{maxHeight: 40}}>
                                                    <GlobalStyles styles={{
                                                        h6: {
                                                            color: 'dimgray',
                                                            fontSize: 15,
                                                            fontFamily: "Roboto",
                                                            fontWeight: "lighter"
                                                        },
                                                        h7: {
                                                            color: 'dimgray',
                                                            fontSize: 15,
                                                            fontFamily: "Roboto",
                                                            fontWeight: "bolder"
                                                        }
                                                    }}/>
                                                    {option.name}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextFieldWrapper
                                                    {...params}
                                                    multiline
                                                    label="Аппарат"
                                                    variant='outlined'
                                                    inputProps={{
                                                        ...params.inputProps,
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Box>
                                <Box component={""} sx={{width: 300, paddingBottom: 5}}></Box>
                                <Box className='second-step' component={""} sx={{width: 400, borderRadius: 3}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldWrapper
                                            value={this.state.projectionType}
                                            label="Тип проекции"
                                            onChange={this.handleChooseProjection}
                                            variant='outlined'
                                            select
                                        >
                                            <MenuItem value={"cross"}>Поперечная</MenuItem>
                                            <MenuItem value={"long"}>Продольная</MenuItem>
                                        </TextFieldWrapper>
                                    </FormControl>
                                </Box>
                                <Box component={""} sx={{width: 300, paddingBottom: 5}}></Box>


                                <Box className='third-step' component={""} sx={{width: 400, borderRadius: 3}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <Autocomplete
                                            id="patients"
                                            sx={{width: 400}}
                                            options={this.state.patients}
                                            value={this.state.patient}
                                            autoHighlight
                                            disableClearable
                                            onChange={this.handleChoosePatient}
                                            style={{whiteSpace: 'normal'}}
                                            getOptionLabel={(option) => option.personal_policy === ""? "" : option.last_name + ' ' + option.first_name + ' ' + option.fathers_name + ' ' + option.personal_policy}
                                            isOptionEqualToValue={(option, value) => option.personal_policy === value.personal_policy}
                                            renderOption={(props, option) => (
                                                <Box sx={{width:400}} component="li" {...props} display={'flex'}>
                                                    <GlobalStyles styles={{
                                                        h6: {
                                                            color: 'black',
                                                            fontSize: 15,
                                                            fontFamily: "Roboto",
                                                            fontWeight: "lighter",
                                                            display: 'inline',
                                                            minWidth: 150
                                                        },
                                                        h3: {
                                                            color: 'black',
                                                            fontSize: 15,
                                                            fontFamily: "Roboto",
                                                            fontWeight: 'normal',
                                                            marginInline: 5,
                                                            minWidth: 170
                                                        }
                                                    }}/>
                                                    <h3>{option.data.last_name} {option.data.first_name} {option.data.fathers_name}</h3>
                                                    <h6>{option.data.personal_policy}</h6>
                                                    <IconButton component={Link} to={`/patient/edit/${option.id}`}
                                                                aria-label="close"
                                                    >
                                                        <EditIcon/>
                                                    </IconButton>
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextFieldWrapper
                                                    {...params}
                                                    multiline
                                                    label="Пациент"
                                                    variant='outlined'
                                                    inputProps={{
                                                        ...params.inputProps,
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Box>
                                <Box component={""} sx={{width: 400, paddingTop: 3}}>
                                    <FormControl fullWidth>
                                        <Button className={'third-half-step'} component={Link} to={`/patient/create`}
                                                sx={{color: '#4fb3ea',
                                                    backgroundColor: '#ffffff',
                                                    '&:focus': {backgroundColor: '#4fb3ea'},
                                                    fontStyle: {fontFamily: 'Roboto', fontColor: '#4fb3ea'}
                                                }} variant={'text'} onClick={this.handleResponse}>
                                            Добавить нового пациента
                                        </Button>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid component={""} item xs container direction={'column'}
                              alignItems="center" sx={{paddingRight: 10}}>

                            <Box component={""} display="flex"
                                 justifyContent="center"
                                 alignItems="center"
                                 sx={{height: 400}}>
                                <Grid component={""} alignItems={'center'} justify={'center'} container direction={'column'}
                                      spacing={0}>
                                    <Grid component={""} item xs justify="center">
                                        <input type='file'
                                               ref={this.state.ref}
                                            // ref={"inputField"}
                                               onChange={this.handleUploadFile}
                                               style={{display: 'none'}}
                                            //multiple={true}
                                        />
                                        <IconButton style={{maxWidth: '83px', maxHeight: '83px'}}
                                                    onClick={() => this.state.ref.current.click()}
                                            //onClick={() => this.refs.inputField.click()}
                                                    sx={{
                                                        '& svg': {
                                                            fontSize: 100
                                                        }, '&:hover': {
                                                            color: '#4fb3ea'
                                                        }
                                                    }
                                                    }>
                                            {this.state.loading && (
                                                <CircularProgress
                                                    size={70}
                                                    sx={{ marginInline: 1, position: 'absolute', top: '50%',
                                                        left: '50%',
                                                        marginTop: '-34px',
                                                        marginLeft: '-34px',
                                                        zIndex: 1,
                                                        color: '#4FB3EAFF',
                                                    }}
                                                />
                                            )}
                                            <AddCircleOutlineIcon className={'fourth-step'}></AddCircleOutlineIcon>
                                        </IconButton>
                                    </Grid>
                                    <Grid component={""} item justify="center">
                                        <GlobalStyles styles={{
                                            h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                            h5: {color: 'lightgray', fontSize: 14, fontFamily: "Roboto"}
                                        }}/>
                                        <Box component={""} display="flex"
                                             justifyContent="center"
                                             alignItems="center"

                                        >
                                            <h5 style={{fontWeight: 'lighter'}} align={'right'}>{this.state.typeText}</h5>
                                        </Box>
                                    </Grid>
                                    <Grid component={""} item container direction={'column'}>
                                        <GlobalStyles styles={{
                                            h1: {color: 'dimgray', fontSize: 40, fontFamily: "Roboto"},
                                            h5: {color: 'lightgray', fontSize: 14, fontFamily: "Roboto"}
                                        }}/>
                                        <Box component={""}
                                             display={'inline-flex'}
                                        >
                                            <Button className={'fifth-step'} sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                            }} onClick={this.handleResult} variant={'outlined'} disabled={!this.state.deviceChosen||!this.state.patientChosen||!this.state.projectionChosen||!this.state.imageChoosen}>
                                                Провести диагностику
                                            </Button>
                                            <Box component={""} sx={{width: 10}}></Box>
                                            <Button className={'sixth-step'} component={Link} to={`/result/${this.state.resultid}`} sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},

                                            }} variant={'outlined'} disabled={!this.state.result}>
                                                {this.state.loading && (
                                                    <CircularProgress
                                                        size={24}
                                                        sx={{ marginInline: 1, position: 'absolute', top: '50%',
                                                            left: '50%',
                                                            marginTop: '-12px',
                                                            marginLeft: '-12px',
                                                            zIndex: 1,
                                                            color: '#4FB3EAFF',
                                                        }}
                                                    />
                                                )}
                                                Посмотреть результат
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            </FormControl>
        )

    }
}


export default UploadPage;
