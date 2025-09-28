import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Box,
    Button,
    createTheme,
    FormControl,
    IconButton, InputAdornment,
    InputLabel,
    Slide,
    styled,
    TextField,
} from "@mui/material";

import isEmail from 'validator/lib/isEmail';
import isStrongPassword from "validator/es/lib/isStrongPassword";

import Grid from '@mui/material/Grid';

import axios from "axios";
import {Link, useParams} from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import {Visibility, VisibilityOff} from "@mui/icons-material";



const SignUpPageInterface = (props) => {
    const {number} = useParams();
    return (

        <SignUpPage props={number} url={props.url}></SignUpPage>

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

class SignUpPage extends React.Component {
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
            password1: "",
            password1Entered: false,
            password2: "",
            password2Entered: false,
            hospital: "",
            hospitalEntered: false,
            openSuccess: false,
            openError: false,
            showPassword: false
        };
    }
    handleClickShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    handleMouseDownPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
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
    handleEmail = (event) => {
        this.setState({
            email: event.target.value, emailEntered: isEmail(event.target.value),
        });
    };
    handlePassword1 = (event) => {
        this.setState({
            password1: event.target.value,
        });
        this.setState({
            password1Entered: isStrongPassword(event.target.value),
        });
    };
    handlePassword2 = (event) => {
        this.setState({
            password2: event.target.value,
        });
        this.setState({
            password2Entered: isStrongPassword(event.target.value),
        });
    };
    handleHospital = (event) => {
        this.setState({
            hospital: event.target.value,
            hospitalEntered: true,
        });
    };



    handleResponse = () => {
        const formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("last_name", this.state.lastName);
        formData.append("first_name", this.state.firstName);
        formData.append("fathers_name", this.state.fathersName);
        formData.append("med_organization", this.state.hospital);
        formData.append("password1", this.state.password1);
        formData.append("password2", this.state.password2);
        axios.post(this.props.url + "/auth/register/", formData,)
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
            <FormControl fullWidth fullHeight>
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
                           onClose={this.handleClose}
                           action={
                               <Button component={Link} to={`/sign_in`} sx={{lineHeight: 1.43, marginBlock: 0, fontStyle: {color: '#ffffff'}}} onClick={this.handleClose}>Войти</Button>}>Аккаунт создан!
                    </Alert>
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
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}} onClose={this.handleClose}>Аккаунт не создан</Alert>
                </Snackbar>
                <GlobalStyles styles={{
                    h1: {color: '#4fb3ea', fontSize: 50, fontFamily: "Roboto"},
                    h5: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", marginBlockEnd: 0},
                    h3: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto",fontWeight: 'normal', marginBlockEnd: 15}
                }}/>

                <Grid component={""} container spacing={1}>
                    <Grid component={""} item xs>
                        <Box component={""} sx={{width:'auto', marginBlock: 15, marginInlineStart:10, marginInlineEnd:10}}>
                            <FormControl fullWidth fullHeight >
                                <h1>Интеллектуальный ассистент слепой диагностики узловых образований щитовидной железы</h1>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid component={""} item xs>
                        <Box component={""} sx={{
                            backgroundColor: '#ffffff',
                            paddingLeft: 20,
                            paddingTop: 10,
                            borderTopLeftRadius: 130,
                            elevation: 10,
                            boxShadow: "0px 0px 20px gainsboro",                                height: 'auto',
                            minHeight: 600,
                            '&:hover': {
                                backgroundColor: "#ffffff",
                            },
                        }} color={theme.palette.secondary.contrastText} >
                            <h5>Зарегистрироваться</h5>
                            <Box component={""} sx={{paddingBottom: 3}} display={'flex'}>
                                <h3>Уже есть аккаунт?</h3>
                                <Button component={Link} to={`/sign_in`}
                                        sx={{ textTransform: 'none', width: 'auto', fontStyle: {color: '#4FB3EAFF'},
                                            fontFamily: 'Roboto', fontWeight: 'normal', fontSize: 15, marginBlockStart:0.2
                                        }} variant='text'>
                                    Войти
                                </Button>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3, paddingTop: 1}}>
                                <FormControl fullWidth>
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
                                <FormControl fullWidth>
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
                                <FormControl fullWidth>
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
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Мед. организация
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.hospital}
                                        onChange={this.handleHospital}
                                        error={this.state.hospital.length === 0 && this.state.hospitalEntered}
                                        variant='outlined'
                                        helperText="Введите название медицинской организации, в которой Вы работаете"
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
                                        helperText="Введите Вашу электронную почту"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Пароль
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.password1}
                                        onChange={this.handlePassword1}
                                        error={!this.state.password1Entered && this.state.password1.length !== 0 && this.state.password1 !== this.state.password2}
                                        variant='outlined'
                                        type={this.state.showPassword ? "text" :"password"}
                                        InputProps={{ // <-- This is where the toggle button is added.
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={this.handleClickShowPassword}
                                                        onMouseDown={this.handleMouseDownPassword}
                                                    >
                                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        helperText={this.state.password1 !== this.state.password2 ? "Пароли не совпадают" : !this.state.password1Entered && this.state.password1.length !== 0 ? <> Пароль должен содержать: <br /> - Заглавную букву <br /> - Строчную букву <br /> - Один специальный символ (- # ! $ @ % ^ & * _ + |  = ? , . /) \<br /> - Минимум 8 знаков </> : "Введите пароль"}
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel required={true} shrink sx={{marginBlockEnd: 5}}>
                                        Повторите пароль
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.password2}
                                        onChange={this.handlePassword2}
                                        error={!this.state.password2Entered && this.state.password2.length !== 0 && this.state.password1 !== this.state.password2}
                                        variant='outlined'
                                        type={this.state.showPassword ? "text" :"password"}
                                        InputProps={{ // <-- This is where the toggle button is added.
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={this.handleClickShowPassword}
                                                        onMouseDown={this.handleMouseDownPassword}
                                                    >
                                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        helperText={this.state.password1 !== this.state.password2 ? "Пароли не совпадают" : "Повторите пароль"}
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <Button disabled={!(this.state.lastNameEntered &&
                                        this.state.firstNameEntered && this.state.fathersNameEntered && this.state.emailEntered && this.state.hospitalEntered && this.state.password1Entered && this.state.password2Entered)}
                                            sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                                fontFamily: 'Roboto'
                                            }} variant={'outlined'} onClick={this.handleResponse}>
                                        Создать аккаунт
                                    </Button>
                                </FormControl>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </FormControl>)

    }
}

export default SignUpPageInterface;
