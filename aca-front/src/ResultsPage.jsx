import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Box,
    Button,
    Checkbox, Chip,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Slide, Stack,
    styled,
    TextField,
} from "@mui/material";
import 'dayjs/locale/ru';
import Grid from '@mui/material/Grid';

import axios from "axios";
import {useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Gallery from "./Gallery";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import Typography from "@mui/material/Typography";
import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from "@mui/icons-material/Clear";


const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff', display: 'flex'
    },
    russianLight: {
        fontFamily: 'Roboto-light', textOverflow: 'ellipsis', flexWrap: "wrap", paddingRight: 10, margin: 1
    },
    russianMedium: {
        fontFamily: 'Roboto-medium',  textOverflow: 'ellipsis', flexWrap: "wrap", paddingRight: 10, margin: 1
    },
    sectionTitle: {
        textAlign: 'center', margin: 0, paddingTop: 2,
    },
    sectionHeader: {
        textAlign: 'right', margin: 0, paddingTop: 5, paddingRight: 5, width: 200, alignSelf: 'flex-end',
        fontSize: 10, color: '#4fb3ea',
    },
    sectionEnd: {
        textAlign: 'left', margin: 0, paddingTop: 5, paddingLeft: 10, alignSelf: 'flex-start',
        fontSize: 10,
    },
    sectionPatient: {
        textAlign: 'left', marginBlock: 0, paddingLeft: 10, paddingRight: 10,
        fontSize: 13
    },
    sectionPatient2: {
        textAlign: 'left', marginBlock: 0, paddingLeft: 10, paddingRight: 10,
        fontSize: 13, flexDirection: 'row'
    },
    sectionInfo: {
        textAlign: 'center', marginBlock: 0, paddingTop: 1,
        fontSize: 13, color: '#4fb3ea',
    },
    sectionPolicy: {
        textAlign: 'left', marginBlock: -10, paddingLeft: 10, justifyContent: 'auto',
        fontSize: 13, flexDirection: 'row'
    },
    sectionSubTitle: {
        textAlign: 'center', margin: 0, paddingTop: 2, fontSize: 15,
    },
    sectionCont: {
        flexDirection: "row",
    },
});
Font.register({
    family: 'Roboto-light',
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});
Font.register({
    family: 'Roboto-medium',
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const MyDocument = (props) => (
    <Document language={'rus'}>
        <Page size="A4" style={styles.page}>
            <View style={styles.sectionHeader}>
                <Text style={styles.russianLight}>Результат сформирован автоматически виртуальным ассистентом</Text>
            </View>
            <View style={styles.sectionTitle}>
                <Text style={styles.russianMedium}>Результат УЗИ щитовидной железы</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Пациент: </Text>
                <Text style={styles.russianLight}>{props.patient}</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Полис: </Text>
                <Text style={styles.russianLight}>{props.policy}</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Дата приема: </Text>
                <Text style={styles.russianLight}>{props.date}   </Text>
                <Text style={styles.russianMedium}>Аппарат: </Text>
                <Text style={styles.russianLight}>{props.device}   </Text>
                <Text style={styles.russianMedium}>Проекция: </Text>
                <Text style={styles.russianLight}>{props.projection} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Контуры: </Text>
                <Text style={styles.russianLight}>{props.profile}   </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Общий объем щитовидной железы: </Text>
                <Text style={styles.russianLight}>{props.volume} см3</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Перешеек: </Text>
                <Text style={styles.russianLight}>{props.isthmus} см</Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Правая доля</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Размеры: </Text>
                <Text style={styles.russianLight}>Длина - {props.right_length} см, Ширина - {props.right_width} см, Толщина  - {props.right_depth} см, Объем - {props.right_volume} см3  </Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Левая доля</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Размеры: </Text>
                <Text style={styles.russianLight}>Длина - {props.left_length} см, Ширина - {props.left_width} см, Толщина  - {props.left_depth} см, Объем - {props.left_volume} см3  </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Васкуляризация при ЦДК: </Text>
                <Text style={styles.russianLight}>{props.cdk} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Расположение: </Text>
                <Text style={styles.russianLight}>{props.position} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Структура: </Text>
                <Text style={styles.russianLight}>{props.structure} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Эхогенность: </Text>
                <Text style={styles.russianLight}>{props.echogenicity} </Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Дополнительные данные: </Text>
                <Text style={styles.russianLight}>{props.additional_data} </Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Регионарные лимфатические узлы: </Text>
                <Text style={styles.russianLight}>{props.rln} </Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Тип новообразования по мнению ассистента: </Text>
            </View>
            <View style={styles.sectionInfo}>
                <Text style={styles.russianLight}>{props.predictedTypes}</Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Заключение</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianLight}>{props.result} </Text>
            </View>
            <View style={styles.sectionCont}>
                <View style={styles.sectionEnd}>
                    <Text style={styles.russianMedium}>Врач:</Text>
                    <Text style={styles.russianLight}>{props.doctorName} </Text>
                    <Text style={styles.russianLight}>{props.medOrg} </Text>
                </View>
                <View style={styles.sectionEnd}>
                    <Text style={styles.russianMedium}>Дата:</Text>
                    <Text style={styles.russianLight}>{new Date().toLocaleDateString()} </Text>
                </View>
                <View style={styles.sectionEnd}>
                    <Text style={styles.russianMedium}>Подпись:</Text>
                    <Text style={styles.russianLight}> </Text>
                    <Text style={styles.russianLight}>________________________ </Text>
                </View>
            </View>
        </Page>
    </Document>
);

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

function BootstrapDialogTitle(props) {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{width: 2000}}{...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}


const ResultsPageInterface = (props) => {
    const {number} = useParams();
    return (

        <ResultsPage props={number} url={props.url}></ResultsPage>

    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            segmentation: null,
            uziDevice: {id: 2, name: 'Logic'},
            projectionType: "long",
            patientCard: 1,
            uziDate: new Date(),
            tiradsType: [],
            predictedTypes: new Set([]),
            shortResult: false,
            cdk: "не измена",
            diagnosis: "",
            echogenicity: "средняя",
            isthmus: 0,
            left_depth: 0,
            left_length: 0,
            left_width: 0,
            position: "обычное",
            profile: "чёткие, ровные",
            projection_type: "long",
            result: "без динамики",
            right_depth: 0,
            right_length: 0,
            right_width: 0,
            rln: "нет",
            structure: "однородная",
            uziVolume: null,
            longResult: null,
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            patients: [],
            patientPolicy: null,
            startData: null,
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            imageChoosen: false,
            linkEditingImage: "",
            openSuccess: false,
            devices: [],
            open: false,
            left_volume: 0,
            right_volume: 0,
            volume: 0,
            additional_data: "",
            openError: false,
            doctorName: '',
            medOrg: '',
            date: new Date(),
            imageId: 1,
            nodule_amount: 0,
            checked: false,
            typesForReport:[],
            doctorTiradsType: [],
            doctorTypes: new Set([]),
            aiTypes: new Set([]),
            expanded_info: false,
            slide_template: [],
            image_count: 0
        }
        // this.handleStartPage();
        // this.handleDoctor()
    }
    componentDidMount() {
        this.handleStartPage();
        this.handleDoctor()
    }

    handleDoctor = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+ '/med_worker/update/' + localStorage.getItem('id')).then((response) => {
            //console.log(response.data)
            this.setState({
                doctorName: response.data.last_name+" "+ response.data.first_name+" "+response.data.fathers_name,
                medOrg: (response.data.med_organization === null||response.data.med_organization ===''?'Место работы не указано':response.data.med_organization) +",\n"+ (response.data.job === null||response.data.job ===''?'должность не указана':response.data.job)
            })
        })
    };
    handleResponse = () => {
        this.handleExport()
    };
    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                this.setState({startData: response.data.info})
                console.log(response.data)
                // var tmpTirads = [];
                // var secondTmpTirads = []
                // secondTmpTirads.push(parseFloat(response.data.info.details.nodule_1), parseFloat(response.data.info.details.nodule_2), parseFloat(response.data.info.details.nodule_3), parseFloat(response.data.info.details.nodule_4), parseFloat(response.data.info.details.nodule_5))
                // secondTmpTirads.sort(function (a, b) {
                //     return a - b;
                // })
                // const indexes = {1: true, 2: true, 3: true, 4: true, 5: true}
                // secondTmpTirads.reverse()
                // for (let a of secondTmpTirads) {
                //     if ((a === parseFloat(response.data.info.details.nodule_1)) && indexes[1]) {
                //         tmpTirads.push(a + '% - EU-TIRADS 1')
                //         indexes[1] = false
                //     } else if ((a === parseFloat(response.data.info.details.nodule_2)) && indexes[2]) {
                //         tmpTirads.push(a + '% - EU-TIRADS 2')
                //         indexes[2] = false
                //     } else if ((a === parseFloat(response.data.info.details.nodule_3)) && indexes[3]) {
                //         tmpTirads.push(a + '% - EU-TIRADS 3')
                //         indexes[3] = false
                //     } else if ((a === parseFloat(response.data.info.details.nodule_4)) && indexes[4]) {
                //         tmpTirads.push(a + '% - EU-TIRADS 4')
                //         indexes[4] = false
                //     } else if ((a === parseFloat(response.data.info.details.nodule_5)) && indexes[5]) {
                //         tmpTirads.push(a + '% - EU-TIRADS 5')
                //         indexes[5] = false
                //     }
                // }
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                axios.get(this.props.url + "/uzi/devices/?format=json")
                    .then((res) => {
                        this.setState({devices: res.data.results})
                        const tmp = res.data.results
                        for (let cur of tmp) {
                            if (cur.name === response.data.info.uzi_device_name) {
                                this.setState({
                                    uziDevice: cur
                                })
                                // console.log(cur)
                            }
                        }
                    })
                if(response.data.segmentation.nodule_type === undefined){
                    let ar = [false, false, false, false, false]
                    let ar2 = [false, false, false, false, false]
                    let arr = []
                    this.state.aiTypes.clear()
                    for(let item of response.data.segmentation){
                        if(!item.is_ai){
                            this.setState({
                                checked: true,
                                groupId: item.id,
                                currentType: Number(item.details.nodule_type),
                                currentWidth: item.details.nodule_width,
                                currentLength: item.details.nodule_length,
                                currentHeight: item.details.nodule_height,

                            })
                            this.state.doctorTypes.add(item)
                        }
                        else {
                            this.state.aiTypes.add(item)
                        }
                        if(item.details.nodule_type === 1){
                            if(!item.is_ai){
                                ar2[0] = true
                            }
                            else{
                                ar[0] = true
                            }
                        }
                        if(item.details.nodule_type === 2){
                            if(!item.is_ai){
                                ar2[1] = true
                            }
                            else{
                                ar[1] = true
                            }
                        }
                        if(item.details.nodule_type === 3){
                            if(!item.is_ai){
                                ar2[2] = true
                            }
                            else{
                                ar[2] = true
                            }
                        }
                        if(item.details.nodule_type === 4){
                            if(!item.is_ai){
                                ar2[3] = true
                            }
                            else{
                                ar[3] = true
                            }
                        }
                        if(item.details.nodule_type === 5){
                            if(!item.is_ai){
                                ar2[4] = true
                            }
                            else{
                                ar[4] = true
                            }
                        }
                        arr.push(`TI-RADS ${item.details.nodule_type} ${!item.is_ai?'- подтверждено врачом':'- определил ассистент'}`)
                    }
                    this.setState({
                        tiradsType: ar,
                        typesForReport: arr,
                        doctorTiradsType: ar2
                    })
                }
                this.setState({
                    slide_template: response.data.image.slide_template,
                    image_count: response.data.image.image_count,
                    uziDate: new Date(response.data.info.diagnos_date),
                    predictedTypes: response.data.segmentation,
                    nodule_amount: response.data.segmentation.length,
                    segmentation: response.data.segmentation,
                    patientCard: response.data.info.patient.id,
                    patientPolicy: response.data.info.patient.personal_policy,
                    patientLastName: response.data.info.patient.last_name,
                    patientFirstName: response.data.info.patient.first_name,
                    patientFathersName: response.data.info.patient.fathers_name,
                    projectionType: response.data.info.details.projection_type!== undefined ? response.data.info.details.projection_type : 'long',
                    longResult: response.data.info.echo_descr,
                    originalImage: response.data.image.image,
                    shortResult: response.data.info.has_nodules === 'T',
                    cdk: response.data.info.details.cdk,
                    diagnosis: response.data.info.diagnosis,
                    echogenicity: response.data.info.details.echogenicity,
                    isthmus: response.data.info.details.isthmus,
                    left_depth: response.data.info.details.left_depth,
                    left_length: response.data.info.details.left_length,
                    left_width: response.data.info.details.left_width,
                    position: response.data.info.details.position,
                    profile: response.data.info.details.profile,
                    result: response.data.info.details.result,
                    right_depth: response.data.info.details.right_depth,
                    right_length: response.data.info.details.right_length,
                    right_width: response.data.info.details.right_width,
                    rln: response.data.info.details.rln,
                    structure: response.data.info.details.structure,
                    additional_data: response.data.info.details.additional_data,
                    imageId: response.data.image.id,
                    right_volume: !isNaN(0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width)? (0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width) : 0,
                    left_volume: !isNaN(0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width)? (0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width) : 0,
                    volume: !isNaN(0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width + 0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width)? (0.479 * response.data.info.details.left_depth * response.data.info.details.left_length * response.data.info.details.left_width + 0.479 * response.data.info.details.right_depth * response.data.info.details.right_length * response.data.info.details.right_width):0,
                })
            })

    }

    handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        //console.log(this.state)
        axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json").then((response) => {
            //console.log(response.data)
            const formData = {patient_card: {}, details: {}}
            formData.patient_card.patient = response.data.info.patient.id
            formData.acceptance_datetime = this.state.uziDate
            formData.patient_card.has_nodules = this.state.shortResult ? 'T' : 'F'
            formData.patient_card.diagnosis = this.state.diagnosis
            formData.details.projection_type = this.state.projectionType
            formData.details.nodule_type = this.state.tiradsType
            formData.uzi_device = this.state.uziDevice.id
            formData.details.cdk = this.state.cdk
            formData.details.echogenicity = this.state.echogenicity
            formData.details.isthmus = this.state.isthmus
            formData.details.left_depth = this.state.left_depth
            formData.details.left_length = this.state.left_length
            formData.details.left_width = this.state.left_width
            formData.details.position = this.state.position
            formData.details.profile = this.state.profile
            formData.details.result = this.state.result
            formData.details.right_depth = this.state.right_depth
            formData.details.right_length = this.state.right_length
            formData.details.right_width = this.state.right_width
            formData.details.rln = this.state.rln
            formData.details.structure = this.state.structure
            formData.details.additional_data = this.state.additional_data
            var index = 0
            const tmp_ai_info = []
            for(let item of this.state.tiradsType){
                if(item){
                    tmp_ai_info.push({nodule_type: index+1, nodule_2_3: index === 1 || index === 2? 1: 0,nodule_4: index === 3? 1: 0, nodule_5: index === 4? 1: 0, nodule_height: 1, nodule_length: 1, nodule_width: 1 })
                }
                index++
            }
            formData.details.ai_info = tmp_ai_info
            console.log(formData)
            axios.put(this.props.url + "/uzi/" + this.props.props + '/update/', formData).then(() => {
                this.setState({
                    openSuccess: true,
                })
                //console.log(this.state.openSuccess)
            }).catch(() => {
                this.setState({
                    openError: true,
                })
                // console.log(this.state.openError)
            })
        })

    };
    handleCdk = (event) => {
        this.setState({
            cdk: event.target.value
        })
    }
    handleDiagnosis = (event) => {
        this.setState({
            diagnosis: event.target.value
        })
    }

    handleEchogenicity = (event) => {
        this.setState({
            echogenicity: event.target.value
        })
    }
    handleIsthmus = (event) => {
        this.setState({
            isthmus: event.target.value
        })
    }

    handleLeft_depth = (event) => {
        this.setState({
            left_depth: event.target.value,
            left_volume: 0.479 * event.target.value * this.state.left_length * this.state.left_width,
            volume: 0.479 * event.target.value * this.state.left_length * this.state.left_width + this.state.right_volume,
        })
    }

    handleLeft_length = (event) => {
        this.setState({
            left_length: event.target.value,
            left_volume: 0.479 * this.state.left_depth * event.target.value * this.state.left_width,
            volume: 0.479 * this.state.left_depth * event.target.value * this.state.left_width + this.state.right_volume,
        })
    }
    handleNoduleAmount = (event) => {
        this.state.predictedTypes.push({nodule_type: 3, nodule_2_3: 1,nodule_4:  0, nodule_5: 0, nodule_height: 1, nodule_length: 1, nodule_width: 1 })
        this.setState({
            nodule_amount: this.state.nodule_amount+1,
        })
    }
    handleNoduleAmount2 = (event) => {
        this.state.predictedTypes.pop()
        this.setState({
            nodule_amount: this.state.nodule_amount === 0? 0:this.state.nodule_amount -1,
        })
    }

    handleLeft_width = (event) => {
        this.setState({
            left_width: event.target.value,
            left_volume: 0.479 * this.state.left_depth * this.state.left_length * event.target.value,
            volume: 0.479 * this.state.left_depth * this.state.left_length * event.target.value + this.state.right_volume,
        })
    }

    handleRight_depth = (event) => {
        this.setState({
            right_depth: event.target.value,
            right_volume: 0.479 * event.target.value * this.state.right_length * this.state.right_width,
            volume: 0.479 * event.target.value * this.state.right_length * this.state.right_width + this.state.left_volume,
        })
    }

    handleRight_length = (event) => {
        this.setState({
            right_length: event.target.value,
            right_volume: 0.479 * this.state.right_depth * event.target.value * this.state.right_width,
            volume: 0.479 * this.state.right_depth * event.target.value * this.state.right_width + this.state.left_volume

        })
    }
    handleClick1 = () => {
        //console.info(this.state.tiradsType)
        this.setState({
            tiradsType: [!this.state.tiradsType[0], this.state.tiradsType[1], this.state.tiradsType[2], this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick2 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], !this.state.tiradsType[1], this.state.tiradsType[2], this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick3 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], this.state.tiradsType[1], !this.state.tiradsType[2], this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick4 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], this.state.tiradsType[1], this.state.tiradsType[2], !this.state.tiradsType[3], this.state.tiradsType[4] ]
        })
    }
    handleClick5 = () => {
        this.setState({
            tiradsType: [this.state.tiradsType[0], this.state.tiradsType[1], this.state.tiradsType[2], this.state.tiradsType[3], !this.state.tiradsType[4] ]
        })
    }

    handleRight_width = (event) => {
        this.setState({
            right_width: event.target.value,
            right_volume: 0.479 * this.state.right_depth * this.state.right_length * event.target.value,
            volume: 0.479 * this.state.right_depth * this.state.right_length * event.target.value + this.state.left_volume

        })
    }

    handlePosition = (event) => {
        this.setState({
            position: event.target.value
        })
    }

    handleProfile = (event) => {
        this.setState({
            profile: event.target.value
        })
    }
    handleAdditional_data = (event) => {
        this.setState({
            additional_data: event.target.value
        })
    }
    handleExpand = () => {
        this.setState({
            expanded_info: !this.state.expanded_info
        })
    }
    handleResult = (event) => {
        this.setState({
            result: event.target.value
        })
    }

    handleRln = (event) => {
        this.setState({
            rln: event.target.value
        })
    }

    handleStructure = (event) => {
        this.setState({
            structure: event.target.value
        })
    }

    handleChooseTirads = (event) => {
        this.setState({
            tiradsType: event.target.value,
        });
    };

    handleChooseShortResult = () => {
        this.setState({
            shortResult: !this.state.shortResult,
        });
    };
    handleChooseDevice = (event) => {
        //console.log(event.target.value)
        this.setState({
            uziDevice: event.target.value,
            deviceChosen: true
        });
        console.log(event.target.value)
    };

    handleChooseProjection = (event) => {
        this.setState({
            projectionType: event.target.value,
            projectionChosen: true,
        });
    };
    handleCloseDialog = () => {
        this.setState({
            open: false
        })
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
            openError: false,
        })
    };
    handleDialog = () => {
        this.setState({
            open: true
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
                <Snackbar open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}}
                           onClose={this.handleClose}>Возникла ошибка при сохранении</Alert>
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
                    <Grid component={""} container direction={'column'} alignContent={'center'} justifyContent={'center'} sx={{marginBlock: -1}}>
                        <Grid component={""} item>
                            <Box className={'second-step'} component={""} sx={{flexDirection: 'column'}}>
                                <FormGroup>
                                    <FormControlLabel label={this.state.checked?"Проверено специалистом":"Не проверено специалистом"} disabled
                                                      sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                                      labelPlacement="end"
                                                      control={<Checkbox checked={this.state.checked} sx={{
                                                          color: 'dimgray', '&.Mui-checked': {
                                                              color: '#4fb3ea',
                                                          }
                                                      }} icon={<ClearIcon/>}
                                                                         checkedIcon={<DoneSharpIcon/>}
                                                      />}/>
                                </FormGroup>
                            </Box>
                            <Grid component={""} item className={'first-step'}>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Пациент: </h3>
                                    <h3>  {this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h3>
                                </Box>
                            </Grid>
                            <Grid component={""} item className={'first-step'}>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Полис: </h3>
                                    <h3>  {this.state.patientPolicy}</h3>
                                </Box>
                            </Grid>
                            <Stack className={'third-step'} direction="row" sx={{paddingTop: 1}}>
                                <h3 style={{
                                    color: 'dimgray',
                                    fontSize: 20,
                                    fontFamily: "Roboto",
                                    fontWeight: 'normal',
                                    whiteSpace: 'normal',
                                }}>Дата: </h3>
                                <h3>  {this.state.uziDate.toLocaleDateString()}</h3>
                            </Stack>
                            <Box className={'fourth-step'}>
                                <Stack direction={'column'}>
                                    <Button onClick={this.handleExpand} sx={{color: this.state.expanded_info? 'dimgray':'#4fb3ea', textTransform: 'none'}}>
                                        <h3 style={{
                                            color: 'dimgray',
                                            fontSize: 15,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 4.5,
                                            marginInlineEnd: 5,
                                        }}>Типы новообразований, определенные ассистентом: </h3>
                                        {!this.state.expanded_info?<KeyboardArrowDownIcon/>:<KeyboardArrowUpIcon/>}
                                    </Button>
                                    <Stack direction="row" alignContent={'center'} justifyContent={'center'} spacing={1} sx={{paddingTop: 1}}>
                                        {/*<Chip label="TI-RADS 1" clickable={true} sx={{color: this.state.tiradsType[0]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[0]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[0]? "standard" : "outlined"} onClick={this.handleClick1}/>*/}
                                        {/*<Chip label="TI-RADS 2" clickable={true} sx={{color: this.state.tiradsType[1]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[1]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[1]? "filled" : "outlined"} onClick={this.handleClick2}/>*/}
                                        {/*<Chip label="TI-RADS 3" clickable={true} sx={{color: this.state.tiradsType[2]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[2]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[2]? "filled" : "outlined"} onClick={this.handleClick3}/>*/}
                                        {/*<Chip label="TI-RADS 4" clickable={true} sx={{color: this.state.tiradsType[3]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[3]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[3]? "filled" : "outlined"} onClick={this.handleClick4}/>*/}
                                        {/*<Chip label="TI-RADS 5" clickable={true} sx={{color: this.state.tiradsType[4]? '#ffffff' : '#4fb3ea', borderColor: '#4fb3ea', backgroundColor: !this.state.tiradsType[4]? '#ffffff' : '#4fb3ea'}} variant={this.state.tiradsType[4]? "filled" : "outlined"} onClick={this.handleClick5}/>*/}
                                        <Chip label="TI-RADS 1" sx={{color: !this.state.tiradsType[0]? '#949494' : '#4fb3ea', borderColor: !this.state.tiradsType[0]? '#949494' : '#4fb3ea', }} variant={ "outlined"} />
                                        <Chip label="TI-RADS 2" sx={{color: !this.state.tiradsType[1]? '#949494' : '#4fb3ea', borderColor: !this.state.tiradsType[1]? '#949494' : '#4fb3ea', }} variant={"outlined"} />
                                        <Chip label="TI-RADS 3" sx={{color: !this.state.tiradsType[2]? '#949494' : '#4fb3ea', borderColor: !this.state.tiradsType[2]? '#949494' : '#4fb3ea', }} variant={"outlined"} />
                                        <Chip label="TI-RADS 4" sx={{color: !this.state.tiradsType[3]? '#949494' : '#4fb3ea', borderColor: !this.state.tiradsType[3]? '#949494' : '#4fb3ea', }} variant={"outlined"} />
                                        <Chip label="TI-RADS 5" sx={{color: !this.state.tiradsType[4]? '#949494' : '#4fb3ea', borderColor: !this.state.tiradsType[4]? '#949494' : '#4fb3ea', }} variant={"outlined"} />
                                    </Stack>
                                </Stack>
                                {this.state.expanded_info &&
                                    <Stack className={'fifth-step'} alignContent={'center'} justifyContent={'center'} spacing={1} sx={{paddingTop: 2}}>
                                        {Array.from(this.state.aiTypes).map((data, index) =>
                                            <Stack direction={'row'} alignContent={'center'} justifyContent={'center'} spacing={2}>
                                                <h3 style={{
                                                    color: 'dimgray',
                                                    fontSize: 15,
                                                    fontFamily: "Roboto",
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'normal',
                                                    marginBlockStart: 4.5,
                                                    marginInlineEnd: 5,
                                                }}> Узел {index+1}:
                                                </h3>
                                                {/*<h3 style={{*/}
                                                {/*    color: 'dimgray',*/}
                                                {/*    fontSize: 15,*/}
                                                {/*    fontFamily: "Roboto",*/}
                                                {/*    fontWeight: 'normal',*/}
                                                {/*    whiteSpace: 'normal',*/}
                                                {/*    marginBlockStart: 4.5,*/}
                                                {/*    marginInlineEnd: 5,*/}
                                                {/*}}> TI-RADS {data.details.nodule_type.toString()}*/}
                                                {/*</h3>*/}
                                                <h3 style={{
                                                    color: data.details.nodule_type === 2 || data.details.nodule_type === 3? '#008dc0':'dimgray',
                                                    fontSize: 15,
                                                    fontFamily: "Roboto",
                                                    fontWeight: data.details.nodule_type === 2 || data.details.nodule_type === 3? 'normal':'lighter',
                                                    whiteSpace: 'normal',
                                                    marginBlockStart: 4.5,
                                                    marginInlineEnd: 5,
                                                }}> TI-RADS 2-3: {(data.details.nodule_2_3*100).toFixed(1).toString()} %
                                                </h3>
                                                <h3 style={{
                                                    color: data.details.nodule_type === 4? '#008dc0':'dimgray',
                                                    fontSize: 15,
                                                    fontFamily: "Roboto",
                                                    fontWeight: data.details.nodule_type === 4? 'normal':'lighter',
                                                    whiteSpace: 'normal',
                                                    marginBlockStart: 4.5,
                                                    marginInlineEnd: 5,
                                                }}> <b style={{fontWeight: "normal"}}>TI-RADS 4:</b> {(data.details.nodule_4*100).toFixed(1).toString()} %
                                                </h3>
                                                <h3 style={{
                                                    color: data.details.nodule_type === 5? '#008dc0':'dimgray',
                                                    fontSize: 15,
                                                    fontFamily: "Roboto",
                                                    fontWeight: data.details.nodule_type === 5?'normal' :'lighter',
                                                    whiteSpace: 'normal',
                                                    marginBlockStart: 4.5,
                                                    marginInlineEnd: 5,
                                                }}> <b style={{fontWeight: "normal"}}>TI-RADS 5:</b> {(data.details.nodule_5*100).toFixed(1).toString()} %
                                                </h3>
                                            </Stack>
                                        )
                                        }
                                    </Stack>}
                                <Stack direction={'column'}>
                                    <Button onClick={this.handleExpand} sx={{ textTransform: 'none'}} disabled={true}>
                                        <h3 style={{
                                            color: 'dimgray',
                                            fontSize: 15,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 4.5,
                                            marginInlineEnd: 5,
                                        }}>Типы новообразований, определенные специалистом: </h3>
                                    </Button>
                                    <Stack direction="row" alignContent={'center'} justifyContent={'center'} spacing={1} sx={{paddingTop: 1}}>
                                        <Chip label="TI-RADS 1" sx={{color: this.state.doctorTiradsType[0]? '#ffffff' : '#194964', borderColor: '#1c4962', backgroundColor: !this.state.doctorTiradsType[0]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[0]? "standard" : "outlined"} />
                                        <Chip label="TI-RADS 2" sx={{color: this.state.doctorTiradsType[1]? '#ffffff' : '#1e4960', borderColor: '#1f495f', backgroundColor: !this.state.doctorTiradsType[1]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[1]? "filled" : "outlined"} />
                                        <Chip label="TI-RADS 3" sx={{color: this.state.doctorTiradsType[2]? '#ffffff' : '#1f495f', borderColor: '#21495e', backgroundColor: !this.state.doctorTiradsType[2]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[2]? "filled" : "outlined"} />
                                        <Chip label="TI-RADS 4" sx={{color: this.state.doctorTiradsType[3]? '#ffffff' : '#22495d', borderColor: '#21495e', backgroundColor: !this.state.doctorTiradsType[3]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[3]? "filled" : "outlined"} />
                                        <Chip label="TI-RADS 5" sx={{color: this.state.doctorTiradsType[4]? '#ffffff' : '#1c4962', borderColor: '#21495e', backgroundColor: !this.state.doctorTiradsType[4]? '#ffffff' : '#194964'}} variant={this.state.doctorTiradsType[4]? "filled" : "outlined"} />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid component={""} item alignItems={'center'} justifyContent={'center'} sx={{paddingTop: 0}}>
                            <Gallery url={this.props.url} props={this.props.props} link1={this.state.originalImage} date={this.state.uziDate} image_count={this.state.image_count} slide_template={this.state.slide_template}
                                     number={this.props.props} type={this.state.tiradsType} seg={this.state.segmentation} imageid={this.state.imageId}></Gallery>
                            {/*<TabsComponent></TabsComponent>*/}
                        </Grid>
                        <Box className={'seventh-step'} component={""} sx={{display: 'flex', flexDirection: 'row', paddingTop: 2}}>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldResult
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.uziDevice}
                                            label="Аппарат"
                                            onChange={this.handleChooseDevice}
                                            variant='outlined'
                                            select
                                        >
                                            {this.state.devices.map((data, index) =>
                                                <MenuItem key={data.id} value={data}>
                                                    {data.name}
                                                </MenuItem>

                                            )}
                                        </TextFieldResult>
                                    </FormControl>
                                </Box>

                                {/*<Box flexDirection={'row'} justifySelf={'center'} justifyItems={'center'} alignItems={'center'} component={""} sx={{width: 300, borderRadius: 3, paddingTop: 2, flexDirection: 'row', display: 'flex'}}>*/}
                                {/*    /!*<FormControl variant={'outlined'} fullWidth>*!/*/}
                                {/*    <h3 style={{*/}
                                {/*        color: 'dimgray',*/}
                                {/*        fontSize: 15,*/}
                                {/*        fontFamily: "Roboto",*/}
                                {/*        fontWeight: 'normal',*/}
                                {/*        whiteSpace: 'normal',*/}
                                {/*        marginBlockStart: 0,*/}
                                {/*        marginBlockEnd: 0,*/}
                                {/*        marginInlineEnd: 0,*/}
                                {/*    }}>Количество узлов:</h3>*/}
                                {/*    <IconButton*/}
                                {/*        aria-label="remove"*/}
                                {/*        onClick={this.handleNoduleAmount2}*/}
                                {/*        sx={{*/}
                                {/*            color: (theme) => theme.palette.grey[500],*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        <RemoveCircleOutlineIcon/>*/}
                                {/*    </IconButton>*/}
                                {/*    <h3 style={{*/}
                                {/*        color: 'dimgray',*/}
                                {/*        fontSize: 15,*/}
                                {/*        fontFamily: "Roboto",*/}
                                {/*        fontWeight: 'normal',*/}
                                {/*        whiteSpace: 'normal',*/}
                                {/*        marginBlockStart: 0,*/}
                                {/*        marginBlockEnd: 0,*/}
                                {/*        marginInlineEnd: 0,*/}
                                {/*    }}>{this.state.nodule_amount}</h3>*/}
                                {/*    <IconButton*/}
                                {/*        aria-label="add"*/}
                                {/*        onClick={this.handleNoduleAmount}*/}
                                {/*        sx={{*/}
                                {/*            color: (theme) => theme.palette.grey[500],*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        <AddCircleOutlineIcon/>*/}
                                {/*    </IconButton>*/}
                                {/*</Box>*/}
                                {/*<Box component={""} sx={{width: 300, borderRadius: 3}}>*/}
                                {/*    <FormControl variant={'outlined'} fullWidth>*/}
                                {/*        <LocalizationProvider adapterLocale={'ru'} dateAdapter={AdapterDayjs}>*/}
                                {/*            <DatePicker*/}
                                {/*                label="Дата приема"*/}
                                {/*                value={this.state.uziDate}*/}
                                {/*                onChange={(newValue) => {*/}
                                {/*                    this.setState({uziDate: newValue});*/}
                                {/*                }}*/}
                                {/*                renderInput={(params) => <TextFieldResult {...params}*/}
                                {/*                                                          InputLabelProps={{shrink: true}}/>}*/}
                                {/*            />*/}
                                {/*        </LocalizationProvider>*/}
                                {/*    </FormControl>*/}
                                {/*</Box>*/}
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldResult
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.projectionType}
                                            label="Тип проекции"
                                            onChange={this.handleChooseProjection}
                                            variant='outlined'
                                            defaultValue={this.state.projectionType}
                                            select
                                        >
                                            <MenuItem value={'long'}>Продольная</MenuItem>
                                            <MenuItem value={'cross'}>Поперечная</MenuItem>
                                        </TextFieldResult>
                                    </FormControl>
                                </Box>
                                {/*<Chip></Chip>*/}
                                {/*<Box component={""} sx={{width: 300, borderRadius: 3}}>*/}
                                {/*    <FormControl variant={'outlined'} fullWidth>*/}
                                {/*        <TextFieldResult*/}
                                {/*            value={this.state.tiradsType}*/}
                                {/*            label="Тип узла по EU TI-RADS"*/}
                                {/*            onChange={this.handleChooseTirads}*/}
                                {/*            variant='outlined'*/}
                                {/*            defaultValue={1}*/}
                                {/*            select*/}
                                {/*            InputLabelProps={{shrink: true}}*/}
                                {/*        >*/}
                                {/*            <MenuItem value={'1'}>1</MenuItem>*/}
                                {/*            <MenuItem value={'2'}>2</MenuItem>*/}
                                {/*            <MenuItem value={'3'}>3</MenuItem>*/}
                                {/*            <MenuItem value={'4'}>4</MenuItem>*/}
                                {/*            <MenuItem value={'5'}>5</MenuItem>*/}
                                {/*        </TextFieldResult>*/}
                                {/*    </FormControl>*/}
                                {/*</Box>*/}
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 1, paddingLeft: 2}}>
                                <FormGroup>

                                    <FormControlLabel label={"Обнаружено новообразование"}
                                                      sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                                      labelPlacement="end"
                                                      control={<Checkbox checked={this.state.shortResult} sx={{
                                                          color: 'dimgray', '&.Mui-checked': {
                                                              color: '#4fb3ea',
                                                          }
                                                      }} icon={<DoneSharpIcon/>}
                                                                         checkedIcon={<DoneSharpIcon/>}
                                                                         onChange={this.handleChooseShortResult}
                                                      />}/>
                                </FormGroup>
                                <Box component={""} sx={{
                                    width: 300,
                                    borderRadius: 3,
                                    paddingTop: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}>
                                    <Button sx={{
                                        color: '#4fb3ea',
                                        '&:focus': {},
                                        '&:hover': {},
                                        fontFamily: 'Roboto'
                                    }} className={'eighth-step'} variant={'outlined'} onClick={this.handleDialog}>
                                        Эхографические признаки
                                    </Button>
                                </Box>
                                <Dialog PaperProps={{sx: {borderRadius: 3, width: 2000}}}
                                        open={this.state.open}
                                        keepMounted
                                        onClose={this.handleCloseDialog}
                                        aria-describedby="alert-dialog-slide-description"
                                        BackdropProps={{style: {opacity: 0.3}}}
                                >

                                    <BootstrapDialogTitle color={'#4fb3ea'} fontWeight={'lighter'} fontSize={25}
                                                          sx={{marginBottom: -2}} onClose={this.handleCloseDialog}>Результаты
                                        диагностики</BootstrapDialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description" fontFamily={'Roboto'}
                                                           fontWeight={'lighter'} color={'dimgray'} fontSize={10}
                                                           sx={{marginBlock: 0}}>
                                            Заполните необходимые поля
                                        </DialogContentText>
                                        <Box component={""} sx={{display: 'flex', flexDirection: 'column'}}>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.profile}
                                                        label="Контуры"
                                                        onChange={this.handleProfile}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{display: 'flex', flexDirection: 'row'}}>
                                                <Box component={""} sx={{display: 'flex', flexDirection: 'column', paddingRight: 2}}>
                                                    <Grid component={""} item>
                                                        <Typography component={""} sx={{
                                                            paddingTop: 2,
                                                            color: 'dimgray',
                                                            fontWeight: 'lighter'
                                                        }} variant={'body1'}>Левая доля</Typography>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_length}
                                                                    label="Длина"
                                                                    onChange={this.handleLeft_length}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_width}
                                                                    label="Ширина"
                                                                    onChange={this.handleLeft_width}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>

                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_depth}
                                                                    label="Толщина"
                                                                    onChange={this.handleLeft_depth}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.left_volume}
                                                                    label="Объем"
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                </Box>
                                                <Box component={""} sx={{display: 'flex', flexDirection: 'column'}}>
                                                    <Grid component={""} item>
                                                        <Typography component={""} sx={{
                                                            paddingTop: 2,
                                                            color: 'dimgray',
                                                            fontWeight: 'lighter'
                                                        }} variant={'body1'}>Правая доля</Typography>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.right_length}
                                                                    label="Длина"
                                                                    onChange={this.handleRight_length}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.right_width}
                                                                    label="Ширина"
                                                                    onChange={this.handleRight_width}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>

                                                    <Grid component={""} item>
                                                        <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                            <FormControl variant={'outlined'} fullWidth>
                                                                <TextFieldResult
                                                                    value={this.state.right_depth}
                                                                    label="Толщина"
                                                                    onChange={this.handleRight_depth}
                                                                    variant='outlined'
                                                                    InputLabelProps={{shrink: true}}
                                                                >
                                                                </TextFieldResult>
                                                            </FormControl>
                                                        </Box>
                                                    </Grid>
                                                    <Box component={""} sx={{width: 100, borderRadius: 3, paddingTop: 2}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.right_volume}
                                                                label="Объем"
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box component={""} sx={{width: 215, borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        value={this.state.volume}
                                                        label="Объем железы"
                                                        variant='outlined'
                                                        InputLabelProps={{shrink: true}}
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: 215, borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.isthmus}
                                                        label="Перешеек"
                                                        onChange={this.handleIsthmus}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.structure}
                                                        label="Структура"
                                                        onChange={this.handleStructure}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.echogenicity}
                                                        label="Эхогенность"
                                                        onChange={this.handleEchogenicity}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.rln}
                                                        label="Регионарные лимфатические узлы"
                                                        onChange={this.handleRln}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.cdk}
                                                        label="Васкуляризация по ЦДК"
                                                        onChange={this.handleCdk}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.position}
                                                        label="Расположение"
                                                        onChange={this.handlePosition}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.additional_data}
                                                        label="Дополнительные данные"
                                                        onChange={this.handleAdditional_data}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 2}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.diagnosis}
                                                        label="Заключение"
                                                        onChange={this.handleDiagnosis}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>


                                        </Box>
                                    </DialogContent>
                                    <DialogActions>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <Box component={""} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignContent: 'center', alignItems: 'center'
                                    }}
                                    >
                                        <Box component={""} sx={{
                                            width: 300,
                                            borderRadius: 3,
                                            paddingBottom: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center'
                                        }}><Button sx={{
                                            width: '100%',
                                            color: '#4fb3ea',
                                            '&:focus': {},
                                            '&:hover': {},
                                            fontFamily: 'Roboto'
                                        }} variant={'outlined'} onClick={this.handleResponse}>
                                            Сохранить результат
                                        </Button>
                                        </Box>
                                        <Box component={""} sx={{
                                            width: 300,
                                            borderRadius: 3,
                                            paddingBottom: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center'
                                        }}>
                                            <PDFDownloadLink document={<MyDocument patient={this.state.patientLastName + " " + this.state.patientFirstName + " " + this.state.patientFathersName}
                                                                                   policy={this.state.patientPolicy}
                                                                                   date={new Date(Date.parse(this.state.uziDate)).toLocaleDateString()}
                                                                                   projection={this.state.projectionType === 'long' ? 'Продольная' : "Поперечная"}
                                                                                   device={this.state.uziDevice.name}
                                                                                   tiradsType={this.state.tiradsType}
                                                                                   predictedTypes={this.state.typesForReport.toString().replaceAll(',', ", ")}
                                                                                   cdk={this.state.cdk}
                                                                                   diagnosis={this.state.diagnosis}
                                                                                   echogenicity={this.state.echogenicity}
                                                                                   isthmus={this.state.isthmus}
                                                                                   left_depth={this.state.left_depth}
                                                                                   left_length={this.state.left_length}
                                                                                   left_width={this.state.left_width}
                                                                                   position={this.state.position}
                                                                                   profile={this.state.profile}
                                                                                   result={this.state.result}
                                                                                   right_depth={this.state.right_depth}
                                                                                   right_length={this.state.right_length}
                                                                                   right_width={this.state.right_width}
                                                                                   rln={this.state.rln}
                                                                                   structure={this.state.structure}
                                                                                   left_volume={this.state.left_volume}
                                                                                   right_volume={this.state.right_volume}
                                                                                   volume={this.state.volume}
                                                                                   additional_data={this.state.additional_data}
                                                                                   doctorName={this.state.doctorName}
                                                                                   medOrg={this.state.medOrg}
                                            />} fileName={"Result_"+this.state.date.toLocaleDateString().replaceAll(".", "_")+"_"+this.state.patientLastName+".pdf"}
                                                             style={{textDecoration: 'none'}}>
                                                {({ loading}) =>
                                                    (loading ? "loading" : <Button sx={{
                                                        width: '100%',
                                                        color: '#4fb3ea',
                                                        '&:focus': {},
                                                        '&:hover': {},
                                                        fontFamily: 'Roboto'
                                                    }} className={'ninth-step'} variant={'outlined'}>Скачать заключение</Button>)}
                                            </PDFDownloadLink>
                                        </Box>
                                        <Box component={""} sx={{
                                            width: 300, borderRadius: 3, display: 'flex', justifyContent: 'center',
                                            alignContent: 'center'
                                        }}>
                                            {/*<Button component={Link} to={`mask/`}*/}
                                            {/*        disabled={(this.state.originalImage.split('.')[1] === 'tiff' || this.state.originalImage.split('.')[1] === 'tif')}*/}
                                            {/*        sx={{*/}
                                            {/*            width: '100%',*/}
                                            {/*            color: '#3083a9',*/}
                                            {/*            '&:focus': {backgroundColor: '#3083a9'},*/}
                                            {/*            '&:hover': {},*/}
                                            {/*            fontFamily: 'Roboto'*/}
                                            {/*        }} variant={'outlined'}>*/}
                                            {/*    Указать ошибку*/}
                                            {/*</Button>*/}
                                        </Box>

                                    </Box>

                                </Box>

                            </Box>

                        </Box>
                        {/*<Stack direction="column">*/}
                        {/*    {this.state.predictedTypes.map((item, index) =>*/}
                        {/*        <Stack direction={'row'} sx={{paddingTop: 1}}>*/}
                        {/*            <h3 style={{*/}
                        {/*                color: 'dimgray',*/}
                        {/*                fontSize: 20,*/}
                        {/*                fontFamily: "Roboto",*/}
                        {/*                fontWeight: 'normal',*/}
                        {/*                whiteSpace: 'normal',*/}
                        {/*                marginBlockStart: 0,*/}
                        {/*                marginBlockEnd: 0,*/}
                        {/*                marginInlineEnd: 5,*/}
                        {/*            }}>{index+1}</h3>*/}
                        {/*            <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2, paddingInline: 1}}>*/}
                        {/*                <FormControl variant={'outlined'} fullWidth>*/}
                        {/*            <TextFieldResult*/}
                        {/*                InputLabelProps={{shrink: true}}*/}
                        {/*                value={this.state.predictedTypes[index].nodule_type}*/}
                        {/*                label="Тип EU TI-RADS"*/}
                        {/*                onChange={this.handleChooseProjection}*/}
                        {/*                variant='outlined'*/}
                        {/*                select*/}
                        {/*            >*/}
                        {/*                <MenuItem value={2}>2</MenuItem>*/}
                        {/*                <MenuItem value={3}>3</MenuItem>*/}
                        {/*                <MenuItem value={4}>4</MenuItem>*/}
                        {/*                <MenuItem value={5}>5</MenuItem>*/}
                        {/*            </TextFieldResult>*/}
                        {/*                </FormControl>*/}
                        {/*            </Box>*/}
                        {/*            <Box component={""} sx={{width: 200, borderRadius: 3, paddingBottom: 2, paddingInline: 1}}>*/}
                        {/*                <FormControl variant={'outlined'} fullWidth>*/}
                        {/*                    <TextFieldResult*/}
                        {/*                        InputLabelProps={{shrink: true}}*/}
                        {/*                        value={this.state.predictedTypes[index].nodule_width}*/}
                        {/*                        label="Ширина узла"*/}
                        {/*                        onChange={this.handleChooseProjection}*/}
                        {/*                        variant='outlined'*/}
                        {/*                    >*/}
                        {/*                    </TextFieldResult>*/}
                        {/*                </FormControl>*/}
                        {/*            </Box>*/}
                        {/*            <Box component={""} sx={{width: 200, borderRadius: 3, paddingBottom: 2, paddingInline: 1}}>*/}
                        {/*                <FormControl variant={'outlined'} fullWidth>*/}
                        {/*                    <TextFieldResult*/}
                        {/*                        InputLabelProps={{shrink: true}}*/}
                        {/*                        value={this.state.predictedTypes[index].nodule_length}*/}
                        {/*                        label="Длина узла"*/}
                        {/*                        onChange={this.handleChooseProjection}*/}
                        {/*                        variant='outlined'*/}
                        {/*                    >*/}
                        {/*                    </TextFieldResult>*/}
                        {/*                </FormControl>*/}
                        {/*            </Box>*/}
                        {/*            <Box component={""} sx={{width: 200, borderRadius: 3, paddingBottom: 2, paddingInline: 1}}>*/}
                        {/*                <FormControl variant={'outlined'} fullWidth>*/}
                        {/*                    <TextFieldResult*/}
                        {/*                        InputLabelProps={{shrink: true}}*/}
                        {/*                        value={this.state.predictedTypes[index].nodule_height}*/}
                        {/*                        label="Толщина узла"*/}
                        {/*                        onChange={this.handleChooseProjection}*/}
                        {/*                        variant='outlined'*/}
                        {/*                    >*/}
                        {/*                    </TextFieldResult>*/}
                        {/*                </FormControl>*/}
                        {/*            </Box>*/}
                        {/*        </Stack>) }*/}
                        {/*</Stack>*/}
                    </Grid>
                </Box>

            </FormControl>
        )

    }
}

export default ResultsPageInterface;