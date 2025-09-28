import React, {useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import UploadPage from "./UploadPage";
import ResultsPageInterface from "./ResultsPage";
import FAQPage from "./FAQPage";
import Fab from '@mui/material/Fab';
import {Link, Route, Routes, Navigate, useLocation} from "react-router-dom";
import {
    AppBar, Badge,
    Box, Button,
    Toolbar
} from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Typography from '@mui/material/Typography';

import { useTour } from '@reactour/tour'

import NewPatientPageInterface from "./NewPatientPage";
import EditPatientPageInterface from "./EditPatientPage";
import SignUpPageInterface from "./SignUpPage";
import SignInPageInterface from "./SignInPage";

import axios from "axios";
import GlobalStyles from "@mui/material/GlobalStyles";
import Grid from "@mui/material/Grid";
import PatientsPage from "./PatientsPage";
import PatientInterface from "./ShotTable";
import ExpertPageInterface from "./ExpertChoosePage";
import EditProfileInterface from "./EditProfilePage";
import NotificationsPageInterface from "./NotificationsPage";
import ChatPageInterface from "./ChatPage";
import UpdatePageInterface from "./UpdatePage";
import {
    stepsUpload,
    stepsPatients,
    stepsPatient,
    stepsDiagnostics,
    stepsUpdater,
    stepsForm,
    stepsFormEdit, stepsExpert, stepsInbox, stepsMsg
} from "./step";

function NoMatch() {
    let location = document.location.href;
    return (
        <div className='center' style={{display: 'block',paddingLeft: 300, paddingTop: 70}}>
            <GlobalStyles styles={{
                h1: {color: 'white', fontSize: 90, marginBlock: 20, marginInline: 10},
                h5: {color: '#1e83b6', fontSize: 70, marginBlock: 20, marginInline: 10},
                h3: {color: 'white', fontSize: 100,marginBlock: 20, marginInline: 15 }
            }}/>
            <div className='center'  style={{display: 'block'}}>
                <Typography component={""} variant={'h1'} sx={{fontSize: 190, color: '#2292cb', paddingTop: 10}} >Упс!</Typography>
            </div>
            <div className='center' style={{display: 'block'}}>
                <Typography component={""} variant={'h1'} sx={{fontSize: 70, marginBlockStart: 5, color: '#3880bd'}}>404 - Страница не найдена</Typography>
                <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 2, color: 'dimgray'}}>
                    Невозможно загрузить {location}
                </Typography>
                <div className='center' style={{display: 'flex'}}>
                    <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 2, marginInlineEnd: 0.7, color: 'dimgray'}}>
                        Перейти на
                    </Typography>
                    <Button component={Link} to={`home`}
                            sx={{ textTransform: 'none', marginBlock:1.3}} variant='text'>
                        <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 0, color: '#2292cb'}}>
                            главную страницу
                        </Typography>
                    </Button>
                    <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 2, marginInlineEnd: 0.7, color: 'dimgray'}}>
                        или
                    </Typography>
                    <Button component={Link} to={`/faq`}
                            sx={{ textTransform: 'none', marginBlock:1.3}} variant='text'>
                        <Typography component={""} variant={'h1'} sx={{fontSize: 40, marginBlock: 0, color: '#2292cb'}}>
                            страницу инструкции
                        </Typography>
                    </Button>
                </div>
            </div>
        </div>
    );
}



