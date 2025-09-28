import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    Badge,
    Button, Card, Collapse,
    IconButton,Slide,
} from "@mui/material";
import {FormControl} from "@mui/material";
import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField,
    ListItemText,} from "@mui/material";
import {styled} from "@mui/material";
import 'dayjs/locale/ru';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from "axios";
import { Link, useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {useEffect, useState} from "react";

import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const TextFieldResult = styled(TextField)`
  fieldset {
    border-radius: 10px;
    border-color: #4FB3EAFF;
    border-width: 1px;

  }

,
'& label': marginLeft: "100%",
`;


function createData(id,  doctorName, medOrganization, is_remote, msg, noduleType, user, status, date) {
    return {id: id, doctorName: doctorName, medOrganization: medOrganization, is_remote: is_remote, msg: msg, noduleType: noduleType, user:user, status: status, date: date.toLocaleDateString()};
}
const MyGrid = (props) => {
    const [tableData, setTableData] = useState([])
    const [massage, setMassage] = useState("")
    const [tiradsType, setTiradsType] = useState(1)
    const [data, setData] = useState([])
    const [reload, setReload] = useState(true)
    const [next, setNext] = useState("")
    var [groupsUnread, setGroups] = useState(new Set([]))

    useEffect(() => {
        const tmpAr = new Set([])
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/inner_mail/notifications/all/" + localStorage.getItem('id') + "/?status=0").then((response) => {
            localStorage.setItem('mesAm', response.data.count)
            for (let cur of response.data.results) {
                tmpAr.add(cur.mail.id)
            }
            return groupsUnread
        }).then(() => setGroups(tmpAr))
    }, [props.url])

    useEffect(() => {
        const tmpAr = []
        const unread=[]
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/inner_mail/notifications/group/"+props.number+'/?limit=5').then((response) => {
                setNext(response.data.next)
                for (let cur of response.data.results) {
                    if (cur.notification_author.id === parseInt(localStorage.getItem('id'))) {
                        tmpAr.push(createData(cur.id, cur.notification_author.last_name + ' ' +cur.notification_author.first_name + " " + cur.notification_author.fathers_name, (cur.notification_author.med_organization=== null || cur.notification_author.med_organization === "" ? 'Место работы не указано' : cur.notification_author.med_organization)+ ', ' + (cur.notification_author.job === null || cur.notification_author.job==="" ? "должность не указана" : cur.notification_author.job),  cur.notification_author.is_remote_worker, cur.details.msg, cur.details.nodule_type, true, false, new Date(Date.parse(cur.create_date))))
                    } else {
                        if (groupsUnread.has(cur.id)) {
                            tmpAr.push(createData(cur.id, cur.notification_author.last_name + ' ' + cur.notification_author.first_name + " " + cur.notification_author.fathers_name, (cur.notification_author.med_organization=== null || cur.notification_author.med_organization === "" ? 'Место работы не указано' : cur.notification_author.med_organization)+ ', ' + (cur.notification_author.job === null || cur.notification_author.job==="" ? "должность не указана" : cur.notification_author.job), cur.notification_author.is_remote_worker, cur.details.msg, cur.details.nodule_type, false, true, new Date(Date.parse(cur.create_date))))
                        }
                        else{
                            tmpAr.push(createData(cur.id, cur.notification_author.last_name + ' ' +cur.notification_author.first_name + " " + cur.notification_author.fathers_name, (cur.notification_author.med_organization=== null || cur.notification_author.med_organization === "" ? 'Место работы не указано' : cur.notification_author.med_organization)+ ', ' + (cur.notification_author.job === null || cur.notification_author.job==="" ? "должность не указана" : cur.notification_author.job),  cur.notification_author.is_remote_worker, cur.details.msg, cur.details.nodule_type, false, false, new Date(Date.parse(cur.create_date))))
                        }
                    }
                    if (groupsUnread.has(parseInt(cur.id))) {
                        unread.push(cur.id)
                    }
                }
            }
        ).then(() => setTableData(tmpAr)).then(() => {
            const formData = {}
            formData.mail = unread
            formData.user = parseInt(localStorage.getItem('id'))
            if(unread.length !== 0){
                axios.post(props.url + "/inner_mail/notifications/mark/viewed/", formData).then(() => {})
            }
        })

    }, [props.number, groupsUnread,props.url, reload])



    useEffect(() => {
        setData(tableData)
    }, [tableData])

    const handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        if (props.is_expert){
            const formData = new FormData();
            formData.append("msg", massage);
            formData.append("nodule_type", tiradsType.toString());
            axios.post(props.url+"/inner_mail/mail/create/expert/", formData).then((response) => {
                const formData = new FormData();
                formData.append("notification_group", props.number);
                formData.append("notification_author", localStorage.getItem('id'));
                formData.append("details", response.data.id);
                axios.post(props.url+"/inner_mail/notifications/reply/", formData).then(() => {
                    setReload(!reload)
                    setMassage("")
                })
            })
        }
        else{
            const formData = new FormData();
            formData.append("msg", massage);
            axios.post(props.url+"/inner_mail/mail/create/simple/", formData).then((response) => {
                const formData = new FormData();
                formData.append("notification_group",props.number);
                formData.append("notification_author", localStorage.getItem('id'));
                formData.append("details", response.data.id);
                axios.post(props.url+"/inner_mail/notifications/reply/", formData).then(() => {
                    setReload(!reload)
                    setMassage("")
                })
            })
        }

    };
    const handleMassage = (event) => {
        setMassage(event.target.value)
    }
    const handleChooseTirads = (event) => {
        setTiradsType(event.target.value)
    };



    const handleNext = () => {
        const tmpAr = data
        const unread=[]
        const url = new URL(next);
        axios.get(props.url + url.pathname +'?'+ url.searchParams).then((response) => {
                setNext(response.data.next)
                for (let cur of response.data.results) {
                    if (cur.notification_author.id === parseInt(localStorage.getItem('id'))) {
                        tmpAr.push(createData(cur.id, cur.notification_author.last_name + ' ' + cur.notification_author.first_name + " " + cur.notification_author.fathers_name, (cur.notification_author.med_organization=== null || cur.notification_author.med_organization === "" ? 'Место работы не указано' : cur.notification_author.med_organization)+ ', ' + (cur.notification_author.job === null || cur.notification_author.job==="" ? "должность не указана" : cur.notification_author.job), cur.notification_author.is_remote_worker, cur.details.msg, cur.details.nodule_type, true, false, new Date(Date.parse(cur.create_date))))
                    } else {
                        if (groupsUnread.has(cur.id)) {
                            tmpAr.push(createData(cur.id, cur.notification_author.last_name + ' ' + cur.notification_author.first_name + " " + cur.notification_author.fathers_name, (cur.notification_author.med_organization=== null || cur.notification_author.med_organization === "" ? 'Место работы не указано' : cur.notification_author.med_organization)+ ', ' + (cur.notification_author.job === null || cur.notification_author.job==="" ? "должность не указана" : cur.notification_author.job), cur.notification_author.is_remote_worker, cur.details.msg, cur.details.nodule_type, false, true, new Date(Date.parse(cur.create_date))))
                        } else {
                            tmpAr.push(createData(cur.id, cur.notification_author.last_name + ' ' + cur.notification_author.first_name + " " + cur.notification_author.fathers_name, (cur.notification_author.med_organization=== null || cur.notification_author.med_organization === "" ? 'Место работы не указано' : cur.notification_author.med_organization)+ ', ' + (cur.notification_author.job === null || cur.notification_author.job==="" ? "должность не указана" : cur.notification_author.job), cur.notification_author.is_remote_worker, cur.details.msg, cur.details.nodule_type, false, false, new Date(Date.parse(cur.create_date))))
                        }
                    }
                    if (groupsUnread.has(parseInt(cur.id))) {
                        unread.push(cur.id)
                    }
                }
            }
        ).then(() => setTableData(tmpAr)).then(() => {
            const formData = {}
            formData.mail = unread
            formData.user = parseInt(localStorage.getItem('id'))
            if(unread.length !== 0) {
                axios.post(props.url + "/inner_mail/notifications/mark/viewed/", formData).then(() => {
                    axios.get(props.url + "/inner_mail/notifications/all/" + localStorage.getItem('id') + "/?status=0").then((response) => {
                        localStorage.setItem('mesAm', response.data.count)
                    })
                })

            }
        })
    }

    return (
        <div>
            <div className={'third-half-step'}  id="scrollableDiv"
                 style={{
                     height: 400,
                     overflow: 'auto',
                     display: 'flex',
                     flexDirection: 'column-reverse',
                 }}>
                <InfiniteScroll style={{display: 'flex',flexDirection: "column-reverse" }}
                                dataLength={data.length}
                                next={handleNext} inverse={true}
                                hasMore={next != null}
                                loader={<h4>Loading...</h4>}
                                scrollableTarget="scrollableDiv"
                >
                    <GlobalStyles styles={{
                        h7: {color: 'dimgray', fontSize: 12, fontFamily: "Roboto", fontWeight: 'lighter'},
                        h2: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto", fontWeight: 'lighter'},
                        h5: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto",fontWeight:'lighter'},
                        h3: {color: 'dimgray', fontSize: 12, fontFamily: "Roboto", fontWeight:'normal', marginBlock: 0},
                        h4: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'semi-bold'}
                    }}/>
                    {data.map((text) => (
                        <Box component={""} sx={{flexDirection: text.user? 'row-reverse': 'row', p:1, m:1, display: 'flex'}} >
                            <Box component={""} sx={{paddingInline: 1}}>
                                <h3>{text.doctorName}</h3>
                                <h7>{text.medOrganization}</h7>
                            </Box>
                            <Badge key={text.id} anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                                   badgeContent={'new'} sx={{
                                marginLeft: 2, marginTop:0, "& .MuiBadge-badge": {
                                    color: "white",
                                    backgroundColor: "#2292cb "
                                }
                            }} invisible={!text.status} >
                                <Card  variant={'outlined'} sx={{borderRadius: 3, backgroundColor: !text.user? 'rgba(87,194,255,0.32)':'background.paper', minWidth: 350, justifyContent: 'end'}}  >
                                    <ListItemText  primary={<h2>Тип узла: <b>{text.noduleType}</b></h2>} sx={{color: '#000000', paddingLeft:2}} />
                                    <ListItemText  primary={<h5>{text.msg}</h5>} sx={{color: '#000000', paddingLeft:2}} />
                                    <ListItemText  primary={<h2>{text.date}</h2>} sx={{color: '#000000', paddingTop: 0.5, paddingLeft:2}} />
                                </Card>
                            </Badge>
                        </Box>
                    ))}

                </InfiniteScroll>
            </div>
            <Box component={""} sx={{width: '95%', paddingBottom: 3}} alignItems={'center'} display={'flex'}>
                <FormControl sx={{width: '95%'}}>
                    <TextFieldResult
                        multiline
                        value={massage}
                        label="Сообщение"
                        onChange={handleMassage}
                        variant='outlined'
                        inputProps={{
                            style: {
                                height: 100,
                                borderRadius: 3
                            }
                        }}
                        InputLabelProps={{shrink: true}}

                    />
                </FormControl>
                <Box className={'fourth-step'} component={""} sx={{marginLeft:1}}>
                    {props.is_expert && <Box component={""} sx={{width: 'auto', borderRadius: 3, paddingBottom: 2}}>
                        <FormControl variant={'outlined'} fullWidth>
                            <TextFieldResult
                                value={tiradsType}
                                label="Тип узла по EU TI-RADS"
                                onChange={handleChooseTirads}
                                variant='outlined'
                                defaultValue={1}
                                select
                                InputLabelProps={{shrink: true}}
                            >
                                <MenuItem value={'1'}>1</MenuItem>
                                <MenuItem value={'2'}>2</MenuItem>
                                <MenuItem value={'3'}>3</MenuItem>
                                <MenuItem value={'4'}>4</MenuItem>
                                <MenuItem value={'5'}>5</MenuItem>
                            </TextFieldResult>
                        </FormControl>
                    </Box>
                    }
                    <Button variant={'text'} sx={{height: 50, borderRadius: 1, color: '#2292cb', textAlign: 'center', paddingTop: 1}} onClick={handleExport}>
                        <SendIcon sx={{paddingRight: 1}}/>   Отправить
                    </Button>
                </Box>
            </Box>
        </div>
    )

}



