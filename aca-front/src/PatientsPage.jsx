import * as React from 'react';
import '@fontsource/poppins/700.css'

import { Button, Chip, FormControl, IconButton, Paper, TextField} from "@mui/material";
import {Box} from "@mui/material";
import DataTable from 'react-data-table-component';

import ClearIcon from '@mui/icons-material/Clear';
import {Link} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";

function createData(id, patientName, patientPolicy, email, uziDate, hasNodules, isActive) {
    return {id: id, patientName: patientName,patientPolicy: patientPolicy, email: email,uziDate: uziDate.toLocaleDateString(),hasNodules: hasNodules,isActive: isActive};
}

const FilterComponent = (props) => (
    <Paper className={'sixth-step'} elevation={0} sx={{justifyContent: 'center', alignContent:'center', alignItems: 'center', justifyItems: 'center', display: 'flex'}}>
        <TextField
            id="search"
            type="text"
            placeholder="Поиск по имени или номеру полиса"
            aria-label="Search Input"
            value={props.filterText}
            onChange={(e) => props.onFilter(e.target.value)}
            sx={{paddingLeft: 5,width:350, borderColor: '#4FB3EAFF',"& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                        borderColor: '#4FB3EAFF'
                    }
                }, 'fieldset':{borderRadius: 5}}} style={{borderRadius: '10 px'}}

        />
        <IconButton onClick={() => props.onFilter("")}> <ClearIcon>
        </ClearIcon>
        </IconButton>
    </Paper>
);
const paginationComponentOptions = {
    rowsPerPageText: 'Строк на странице',
    rangeSeparatorText: 'из',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Все',
};
const MyGrid = (props) => {
    var [tableData, setTableData] = useState([])
    var filteredItems = tableData.filter(item => ((item.patientName && item.patientName.toLowerCase().includes(props.filterText.toLowerCase())) || (item.patientPolicy && item.patientPolicy.toLowerCase().includes(props.filterText.toLowerCase()))), );
    const columns = [{name: 'Пациент', width: '230px', sortable: true, selector: row => row.patientName}, {
        name: 'Полис пациента',
        width: '210px',sortable: true, selector: row => row.patientPolicy
    }, {
        name: 'Эл. почта', width: '230px',sortable: true, selector: row => row.email
    },
        {name: 'Дата приема', width: '130px', sortable: true, selector: row => row.uziDate},
        {
            name: 'Диагноз', width: '160px', cell: (row) => renderChip2(row.hasNodules),
        },
        {
            name: 'Статус', width: '160px', sortable: false, cell: (row) => renderChip(row.isActive),
        },
        {
            name: '',
            width: '190px',
            sortable: false,
            cell: (row) => renderDetailsButton(row.id),
            disableColumnMenu: true,
        },
        //     {
        //     name: '',
        //     width: '30px',
        //     sortable: false,
        //     cell: (row) => renderDeleteButton(row.id),
        //     disableColumnMenu: true,
        // },
    ];
    const renderDetailsButton = (params) => {
        return (<strong>
            <Button className={'seventh-step'}
                    component={Link}
                    to={'/patient/' + params}
                    variant="outlined"
                    size={'small'}
                    style={{marginLeft: 16,width: 100, color: '#4FB3EAFF'}}
            >
                Карта
            </Button>
        </strong>)
    }
    const renderChip = (params) => {
        return (<strong>
            <Chip className={'fourth-step'}
                  size={'small'}
                  style={{marginLeft: 16, borderColor: params? '#4FB3EAFF': '#a6bac4'}}
                  label={params ? "Активен" : "Не активен"}
                  sx={{color: params? '#4FB3EAFF': '#a6bac4'}}
                  variant={'outlined'}
            >
            </Chip>
        </strong>)
    }
    const renderChip2 = (params) => {
        return (<strong>
            <Chip className={'fifth-step'}
                  size={'small'}
                  style={{marginLeft: 16, borderColor: params? '#4FB3EAFF': '#a6bac4'}}
                  label={params ? "Обнаружено" : "Не Обнаружено"}
                  sx={{color: params? '#4FB3EAFF': '#a6bac4'}}
                  variant={'outlined'}
            >
            </Chip>
        </strong>)
    }


    useEffect(() => {
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        storedNames.reverse()
        var tmpAr = [];
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + '/med_worker/patients/'+localStorage.getItem('id')).then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.cards) {
                tmpAr.push(createData(cur.patient.id, cur.patient.last_name + " " + cur.patient.first_name + " " + cur.patient.fathers_name, cur.patient.personal_policy, cur.patient.email,  new Date(Date.parse(cur.acceptance_datetime)), cur.has_nodules === "T", cur.patient.is_active))
            }
        })
            .then(() => setTableData(tmpAr))

    }, [props.url])

    return (<div style={{width:'100%'}}>
        <DataTable className={'third-step'}
                   columns={columns}
                   data={filteredItems}
                   pagination
                   persistTableHead
                   paginationComponentOptions={paginationComponentOptions}
        />
    </div>)
}

class PatientTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: "",
            lastName: "",
            firstName: "",
            fathersName:'',
            medOrg: "",
            is_remote_worker: true,
            job: "",
            mesAm: 0
        };
        //this.handleInformation()
    }
    componentDidMount() {
        this.handleInformation()
    }

    handleInformation = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + '/med_worker/patients/'+localStorage.getItem('id'))
            .then((response) => {
                    this.setState({
                        lastName: response.data.results.med_worker.last_name,
                        firstName: response.data.results.med_worker.first_name,
                        fathersName:response.data.results.med_worker.fathers_name,
                        medOrg: response.data.results.med_worker.med_organization === null || response.data.results.med_worker.med_organization === ""? "Место работы не указано":response.data.results.med_worker.med_organization,
                        is_remote_worker: response.data.results.med_worker.is_remote_worker,
                        job: response.data.results.med_worker.job === null || response.data.results.med_worker.job === ""? "должность не указана": response.data.results.med_worker.job,
                    })
                    axios.get(this.props.url+'/inner_mail/notifications/all/'+ localStorage.getItem('id')+'/?status=0').then((response) => {
                        this.setState({
                            mesAm: response.data.count
                        })
                        //console.log(response.data)
                    })
                }
            )
    }
    handleFilterText = (e) => {
        this.setState({
            filterText: e
        })
    }
    render() {
        return (<FormControl sx={{height: '100%', width: '100%'}}>
            <Box component={""} sx={{
                backgroundColor: '#ffffff',
                paddingLeft: 5,
                paddingTop: 10,
                borderTopLeftRadius: 130,
                '&:hover': {
                    backgroundColor: "#ffffff",
                },

            }}>
                <GlobalStyles styles={{
                    h1: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", fontWeight: 'normal'},
                    h2: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", marginBlock:0, fontWeight: 'normal'},
                    h5: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto",fontWeight:'lighter',marginBlock:5},
                    h3: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'normal', marginBlock:-1},
                    h4: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'normal', marginBlock:5, marginInline:4}
                }}/>
                <Box className={'first-step'} component={""}>
                    <Grid component={""} container direction={'column'} sx={{paddingLeft: 2}}>
                        <Grid component={""} item container direction={'row'}>
                            <h2>{this.state.lastName+" "+this.state.firstName+" "+this.state.fathersName}</h2>
                            <IconButton  component={Link} to={`/profile/edit/`} style={{maxWidth: '20px', maxHeight: '20px'}}
                                         sx={{
                                             paddingLeft: 3, '& svg': {
                                                 fontSize: 20
                                             },
                                         }}>
                                <EditIcon className={'second-step'}/>
                            </IconButton>
                        </Grid>
                        <Grid component={""} item container direction={'row'}>
                            <h5>Медицинская организация:</h5>
                            <h4>{ this.state.medOrg}, {this.state.job}</h4>
                        </Grid>
                    </Grid>
                </Box>
                <Box component={""} sx={{paddingLeft: 2}} display={'flex'}>
                    <h1>Мои пациенты</h1>
                    <IconButton  component={Link} to={`/patient/create`}  style={{maxWidth: '30px', maxHeight: '30px'}}
                                 sx={{
                                     paddingLeft: 3, paddingTop: 5, '& svg': {
                                         fontSize: 30
                                     },
                                 }}>
                        <AddCircleOutlineIcon className={'eighth-step'}></AddCircleOutlineIcon>
                    </IconButton>
                    <FilterComponent filterText={this.state.filterText} onFilter={this.handleFilterText}/>
                </Box>
            </Box>
            <Box component={""} sx={{
                minHeight:470, height: 'auto',
                backgroundColor: '#ffffff', paddingLeft: 5, paddingTop: 1, paddingBottom: 10,

            }} display={'flow'}>

                <MyGrid url={this.props.url} filterText={this.state.filterText}/>
            </Box>
        </FormControl>)
    }

}

export default PatientTable;