function App(props) {
    const [showSignIn, setSignIn] = React.useState(false)
    const [mesAm, setMesAm] = React.useState(0)
    const { setIsOpen, setSteps, setCurrentStep} = useTour()
    const location = useLocation()
    const page = location.pathname

    useEffect(() =>  {
        let id = setInterval(async () => {
            console.log("refresh")
            const formData = new FormData()
            formData.append('refresh', localStorage.getItem('refresh'))
            axios.post(props.url + "/auth/token/refresh/?format=json", formData).then((response) => {
                localStorage.setItem('access', response.data.access.toString())
                setSignIn(false)
                localStorage.setItem('id', jwtDecode(response.data.access.toString()).user_id)
                axios.get(props.url+'/inner_mail/notifications/all/'+ localStorage.getItem('id')+'/?status=0').then((response) => {
                    localStorage.setItem('mesAm', response.data.count)
                    setMesAm(response.data.count)
                })
            }).catch(() => {
                setSignIn(true)
            })
        }, 120000);

        return () => {
            clearInterval(id)
        }

    }, [])

    useEffect(() => {
        if(page.split('/')[2] === 'msg'){
            setMesAm(parseInt(localStorage.getItem('mesAm')))
        }
        if(page === '/inbox'){
            setMesAm(parseInt(localStorage.getItem('mesAm')))
        }
    }, [location])

    useEffect(() => {
        if (localStorage.getItem('access') === null) {
            setSignIn(true)
        } else {
            const formData = new FormData()
            formData.append('refresh', localStorage.getItem('refresh'))
            axios.post(props.url + "/auth/token/refresh/?format=json", formData).then((response) => {
                localStorage.setItem('access', response.data.access.toString())
                setSignIn(false)
                localStorage.setItem('id', jwtDecode(response.data.access.toString()).user_id)
                axios.get(props.url+'/inner_mail/notifications/all/'+ localStorage.getItem('id')+'/?status=0').then((response) => {
                    localStorage.setItem('mesAm', response.data.count)
                    setMesAm(response.data.count)
                })
            }).catch(() => {
                setSignIn(true)
            })
        }
    }, [props.url])
    const handleExit = () => {
        localStorage.setItem('access', null)
        localStorage.setItem('refresh', null)
        setSignIn(true)
    }
    const handleIntro = () => {
        console.log(page.split('/')[1])
        if(page === '/home'){
            setSteps(stepsUpload)
        }
        if(page === '/patients'){
            setSteps(stepsPatients)
        }
        if(page === '/inbox'){
            setSteps(stepsInbox)
        }
        if(page.split('/')[2] === 'msg'){
            setSteps(stepsMsg)
        }
        if(page.split('/')[1] === 'result'){
            setSteps(stepsDiagnostics)
        }
        if(page.split('/')[3] === 'update'){
            setSteps(stepsUpdater)
        }
        if(page.split('/')[3] === 'expert'){
            setSteps(stepsExpert)
        }
        if(page.split('/')[1] === 'patient'){
            setSteps(stepsPatient)
        }
        if(page.split('/')[2] === 'create'){
            setSteps(stepsForm)
        }
        if(page.split('/')[2] === 'edit'){
            setSteps(stepsFormEdit)
        }
        setCurrentStep(0)
        setIsOpen(true)
    }

    const Home = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace/>;
        }
        return <UploadPage url={props.url}/>;
    };
    const Result = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <ResultsPageInterface url={props.url}/>;
    };
    const ChPage = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <ChatPageInterface url={props.url}/>;
    };
    const ExpertPage = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <ExpertPageInterface url={props.url}/>;
    };
    const NotifPage = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <NotificationsPageInterface url={props.url}/>;
    };
    const Mask = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <UpdatePageInterface url={props.url}/>;
    };
    const Shot = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }

        return <PatientInterface url={props.url}/>;
    };
    const EditPatient = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <EditPatientPageInterface url={props.url}/>;
    };
    const EditProfile = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <EditProfileInterface url={props.url}/>;
    };
    const NewPatient = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <NewPatientPageInterface url={props.url}/>;
    };
    const Patients = (showSignIn, props) => {
        if (showSignIn) {
            return <Navigate to="/sign_in" replace />;
        }
        return <PatientsPage url={props.url}/>;
    };

    return (
        <div>
            <div className={'start-step'}>
                <Box component={""} hidden={showSignIn} sx={{ borderBottomRightRadius: 6, borderBottomLeftRadius: 6, backgroundColor: '#bae7f6', marginBlock:0, marginInline:0, minWidth: 500, width: 'auto'}} >
                    <AppBar elevation={0} hidden={showSignIn} position="absolute" sx={{
                        borderBottomRightRadius: 6,
                        borderBottomLeftRadius: 6,
                        backgroundColor: '#4FB3EAFF', minWidth: 600
                    }}>
                        <Toolbar sx={{minWidth: 600, width: 'auto', backgroundColor: '#fdfdfd',boxShadow: "0px 10px 20px gainsboro", marginBlock: 0, marginInline:0,}} >
                            <Grid component={""} hidden={showSignIn} container-direction={'row'} sx={{paddingLeft:5}} spacing={1} justifyContent={'center'} display={'flex'}>
                                {['Пациенты','Почта', 'Добавить снимок', 'Помощь', 'Выйти'].map((text, index) => (
                                    <Grid component={""} item key={text} xs={index === 4? 1: index===1? 2: index===3? 2: index===2? 2: 2} sm={index === 4? 1: index===1? 2: index===2? 2: index===3? 2: 2}  sx={{ alignItems:'center', justifyContent:'center', alignContent:'center', width: '100%'}}>
                                        <Button variant={'outlined'} component={Link} sx={{ height: 65, width: 100, marginBlock:0, fontFamily: 'Roboto', borderColor: 'white', borderRadius: 0,borderBottomColor: "white", borderBottomWidth: 0,fontWeight: index ===2? 'normal':'lighter', color: 'dimgray', textTransform: 'none', boxShadow: 0, '&:hover': {
                                                color: "#4FB3EAFF", borderColor: 'white', borderBottomColor: "#4FB3EAFF", borderRadius: 0, borderBottomWidth: 5, backgroundColor: 'white'
                                            }, '&:active': {
                                                color: "#4FB3EAFF", borderColor: 'white', borderBottomColor: "#4FB3EAFF", borderRadius: 0, borderBottomWidth: 5, backgroundColor: 'white'
                                            }, }}
                                                to={index === 2 ? `home` : index === 0 ? `patients` : index === 1 ? `inbox`: index === 3? `faq`:`sign_in`} onClick={index === 4 ? handleExit : null }>
                                            {index === 0 ? null : (index === 1) ? null : (index === 2) ? null : (index === 3) ? null :
                                                <ExitToAppIcon style={{maxWidth: '20px', maxHeight: '20px'}}
                                                               sx={{
                                                                   '& svg': {
                                                                       fontSize: 20,
                                                                       color: "dimgray"
                                                                   },
                                                                   '&:hover': {
                                                                       fontSize: 20,
                                                                       color: "#4FB3EAFF"
                                                                   },
                                                               }
                                                               }/>
                                            }
                                            <Badge badgeContent={localStorage.getItem('mesAm')} invisible={index !== 1 || localStorage.getItem('mesAm') == 0} sx={{ "& .MuiBadge-badge": {
                                                    color: "white",
                                                    backgroundColor: "#4FB3EAFF",
                                                }}} >
                                                {text}
                                            </Badge>
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </Box>
                {/*<Fab variant={'extended'} sx={{position: 'fixed', bottom:20, right:20, backgroundColor: "#ffffff", color: '#4FB3EAFF', width:40, height:40}} component={Link} to={`/faq`}>*/}
                {/*    <QuestionMarkIcon></QuestionMarkIcon>*/}
                {/*</Fab>*/}
                <Fab disabled={showSignIn} variant={'extended'} sx={{position: 'fixed', bottom:20, right:20, backgroundColor: "#ffffff", color: 'dimgray', width:40, height:40}} onClick={handleIntro}>
                    <QuestionMarkIcon></QuestionMarkIcon>
                </Fab>
                <Routes>
                    <Route exact path="sign_in" element={<SignInPageInterface setSignIn={setSignIn} url={props.url}/>}/>
                    <Route exact path="sign_up" element={<SignUpPageInterface url={props.url}/>}/>
                    <Route exact path="patient/create" element={NewPatient(showSignIn, props)}/>
                    <Route exact path="patient/edit/:number" element={EditPatient(showSignIn, props)}/>
                    <Route exact path="profile/edit" element={EditProfile(showSignIn, props)}/>
                    <Route exact path="patients" element={ Patients(showSignIn, props)}/>
                    <Route exact path="patient/:number" element={ Shot(showSignIn, props)}/>
                    <Route exact path="result/:number2/update" element={Mask(showSignIn, props)}/>
                    <Route exact path="result/:number" element={ Result(showSignIn, props)}/>
                    <Route exact path="faq" element={ <FAQPage/>}/>
                    <Route exact path="inbox" element={ NotifPage(showSignIn, props)}/>
                    <Route exact path="inbox/msg/:number" element={ ChPage(showSignIn, props)}/>
                    <Route exact path="result/:number/expert" element={ ExpertPage(showSignIn, props)}/>
                    <Route path="home" element={Home(showSignIn, props)}/>
                    <Route exact path={'*'} element={<NoMatch />}/>
                </Routes>
            </div>
        </div>
    );
}


export default App;