const ChatPageInterface = (props) => {
    const {number} = useParams();
    return (

        <ChatPage props={number} url={props.url}></ChatPage>

    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uziDate: new Date(),
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            patientPolicy: "",
            massage: "",
            patientId: 0,
            docAr:[],
            tiradsType: 5,
            mode: true,
            info: {},
            members: [],
            shots: [],
            open: false,
            is_expert: false,
            author: 0,
            sent: true
        };
        this.handleStart()
        this.handleMembers()

    }
    handleStart = () => {
        let info={pat: 0, members: []}
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/inner_mail/notifications/groups/").then((response) => {
            for (let cur of response.data.results) {
                if (cur.id === parseInt(this.props.props)) {
                    info.pat = cur.uzi_patient_card
                    info.members = cur.members
                }
            }
            return info;
        }).then((ret)=> {
                this.setState({
                    members: ret.members,
                    patientId: ret.pat,
                })
                const tmpAr = []
                axios.get(this.props.url + "/patient/shots/" + ret.pat).then((response) => {
                    this.setState({
                        patientLastName: response.data.results.patient.last_name,
                        patientFirstName: response.data.results.patient.first_name,
                        patientFathersName: response.data.results.patient.fathers_name,
                        patientPolicy: response.data.results.patient.personal_policy,
                    })
                    for (let cur of response.data.results.shots) {
                        var type = 1
                        if (cur.details.ai_info.length === undefined) {
                            type = cur.details.ai_info.nodule_type
                        }
                        else{
                            type = []
                            for (let item of cur.details.ai_info){
                                type.push(item.nodule_type)
                            }
                        }
                        tmpAr.push({
                            id: cur.id,
                            pr_type: cur.details.projection_type === 'long' ? 'Продольная' : "Поперечная",
                            nod_type: type.toString().replaceAll(',', ', '),
                            date: new Date(Date.parse(cur.diagnos_date)).toLocaleDateString()
                        })
                    }
                    this.setState({
                        shots: tmpAr
                    })
                })
            }
        )

    };
    handleMembers = () => {
        const urls = []
        for (let id of this.state.members){
            urls.push(this.props.url + '/med_worker/update/'+ id)
        }
        axios.all(urls.map(url => axios.get(url)))
            .then((cur3) => this.setState({
                members: cur3
            }));
        axios.get(this.props.url + '/med_worker/update/'+ localStorage.getItem('id')).then((response) => {
            this.setState({
                is_expert: response.data.is_remote_worker
            })
        })
    };


    handleResponse = () => {
        this.setState({
            openSuccess: true,
        })
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

    handleOpen = () => {
        this.setState({
            open: !this.state.open,
        });
    };

    render() {
        return (
            <FormControl sx={{height: '100%', width: '100%'}}>
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
                    <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995'}} onClose={this.handleClose}>Результат сохранен!</Alert>
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
                }}>
                    <GlobalStyles styles={

                        {  h1: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto", marginBlock: 0, fontWeight: 'normal'}, h2: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", whiteSpace:'normal', marginBlockStart: 0,
                                marginBlockEnd:0,
                                marginInlineEnd:5}, h5: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", fontWeight:'lighter', whiteSpace:'normal', marginBlockStart: 0,
                                marginBlockEnd:0,}}}/>

                    <Box component={""} display={'flex'} >
                        <IconButton component={Link} to={`/inbox`}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <Box className={'first-step'} component={""} sx={{paddingRight: 3}}>
                            <h1>{this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h1>
                            <h5>Полис: <b style={{fontWeight:'normal'}}>{this.state.patientPolicy}</b></h5>
                        </Box>
                        <Button className={'second-step'}  variant={'outlined'} sx={{width: 350, color: '#2292cb'}} onClick={this.handleOpen}>
                            Снимки
                            {!this.state.open && <KeyboardArrowDownIcon/>}
                            {this.state.open && <KeyboardArrowUpIcon/>}
                        </Button>
                    </Box>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit sx={{paddingLeft: 5, marginRight: 3,  overflowX: 'scroll'}}>
                        <Box sx={{ bgcolor: 'background.paper', display: 'inline-flex'  }}
                             component="nav">
                            {
                                this.state.shots.map((shot, index) => (
                                    <Button key={index} component={Link} to={`/result/`+shot.id} target={'_blank'} variant={'outlined'} sx={{textTransform: 'none', marginRight: 1, marginBlock: 1}}>
                                        <Box className={'third-step'} component={""}>
                                            <ListItemText  primary={<h3>Тип узла: <b>{shot.nod_type}</b></h3>} secondary={<h2>{shot.date}</h2>} sx={{color: '#000000', marginBlock:0}} />
                                            <ListItemText  secondary={<h7>Проекция: <b>{shot.pr_type}</b></h7>} sx={{color: '#000000'}} />
                                        </Box>
                                    </Button>
                                ))
                            }
                        </Box>
                    </Collapse>
                    <MyGrid url={this.props.url} number={this.props.props} reload={this.state.sent} is_expert={this.state.is_expert}/>
                </Box>
            </FormControl>
        )

    }
}

export default ChatPageInterface;