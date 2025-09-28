import * as React from 'react';
import DataTable from 'react-data-table-component';

import {Button, Chip, FormControl, IconButton,} from "@mui/material";

import {Box} from "@mui/material";


import {Link, useParams} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import BasicMenu from "./MenuButton";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";


const PatientInterface = (props) => {
    const {number} = useParams();
    return (

        <ShotTable props={number} url={props.url}></ShotTable>

    )
}
const paginationComponentOptions = {
    rowsPerPageText: 'Строк на странице',
    rangeSeparatorText: 'из',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Все',
};

function createData(id,  uziDate, tiradsType, uziVolume, uziDevice, projectionType, types) {
    var type = 1
    var volume = 1
    if(tiradsType.length === undefined){
        type = tiradsType.nodule_type
        volume = Number(0.479 * tiradsType.nodule_height * tiradsType.nodule_length * tiradsType.nodule_width).toFixed(3)
    }
    else{
        type = new Set()
        volume = []
        for(let item of tiradsType){
            type.add(item.nodule_type)
            volume.push(Number(0.479 * item.nodule_height * item.nodule_length * item.nodule_width).toFixed(3) )
        }
    }
    return {id: id, uziDate: uziDate.toLocaleDateString(), tiradsType: Array.from(type).toString().replaceAll(",", ', '), uziAm: uziVolume.toString(), uziVolume: volume.toString().replaceAll(",", ', '),uziDevice: uziDevice === null? "": uziDevice.toString(), projectionType: projectionType.toString()};
}


const MyGrid = (props) => {
    var [tableData, setTableData] = useState([])

    const sortDate = (a, b) =>{
        //console.log(a)
        const splited_a = a.uziDate.split('.')
        const splited_b = b.uziDate.split('.')
        if(splited_a[2] > splited_b[2]){
            return 1;
        }
        if(splited_b[2] > splited_a[2]){
            return -1;
        }
        if(splited_b[2] === splited_a[2]){
            if(splited_a[1] > splited_b[1]){
                return 1;
            }
            if(splited_b[1] > splited_a[1]){
                return -1;
            }
            if(splited_b[1] === splited_a[1]){
                if(splited_a[0] > splited_b[0]){
                    return 1;
                }
                if(splited_b[0] > splited_a[0]){
                    return -1;
                }
                if(splited_b[0] === splited_a[0]){
                    return 0;
                }
            }
        }

    }
    const columns = [ { name: 'Дата приема', selector: row => row.uziDate, width: '200px', sortable:true, sortFunction: sortDate}, {
        name: 'Тип узла \n по EU TI-RADS', selector: row => row.tiradsType, width: '200px', sortable:true
    }, {
        name: 'Количество узлов', selector: row => row.uziAm, width: '180px', sortable:true
    },{
        name: 'Объем узлов', selector: row => row.uziVolume, width: '180px', sortable:true
    },
        {name: 'Аппарат', selector: row => row.uziDevice, width: '180px', sortable:true}, {
            name: 'Тип проекции', selector: row => row.projectionType, width: '180px', sortable:true
        }, {
            name: '',
            cell: (row) => renderDetailsButton(row.id), width: '180px'
        }, {
            key: 'button_delete',
            name: '',
            cell: (row) => renderDeleteButton(row.id),
        },];
    const renderDetailsButton = (params) => {
        return (<strong>
            <Button className={'sixth-step'}
                    component={Link}
                    to={'/result/' + params}
                    variant="outlined"
                    size={'small'}
                    style={{marginLeft: 16, color: '#4FB3EAFF'}}
            >
                Результат
            </Button>
        </strong>)
    }
    const renderDeleteButton = (params) => {
        return (<strong className={'eighth-step'}>
            <BasicMenu props={params} rows={tableData} set={setTableData}/>
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
        axios.get(props.url + "/patient/shots/"+ props.number + "/?format=json").then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.shots) {
                if(cur.id !== null) {
                    var nodulesAmount = 0
                    if (cur.details.ai_info.length === cur.details.ai_info.filter((node) => node.is_ai === true).length){
                        nodulesAmount = cur.details.ai_info.length
                    }
                    else{
                        nodulesAmount = cur.details.ai_info.filter((node) => node.is_ai === false).length
                    }
                    tmpAr.push(createData(cur.id, new Date(Date.parse(cur.diagnos_date)), cur.details.ai_info, cur.details.ai_info.length === undefined? 1: nodulesAmount, cur.uzi_device, cur.details.projection_type === "long" ? "Продольная" : "Поперечная"))
                }
            }
        })
            .then(() => setTableData(tmpAr))
        // 0.479 * cur.left_depth * cur.left_length * cur.left_width + 0.479 * cur.right_depth * cur.right_length * cur.right_width

    }, [props.url])

    return (
        <div className={'fourth-step'}>
            <DataTable className={'third-step'}
                       data={tableData}
                       columns={columns} pagination defaultSortFieldId={1} paginationComponentOptions={paginationComponentOptions}
            />
        </div>)
}

