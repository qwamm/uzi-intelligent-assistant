import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Box,
    Button,
    Checkbox,
    createTheme,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton,
    InputLabel,
    Slide,
    styled,
    TextField,
} from "@mui/material";


import Grid from '@mui/material/Grid';

import axios from "axios";
import {useParams} from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';


const EditProfileInterface = (props) => {
    const {number} = useParams();
    return (

        <EditProfilePage props={number} url={props.url}></EditProfilePage>

    )
}


const theme = createTheme()
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 4px;
    border-color: #4FB3EAFF;
    border-width: 0.5px;
  }

,
& . MuiOutlinedInput-root {
  &.Mui-focused fieldset {
    border-color: #4FB3EAFF;
  }
}
`;

class EditProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: "",
            lastNameEntered: false,
            firstName: "",
            firstNameEntered: false,
            fathersName: "",
            fathersNameEntered: false,
            job: "",
            jobEntered: false,
            expertDetails: "",
            expertDetailEntered: false,
            medOrganization: "",
            medOrganizationEntered: false,
            is_remote_worker: false,
            openSuccess: false,
            openError: false,
        };

    }
    componentDidMount() {
        this.handleStartPage()
    }

    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + '/med_worker/update/'+localStorage.getItem('id'), ).then((response)=>{
            this.setState({
                lastName: response.data.last_name,
                lastNameEntered: true,
                firstName: response.data.first_name,
                firstNameEntered: true,
                fathersName: response.data.fathers_name,
                fathersNameEntered: true,
                job: response.data.job !== null ? response.data.job : "",
                jobEntered: true,
                expertDetails: response.data.expert_details,
                expertDetailEntered: true,
                medOrganization: response.data.med_organization,
                medOrganizationEntered: true,
                is_remote_worker: response.data.is_remote_worker,
            })
        })
    }

    handleLastName = (event) => {
        this.setState({
            lastName: event.target.value, lastNameEntered: true,
        });
    };
    handleFirstName = (event) => {
        this.setState({
            firstName: event.target.value, firstNameEntered: true,
        });
    };
    handleFathersName = (event) => {
        this.setState({
            fathersName: event.target.value, fathersNameEntered: true,
        });
    };
    handleJob = (event) => {
        this.setState({
            job: event.target.value, jobEntered: true,
        });
    };
    handleMedOrganization = (event) => {
        this.setState({
            medOrganization: event.target.value,
        });
        this.setState({
            medOrganizationEntered: true,
        });
    };
    handleExpertDetails = (event) => {
        this.setState({
            expertDetails: event.target.value,
        });
    };
    handleRemote = () => {
        this.setState({
            is_remote_worker: !this.state.is_remote_worker,
        });
    };



    handleResponse = () => {
        const formData = new FormData();
        formData.append("first_name", this.state.firstName);
        formData.append("last_name", this.state.lastName);
        formData.append("fathers_name", this.state.fathersName);
        formData.append("is_remote_worker", this.state.is_remote_worker);
        formData.append("job", this.state.job);
        formData.append("expert_details", this.state.expertDetails);
        formData.append("med_organization", this.state.medOrganization);
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.put(this.props.url + "/med_worker/update/"+localStorage.getItem('id'), formData, )
            .then(() => this.setState({
                openSuccess: true
            }))
            .catch(() => {
                this.setState({
                    openError: true
                })
            })
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false, openError: false,
        })
    };

    render() {
        return (

            <FormControl sx={{height: '100%', width: '100%'}}>
                <Snackbar open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={<IconButton
                              aria-label="close"
                              color="inherit"
                              onClick={this.handleClose}
                          >
                              <CloseIcon/>
                          </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Изменения сохранены!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={<IconButton
                              aria-label="close"
                              color="inherit"
                              onClick={this.handleClose}
                          >
                              <CloseIcon/>
                          </IconButton>}>
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}} onClose={this.handleClose}>Данные не обновлены. Проверьте введенную информацию.</Alert>
                </Snackbar>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 20,
                    paddingTop: 10,
                    borderTopLeftRadius: 130,
                    height: 'auto',
                    minHeight: 600,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    }
                }} color={theme.palette.secondary.contrastText}>
                    <GlobalStyles styles={{
                        h1: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", fontWeight: 'normal'},
                        h5: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto"}
                    }}/>
                    <h1>Профиль</h1>
                    <Grid component={""} container direction={'row'} spacing={1}>
                        <Grid component={""} xs item>
                            <Box component={""} sx={{width: 500, paddingBottom: 3, paddingTop: 3}}>
                                <FormControl sx={{height: '100%', width: '100%'}}>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Фамилия
                                    </InputLabel>
                                    <TextFieldWrapper
                                        error={this.state.lastName.length === 0 && this.state.lastNameEntered}
                                        value={this.state.lastName}
                                        onChange={this.handleLastName}
                                        variant='outlined'
                                        helperText="Введите Вашу фамилию"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl sx={{height: '100%', width: '100%'}}>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Имя
                                    </InputLabel>
                                    <TextFieldWrapper
                                        error={this.state.firstName.length === 0 && this.state.firstNameEntered}
                                        value={this.state.firstName}
                                        onChange={this.handleFirstName}
                                        variant='outlined'
                                        helperText="Введите Ваше имя"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl sx={{height: '100%', width: '100%'}}>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Отчество
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.fathersName}
                                        onChange={this.handleFathersName}
                                        error={this.state.fathersName.length === 0 && this.state.fathersNameEntered}
                                        variant='outlined'
                                        helperText="Введите Ваше отчество"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl sx={{height: '100%', width: '100%'}}>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Должность
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.job}
                                        onChange={this.handleJob}
                                        error={!this.state.jobEntered && this.state.job.length !== 0}
                                        variant='outlined'
                                        helperText="Введите занимаемую Вами должность"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl sx={{height: '100%', width: '100%'}}>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Место работы
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.medOrganization}
                                        onChange={this.handleMedOrganization}
                                        error={!this.state.medOrganizationEntered && this.state.medOrganization.length !== 0}
                                        variant='outlined'
                                        helperText={"Введите название медицинской организации"}
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormLabel component="legend"></FormLabel>
                                <FormGroup aria-label="position" row>
                                    <FormControlLabel
                                        control={<Checkbox checked={this.state.is_remote_worker} sx={{
                                            '&.Mui-checked': {
                                                color: '#4FB3EAFF',
                                            }
                                        }}
                                                           icon={<DoneSharpIcon/>}
                                                           checkedIcon={<DoneSharpIcon/>}
                                                           onChange={this.handleRemote}
                                        />}
                                        labelPlacement="end"
                                        label={"Я хочу давать экспертное заключение"}
                                        sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                    />
                                </FormGroup>
                            </Box>
                        </Grid>
                        <Grid component={""} xs item>
                            <Box component={""} sx={{width: 500, height: 200, paddingBottom: 7, paddingTop: 3}}>
                                <FormControl>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Профессиональный опыт
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.expertDetails}
                                        onChange={this.handleExpertDetails}
                                        variant='outlined'
                                        sx={{marginBlockStart: 1, width: 500, height: 200}}
                                        multiline
                                        inputProps={{
                                            style: {
                                                height: 200, borderRadius: 3
                                            }
                                        }}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>

                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl>
                                    <Button
                                        sx={{
                                            color: '#4fb3ea',
                                            '&:focus': {backgroundColor: '#4fb3ea'},
                                            fontFamily: 'Roboto'
                                        }} variant={'outlined'} onClick={this.handleResponse}>
                                        Сохранить изменения
                                    </Button>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            </FormControl>)

    }
}

export default EditProfileInterface;
