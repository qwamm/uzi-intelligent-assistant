import * as React from 'react';
import {useEffect, useState} from 'react';
import '@fontsource/poppins/700.css'
import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Badge,
    Box,
    Button,
    createTheme,
    Divider,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Slide,
    styled,
    TextField,
} from "@mui/material";
import 'dayjs/locale/ru';


import axios from "axios";
import {Link, useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
const theme = createTheme()
export const TextFieldResult = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 2px;

  }

,
'& label': marginLeft: "100%",
`;

function createData(id, doctorName, medOrganization, title, pat, status, date) {
    return {
        id: id,
        doctorName: doctorName,
        medOrganization: medOrganization,
        title: title,
        pat: pat,
        status: status,
        date: date.toLocaleDateString()
    };
}

const MyGrid = (props) => {
    const [tableData, setTableData] = useState([])
    const [groupsUnread, setGroup] = useState( new Set([]))
    const [data, setData] = useState([])
    const [next, setNext] = useState("")
    const [previous, setPrevious] = useState("")
    const [members, setMembers] = useState(new Set([]))
    const [memAr, setMemAr] = useState([])


    useEffect(() => {(async () => {
        const tmpAr = []
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/inner_mail/notifications/all/" + localStorage.getItem('id') + "/?status=0").then((response) => {
            localStorage.setItem('mesAm', response.data.count)
            const tmpGroups = new Set([])
            console.log(response)
            for (let cur of response.data.results) {
                if (!tmpGroups.has(cur.mail.notification_group.id)) {
                    tmpGroups.add(cur.mail.notification_group.id)
                }
            }
            setGroup(tmpGroups)
            return tmpGroups
        }).then((ret) => {
            axios.get(props.url + "/inner_mail/notifications/groups/?limit=5").then((response) => {
                setNext(response.data.next)
                setPrevious(response.data.previous)
                //console.log(response.data)
                const tmpMembers = new Set([])
                for (let cur of response.data.results) {
                    if (ret.has(cur.id)) {
                        tmpAr.push(createData(cur.id, cur.members, [], cur.title, cur.uzi_patient_card, 0, new Date(Date.parse(cur.create_date))))
                        cur.members.map((tmp) => tmpMembers.add(tmp))
                    } else {
                        tmpAr.push(createData(cur.id, cur.members, [], cur.title, cur.uzi_patient_card, 1, new Date(Date.parse(cur.create_date))))
                        cur.members.map((tmp) =>
                            tmpMembers.add(tmp)
                        )
                    }
                }
                setMembers(tmpMembers)
            }).then(() => setTableData(tmpAr)).finally(() => {})
        })})()
        return () => {     }

    }, [])

    useEffect(() => {
        for (let cur of tableData) {
            cur.doctorName.map((tmp) => members.add(tmp))
        }
        const urls = []
        for (let id of members) {
            urls.push(props.url + '/med_worker/update/' + id)
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.all(urls.map(url => axios.get(url)))
            .then((responses) => setMemAr(responses));
    }, [tableData])

    useEffect(() => {
        const arr = []
        for (var cur of tableData) {
            const names = []
            const jobs = []
            for (let cur2 of cur.doctorName) {
                for (let cur3 of memAr) {
                    if (cur2 === cur3.data.id) {
                        names.push(cur3.data.last_name + ' ' + cur3.data.first_name + " " + cur3.data.fathers_name)
                        jobs.push((cur3.data.med_organization === null || cur3.data.med_organization === ""? "Место работы не указано": cur3.data.med_organization)+ ', ' + (cur3.data.job === null || cur3.data.job === ""? "должность не указана": cur3.data.job  ))
                    }
                }
            }
            //console.log(names, jobs)

            if (names.length !== 0) {
                while (cur.doctorName.length !== 0) {
                    cur.doctorName.pop()
                }

            }
            if (jobs.length !== 0) {
                while (cur.medOrganization.length !== 0) {
                    cur.medOrganization.pop()
                }
            }
            var index = 0
            for (let tmp1 of names) {
                cur.doctorName.push(tmp1)
                cur.medOrganization.push(jobs[index])
                index += 1
            }
            arr.push(cur)
        }
        //console.log(arr)
        setData(arr)
    }, [memAr])



    const handlePrev = () => {
        newPage(previous)

    }

    const handleNext = () => {
        newPage(next)
    }

    function newPage(url) {
        const tmpAr = []
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/inner_mail/notifications/all/" + localStorage.getItem('id') + "/?status=0").then((response) => {
            for (let cur of response.data.results) {
                if (!groupsUnread.has(cur.mail.id)) {
                    groupsUnread.add(cur.mail.id)
                }
            }
            return groupsUnread
        }).then((ret) => {
            var url = new URL(arguments[0])
            axios.get(props.url + url.pathname.replaceAll('api/v3/', '') + '?' + url.searchParams).then((response) => {
                setNext(response.data.next)
                setPrevious(response.data.previous)
                for (let cur of response.data.results) {
                    if (ret.has(cur.id)) {
                        tmpAr.push(createData(cur.id, cur.members, [], cur.title, cur.uzi_patient_card, 0, new Date(Date.parse(cur.create_date))))
                        cur.members.map((tmp) => members.add(tmp))
                    } else {
                        tmpAr.push(createData(cur.id, cur.members, [], cur.title, cur.uzi_patient_card, 1, new Date(Date.parse(cur.create_date))))
                        cur.members.map((tmp) =>
                            members.add(tmp)
                        )
                    }
                }
            }).then(() => setTableData(tmpAr)).finally(() => {})
        })
    }
    const text1 = {
        fontSize: 12, fontWeight: 'lighter', color: 'dimgray'
    }
    const text2 = {
        fontSize: 15, fontWeight: 'normal', whiteSpace: 'break-spaces',
    }
    const text3 = {
        fontSize: 18, fontWeight: 'bold', color: 'slategrey'
    }
    const text4 = {
        fontSize: 10, fontWeight: 'lighter'
    }

    return (
        <div>
            {data.map((text, index) => (
                <List key={index}
                      sx={{
                          width: '90%',
                          bgcolor: 'background.paper',
                          justifyContent: 'center',
                          alignContent: 'center',
                          justifyItems: 'center'
                      }}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                >
                    <Badge className={'second-step'} anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                           badgeContent={'Новое'} sx={{
                        marginLeft: 2, marginTop: 3, "& .MuiBadge-badge": {
                            color: "white",
                            backgroundColor: "#4FB3EAFF"
                        }
                    }} invisible={text.status === 1}>
                        <Box component={""} sx={{
                            paddingBottom: 3,
                            justifyItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center'
                        }} justifyContent={'center'} alignContent={'center'}>
                            <ListItemText primaryTypographyProps={{ style: text3 }} primary={text.title} secondaryTypographyProps={{style: text4}} secondary={text.date}
                                          sx={{color: '#000000', paddingLeft: 2}}/>
                            <ListItem>
                                <ListItemText primaryTypographyProps={{ style: text1 }} primary={'Специалисты'} secondaryTypographyProps={{style: text2}}
                                              secondary={text.doctorName.map((name) => name+'\n')} sx={{color: '#000000', width: 350}}/>
                                <ListItemText primaryTypographyProps={{ style: text1 }} primary={'Медицинская организация'} secondaryTypographyProps={{style: text2}}
                                              secondary={text.medOrganization.map((name) => name+'\n')} sx={{color: '#000000', width: 350}}/>
                                <Box  sx={{paddingLeft: 15}}>
                                    <Button className={'third-step'} variant={'outlined'}
                                            sx={{borderRadius: 1, color: '#2292cb', textAlign: 'start', marginLeft: 5}}
                                            component={Link} to={`/inbox/msg/` + text.id}>
                                        <KeyboardArrowRightIcon/> Обсуждение
                                    </Button>
                                </Box>
                            </ListItem>
                        </Box>
                    </Badge>
                    <Divider/>
                </List>
            ))
            }
            <Box component={""} sx={{width: '100%'}} alignContent={'center'} justifyContent={'center'} display={'flex'}>
                <Button sx={{borderRadius: 1, color: '#2292cb', backgroundColor: 'white', alignContent: 'center'}}
                        disabled={previous === '' || previous === null} onClick={handlePrev}>
                    <KeyboardArrowLeftIcon/>
                </Button>
                <Button sx={{borderRadius: 1, color: '#2292cb', backgroundColor: 'white', alignContent: 'center'}}
                        disabled={next === '' || next === null} onClick={handleNext}>
                    <KeyboardArrowRightIcon/>
                </Button>
            </Box>
        </div>
    )

}

const NotificationsPageInterface = (props) => {
    const {number} = useParams();
    return (
        <NotificationsPage props={number} url={props.url}></NotificationsPage>

    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class NotificationsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uziDate: new Date(),
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            massage: "",
            patientId: 0,
            docAr: [],
            noduleType: 5,
            mode: true
        };
    }

    handleResponse = () => {
        this.setState({
            openSuccess: true,
        })
        console.log(this.state.openSuccess)
        this.handleExport()
    };


    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            openSuccess: false,
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
                    <GlobalStyles styles={

                        {
                            h1: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto", fontWeight: 'normal'}, h2: {
                                color: 'dimgray',
                                fontSize: 20,
                                fontFamily: "Roboto",
                                whiteSpace: 'normal',
                                marginBlockStart: 0,
                                marginBlockEnd: 0,
                                marginInlineEnd: 5
                            }, h5: {
                                color: 'dimgray',
                                fontSize: 20,
                                fontFamily: "Roboto",
                                fontWeight: 'lighter',
                                whiteSpace: 'normal',
                                marginBlockStart: 0,
                                marginBlockEnd: 0,
                            }
                        }}/>
                    <MyGrid url={this.props.url}/>

                    <Box component={""} sx={{width: 500, paddingBottom: 3}} display={'flex'}>
                    </Box>
                </Box>
            </FormControl>
        )

    }
}

export default NotificationsPageInterface;