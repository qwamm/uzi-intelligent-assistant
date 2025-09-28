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

import isEmail from 'validator/lib/isEmail';

import Grid from '@mui/material/Grid';

import axios from "axios";
import {useParams} from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';

const regex = new RegExp('\\d+');

const NewPatientPageInterface = (props) => {
    const {number} = useParams();
    return (
        <NewPatientPage props={number} url={props.url}></NewPatientPage>

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

class NewPatientPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: "",
            lastNameEntered: false,
            firstName: "",
            firstNameEntered: false,
            fathersName: "",
            fathersNameEntered: false,
            email: "",
            emailEntered: false,
            policy: "",
            policyEntered: false,
            active: false,
            doctorEmailEntered: false,
            diagnosis: "",
            doctorName: "",
            doctorEmail: "",
            doctorSp: "",
            ill: false,
            openSuccess: false,
            openError: false,
        };
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
    handleEmail = (event) => {
        this.setState({
            email: event.target.value, emailEntered: isEmail(event.target.value),
        });
    };
    handlePolicy = (event) => {
        this.setState({
            policy: event.target.value,
        });
        this.setState({
            policyEntered: event.target.value.length === 16 && regex.exec(event.target.value),
        });
    };
    handleDiagnosis = (event) => {
        this.setState({
            diagnosis: event.target.value,
        });
    };
    handleActive = () => {
        this.setState({
            active: !this.state.active,
        });
    };
    handleIll = () => {
        this.setState({
            ill: !this.state.ill,
        });
    };
    handleDoctorName = (event) => {
        this.setState({
            doctorName: event.target.value,
        });
    };
    handleDoctorSp = (event) => {
        this.setState({
            doctorSp: event.target.value,
        });
    };
    handleDoctorEmail = (event) => {
        this.setState({
            doctorEmail: event.target.value, doctorEmailEntered: isEmail(event.target.value),
        });
    };


    handleResponse = () => {
        const formData = new FormData();

        formData.append("patient.first_name", this.state.firstName);
        formData.append("patient.last_name", this.state.lastName);
        formData.append("patient.fathers_name", this.state.fathersName);
        formData.append("patient.personal_policy", this.state.policy);
        formData.append("patient.email", this.state.email);
        formData.append("patient.is_active", this.state.active);
        formData.append("card.has_nodules", this.state.ill ? "T" : "F");
        formData.append("card.diagnosis", this.state.diagnosis);
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.post(this.props.url + "/patient/create/"+localStorage.getItem('id'), formData)
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
            <FormControl fullWidth fullHeight >
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
                           onClose={this.handleClose}>Карта создана!</Alert>
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
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}} onClose={this.handleClose}>Карта
                        не добавлена. Проверьте введенные данные.</Alert>
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
                    },
                }} color={theme.palette.secondary.contrastText} >
                    <GlobalStyles styles={{
                        h1: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", fontWeight: 'normal'},
                        h5: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto"}
                    }}/>

                    <Grid component={""} container spacing={1} >
                        <Grid component={""} item xs sx={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignContent: 'center'}}>
                            <h1>Создание карты пациента</h1>
                            <Box component={""} sx={{width: 500, paddingBottom: 3, paddingTop: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Фамилия
                                    </InputLabel>
                                    <TextFieldWrapper
                                        error={this.state.lastName.length === 0 && this.state.lastNameEntered}
                                        value={this.state.lastName}
                                        onChange={this.handleLastName}
                                        variant='outlined'
                                        helperText="Введите фамилию пациента"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Имя
                                    </InputLabel>
                                    <TextFieldWrapper
                                        error={this.state.firstName.length === 0 && this.state.firstNameEntered}
                                        value={this.state.firstName}
                                        onChange={this.handleFirstName}
                                        variant='outlined'
                                        helperText="Введите имя пациента"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Отчество
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.fathersName}
                                        onChange={this.handleFathersName}
                                        error={this.state.fathersName.length === 0 && this.state.fathersNameEntered}
                                        variant='outlined'
                                        helperText="Введите отчество пациента"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Эл. почта
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.email}
                                        onChange={this.handleEmail}
                                        error={!this.state.emailEntered && this.state.email.length !== 0}
                                        variant='outlined'
                                        helperText="Введите электронную почту пациента"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Полис
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.policy}
                                        onChange={this.handlePolicy}
                                        error={!this.state.policyEntered && this.state.policy.length !== 0}
                                        variant='outlined'
                                        helperText={!this.state.policyEntered && this.state.policy.length !== 0 ? "Номер полиса должен содержать только цифры и состоять из 16 знаков" : "Введите полис пациента"}
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormLabel component="legend"></FormLabel>
                                <FormGroup className={'second-step'} aria-label="position" row>
                                    <FormControlLabel
                                        control={<Checkbox value={this.state.active} sx={{
                                            '&.Mui-checked': {
                                                color: '#4FB3EAFF',
                                            }
                                        }}
                                                           icon={<DoneSharpIcon/>}
                                                           checkedIcon={<DoneSharpIcon/>}
                                                           onChange={this.handleActive}
                                        />}
                                        labelPlacement="end"
                                        label={"Пациент активен"}
                                        sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                    />
                                </FormGroup>
                            </Box>
                        </Grid>
                        <Grid component={""} item xs>
                            <Box component={""} sx={{width: 500, height: 98, paddingBottom: 7, paddingTop: 3}}>
                                <FormControl>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Диагноз
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.diagnosis}
                                        onChange={this.handleDiagnosis}
                                        variant='outlined'
                                        sx={{marginBlockStart: 1, width: 500, height: 98}}
                                        multiline
                                        inputProps={{
                                            style: {
                                                height: 98, borderRadius: 3
                                            }
                                        }}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 600, paddingBottom: 3}}>
                                <FormLabel component="legend"></FormLabel>
                                <FormGroup className={'third-step'} aria-label="position" row>
                                    <FormControlLabel

                                        control={<Checkbox checked={this.state.ill} sx={{
                                            '&.Mui-checked': {
                                                color: '#4FB3EAFF',
                                            }
                                        }}
                                                           icon={<DoneSharpIcon/>}
                                                           checkedIcon={<DoneSharpIcon/>}
                                                           onClick={this.handleIll}
                                        />}
                                        labelPlacement="end"
                                        label={"Обнаружено новообразование"}
                                        sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={!this.state.ill} sx={{
                                            '&.Mui-checked': {
                                                color: '#4FB3EAFF',
                                            }
                                        }}
                                                           icon={<DoneSharpIcon/>}
                                                           checkedIcon={<DoneSharpIcon/>}
                                                           onClick={this.handleIll}
                                        />}
                                        labelPlacement="end"
                                        label={"Без патологий"}
                                        sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                    />
                                </FormGroup>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel shrink sx={{marginBlockEnd: 5}}>
                                        ФИО лечащего врача
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.doctorName}
                                        onChange={this.handleDoctorName}
                                        variant='outlined'
                                        helperText="Введите ФИО лечащего врача"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel shrink sx={{marginBlockEnd: 5}}>
                                        Специальность
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.doctorSp}
                                        onChange={this.handleDoctorSp}
                                        variant='outlined'
                                        helperText="Введите специальность лечащего врача"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel shrink sx={{marginBlockEnd: 5}}>
                                        Эл. почта
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.doctorEmail}
                                        onChange={this.handleDoctorEmail}
                                        variant='outlined'
                                        error={!this.state.doctorEmailEntered && this.state.doctorEmail.length !== 0}
                                        helperText="Введите электронную почту лечащего врача"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <Button disabled={!(this.state.lastNameEntered &&
                                        this.state.firstNameEntered && this.state.fathersNameEntered && this.state.emailEntered && this.state.policyEntered)}
                                            sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},

                                                fontFamily: 'Roboto'
                                            }} className={'first-step'} variant={'outlined'} onClick={this.handleResponse}>
                                        Создать карту пациента
                                    </Button>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            </FormControl>)

    }
}

export default NewPatientPageInterface;
