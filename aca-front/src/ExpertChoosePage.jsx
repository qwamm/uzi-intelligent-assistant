import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Button,
    createTheme,
    IconButton, Slide,
} from "@mui/material";
import {FormControl} from "@mui/material";
import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";
import 'dayjs/locale/ru';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from "axios";
import {Link, useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";

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
function createData(id,  doctorName, medOrganization, expertDetails) {
    return {id: id, doctorName: doctorName, medOrganization: medOrganization === null? "Место работы не указано": medOrganization, expertDetails: expertDetails === "" ? "Экспертный опыт не указан": expertDetails};
}
const paginationComponentOptions = {
    rowsPerPageText: 'Строк на странице',
    rangeSeparatorText: 'из',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Все',
};
const MyGrid = (props) => {
    var [tableData, setTableData] = useState([])
    const columns = [ {
        name: 'ФИО специалиста', selector: row => row.doctorName, width: '300px', sortable:true, wrap: true
    }, {name: 'Медицинская организация', selector: row => row.medOrganization, width: '300px', sortable:true, wrap: true}, {
        name: 'Об эксперте', selector: row => row.expertDetails, width: '220px', sortable:true, wrap: true
    }];

    useEffect(() => {
        const tmpAr = []
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + "/med_worker/list/").then((response) => {
            for (let cur of response.data.results){
                tmpAr.push(createData(cur.id, cur.last_name + " " + cur.first_name + " " + cur.fathers_name, (cur.med_organization === null || cur.med_organization === "" ?"Место работы не указано":cur.med_organization) + ", " + (cur.job === null?"должность не указана":cur.job), cur.expert_details))
            }
        })
            .then(() => setTableData(tmpAr))

    }, [props.url])

    const handleRows = (event) => {
        while (props.selected.length !== 0){
            props.selected.pop()
        }
        for (let cur of event.selectedRows) {
            props.selected.push(cur.id.toString())
        }
    }

    return (
        <div>
            <DataTable className={'fourth-step'}
                       data={tableData}
                       columns={columns} pagination defaultSortFieldId={1} onSelectedRowsChange={handleRows}
                       selectableRows paginationComponentOptions={paginationComponentOptions}
            />
        </div>)
}
const ExpertPageInterface = (props) => {
    const {number} = useParams();
    return (

        <ExpertPage props={number} url={props.url}></ExpertPage>

    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class ExpertPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uziDate: new Date(),
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            massage: "",
            patientId: 0,
            docAr:[],
            noduleType: 5,
            title: "",
            tiradsType: 5
        };

    }
    componentDidMount() {
        this.handleStartPage();
    }

    handleResponse = () => {
        this.setState({
            openSuccess: true,
        })
    };
    handleMassage = (event) => {
        this.setState({
            massage: event.target.value
        })
    }
    handleTitle = (event) => {
        this.setState({
            title: event.target.value
        })
    }

    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+"/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                console.log(response.data.info.patient.id)
                this.setState({
                    patientLastName: response.data.info.patient.last_name,
                    patientFirstName: response.data.info.patient.first_name,
                    patientFathersName: response.data.info.patient.fathers_name,
                    uziDate: new Date(response.data.info.acceptance_datetime),
                    patientId: response.data.info.patient.id,
                    tiradsType: response.data.info.nodule_type
                })
            })


    }

    handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        const formData = new FormData();
        formData.append("mail.details.msg", this.state.massage);
        formData.append("mail.details.nodule_type", this.state.tiradsType);
        formData.append("mail.details.mail_type", 0);
        formData.append("mail.notification_group.members", this.state.docAr.toString());
        formData.append("mail.notification_group.title", this.state.title);
        formData.append("mail.notification_group.uzi_patient_card", this.state.patientId);
        axios.post(this.props.url+"/inner_mail/notifications/create/", formData).then(() => {
        })
        this.handleResponse()

    };
    handleChooseTirads = (event) => {
        this.setState({
            tiradsType: event.target.value,
        });
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
                    <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995'}} onClose={this.handleClose}>Отправлено!</Alert>
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
                    <Box component={""} display={'flex'}>
                        <IconButton component={Link} to={`/patient/`+this.state.patientId}>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                        <h1>Отправка эксперту</h1>
                    </Box>
                    <Box component={""} display={'flex'}>
                        <GlobalStyles styles={

                            {  h1: {color: 'dimgray', fontSize: 25, fontFamily: "Roboto", fontWeight: 'normal'}, h2: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", whiteSpace:'normal', marginBlockStart: 0,
                                    marginBlockEnd:0,
                                    marginInlineEnd:5, fontWeight: 'normal'}, h5: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", fontWeight:'lighter', whiteSpace:'normal', marginBlockStart: 0,
                                    marginBlockEnd:0,}}}/>

                        <h2>Пациент: </h2>
                        <h5>{this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h5>
                    </Box>
                    <Box component={""} display={'flex'} sx={{paddingBottom:3}}>
                        <GlobalStyles styles={
                            {  h3: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", whiteSpace:'normal', marginBlockStart: 0,
                                    marginBlockEnd:0,
                                    marginInlineEnd:5, fontWeight: 'normal'}, h5: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", fontWeight:'lighter', whiteSpace:'normal', marginBlockStart: 0,
                                    marginBlockEnd:0,}}}/>
                        <h3>Диагностика от: </h3>
                        <h5>{this.state.uziDate.toLocaleDateString()}</h5>
                    </Box>
                    <FormControl className={'second-step'} sx={{ width: '95%', paddingBottom: 3}}>
                        <TextFieldResult
                            multiline
                            value={this.state.title}
                            label="Тема"
                            onChange={this.handleTitle}
                            variant='outlined'
                            inputProps={{
                                style: {
                                    width: 'auto',
                                    borderRadius: 3
                                }
                            }}
                            InputLabelProps={{shrink: true}}

                        >
                        </TextFieldResult>
                    </FormControl>
                    <FormControl className={'third-step'} sx={{ width: '95%', paddingBottom: 3}}>
                        <TextFieldResult
                            multiline
                            value={this.state.massage}
                            label="Комментарий"
                            onChange={this.handleMassage}
                            variant='outlined'
                            inputProps={{
                                style: {
                                    width: 'auto',
                                    height: 100,
                                    borderRadius: 3
                                }
                            }}
                            InputLabelProps={{shrink: true}}

                        >
                        </TextFieldResult>
                    </FormControl>
                    <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 3}}>
                        <FormControl className={'third-half-step'} variant={'outlined'} fullWidth>
                            <TextFieldResult
                                value={this.state.tiradsType}
                                label="Тип узла по EU TI-RADS"
                                onChange={this.handleChooseTirads}
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
                    <MyGrid url={this.props.url} selected={this.state.docAr}></MyGrid>
                    <Box component={""} sx={{width: 500, paddingBottom: 3}}>
                        <FormControl className={'fifth-step'}>
                            <Button
                                sx={{
                                    color: '#4fb3ea',
                                    '&:focus': {backgroundColor: '#4fb3ea'},
                                    fontFamily: 'Roboto'
                                }} variant={'outlined'} onClick={this.handleExport}>
                                Отправить
                            </Button>
                        </FormControl>
                    </Box>
                </Box>
            </FormControl>
        )

    }
}

export default ExpertPageInterface;