class ShotTable extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            lastName: "",
            firstName: "",
            fathersName: "",
            policy: "",
            email: "",
            isActive: "",
            diagnosis: "",
            doctor: "",
            spetialicy: '',
            docEmail: "",
            filterText:''
        }
        //this.handlePatient()
    }
    componentDidMount() {
        this.handlePatient()
    }

    handleFilterText = (e) => {
        this.setState({
            filterText: e
        })
    }
    handlePatient = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/patient/shots/"+ this.props.props + "?format=json").then((response) => {
            console.log(response)
            this.setState({
                lastName: response.data.results.patient.last_name,
                firstName: response.data.results.patient.first_name,
                fathersName: response.data.results.patient.fathers_name,
                policy: response.data.results.patient.personal_policy,
                email: response.data.results.patient.email,
                isActive: response.data.results.patient.is_active? 'Активен': "Не активен",
                //diagnosis: response.data.card.diagnosis
            })
        })
    }
    render() {
        return (
            <FormControl fullWidth sx={{height: '100%', width: '100%'}}>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 5,
                    paddingTop: 10,
                    borderTopLeftRadius: 130,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },

                }} display={'column'}>
                    <Chip
                        style={{marginLeft: 16, borderColor: this.state.isActive === 'Активен' ? '#4FB3EAFF': '#a6bac4'}}
                        label={this.state.isActive}
                        sx={{color: this.state.isActive === 'Активен'? '#4FB3EAFF': '#a6bac4'}}
                        variant={'outlined'}
                    >
                    </Chip>
                    <GlobalStyles styles={{
                        h1: {color: 'dimgray', fontSize: 30, fontFamily: "Roboto", fontWeight: 'normal'},
                        h2: {color: 'dimgray', fontSize: 20, fontFamily: "Roboto", marginBlock:0, fontWeight: 'normal'},
                        h3: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'lighter', marginBlock:-1},
                        h4: {color: 'dimgray', fontSize: 15, fontFamily: "Roboto", fontWeight:'lighter', marginBlock:0,}
                    }}/>
                    <Grid className={'first-step'} component={""} container direction={'column'} sx={{paddingLeft: 2, paddingTop: 2}}>
                        <Grid component={""} item container direction={'row'}>
                            <h2>{this.state.lastName+" "+this.state.firstName+" "+this.state.fathersName}</h2>
                            <IconButton component={Link} to={`/patient/edit/${this.props.props}`} style={{maxWidth: '20px', maxHeight: '20px'}}
                                        sx={{
                                            paddingLeft: 3, '& svg': {
                                                fontSize: 20
                                            },
                                        }}>
                                <EditIcon className={'second-step'}/>
                            </IconButton>
                        </Grid>
                        <Grid component={""} item container direction={'row'}>
                            <h3>{this.state.policy} ~ {this.state.email}</h3>
                        </Grid>
                        {/*<Grid component={""} item container direction={'row'}>*/}
                        {/*    <h4><b style={{fontWeight: 'normal'}}>Диагноз:</b> { this.state.diagnosis}</h4>*/}
                        {/*</Grid>*/}
                        <Grid component={""} item container direction={'row'}>
                            <Box component={""} display={'flex'}>
                                <h1>Снимки</h1>
                                <IconButton component={Link} to={`/home`}  style={{maxWidth: '30px', maxHeight: '30px'}}
                                            sx={{
                                                paddingLeft: 3, paddingTop: 5, '& svg': {
                                                    fontSize: 30
                                                },
                                            }}>
                                    <AddCircleOutlineIcon className={'seventh-step'}></AddCircleOutlineIcon>
                                </IconButton>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>

                <Box component={""} sx={{
                    minHeight:470, height: 'auto',
                    backgroundColor: '#ffffff', paddingLeft: 5, paddingTop: 1, paddingBottom: 10,

                }}>
                    <MyGrid url={this.props.url} number={this.props.props}/>
                </Box>
            </FormControl>)
    }

}

export default PatientInterface;