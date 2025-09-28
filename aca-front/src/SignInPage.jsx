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


import Grid from '@mui/material/Grid';

import axios from "axios";
import {Link, useParams} from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import {Visibility, VisibilityOff} from "@mui/icons-material";



const SignInPageInterface = (props) => {
    const {number} = useParams();
    return (

        <SignInPage props={number} url={props.url} setSignIn={props.setSignIn}></SignInPage>

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

class SignInPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailEntered: false,
            password: "",
            passwordEntered: false,
            openSuccess: false,
            openError: false,
            showPassword: false,
            success: false
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

    handleEmail = (event) => {
        this.setState({
            email: event.target.value, emailEntered: true,
        });
    };
    handlePassword = (event) => {
        this.setState({
            password: event.target.value,
            passwordEntered: true,
        });
    };



    handleResponse = () => {
        const formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        axios.post(this.props.url + "/auth/login/", formData,
            //     {headers: {
            //     'Access-Control-Allow-Origin': '*',
            //         "Access-Control-Allow-Methods": 'GET, PUT, POST, DELETE, OPTIONS',
            // }}
        )
            .then((response) => {
                this.setState({
                    openSuccess: true,
                    success: true
                })
                localStorage.setItem('refresh', response.data.refresh)
                localStorage.setItem('access', response.data.access)
                this.props.setSignIn(false)
                var link = document.createElement('a');
                link.href = '/home';
                link.click();
                document.body.removeChild(link);
            })
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
                           onClose={this.handleClose}>Аккаунт создан!</Alert>
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
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}} onClose={this.handleClose}>Не удается войти в аккаунт</Alert>
                </Snackbar>
                <GlobalStyles styles={{
                    h1: {color: '#4fb3ea', fontSize: 50, fontFamily: "Roboto"},
                    h5: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", marginBlockEnd: 30},
                    h3: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto",fontWeight: 'normal', marginBlockEnd: 15}
                }}/>

                <Grid component={""} container spacing={1}>
                    <Grid component={""} item xs>
                        <Box component={""} sx={{width:'auto', marginBlock: 15, marginInlineStart:10, marginInlineEnd:10}}>
                            <FormControl>
                                <h1 >Интеллектуальный ассистент слепой диагностики узловых образований щитовидной железы</h1>
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
                            boxShadow: "0px 0px 20px gainsboro",
                            height: '100%',
                            minHeight: 600,
                            '&:hover': {
                                backgroundColor: "#ffffff",
                            },
                        }} color={theme.palette.secondary.contrastText} >
                            <h5>Войти</h5>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel shrink sx={{marginBlockEnd: 5}}>
                                        Эл. почта
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.email}
                                        onChange={this.handleEmail}
                                        variant='outlined'
                                        helperText="Введите Вашу электронную почту"
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <InputLabel shrink sx={{marginBlockEnd: 5}}>
                                        Пароль
                                    </InputLabel>
                                    <TextFieldWrapper
                                        value={this.state.password}
                                        onChange={this.handlePassword}
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
                                        helperText={ "Введите пароль"}
                                        sx={{marginBlockStart: 1}}
                                    >
                                    </TextFieldWrapper>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                                <FormControl fullWidth>
                                    <Button disabled={!(this.state.emailEntered && this.state.passwordEntered && this.state.email.length !== 0 && this.state.password.length)}
                                            sx={{
                                                color: '#4fb3ea',
                                                '&:focus': {backgroundColor: '#4fb3ea'},
                                                '&:hover': {
                                                },
                                                fontFamily: 'Roboto'
                                            }} variant={'outlined'} onClick={this.handleResponse}>
                                        Войти
                                    </Button>
                                </FormControl>
                            </Box>
                            <Box component={""} sx={{paddingBottom: 3}} display={'flex'}>
                                <h3>У Вас нет аккаунта?</h3>
                                <Button component={Link} to={`/sign_up`}
                                        sx={{ textTransform: 'none', width: 'auto', fontStyle: {color: '#4FB3EAFF'},
                                            fontFamily: 'Roboto', fontWeight: 'normal', fontSize: 15, marginBlockStart:0.2
                                        }} variant='text'>
                                    Зарегистрироваться
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </FormControl>)

    }
}

export default SignInPageInterface;
