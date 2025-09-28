import {Box, FormControl} from "@mui/material";
import * as React from "react";
import Grid from "@mui/material/Grid";
import ConvasComponent from "./ConvasComponent";
import {useParams} from "react-router-dom";
import axios from "axios";

const MaskPageInterface = (props) => {
    const {number2} = useParams();
    return (
        <MaskPage props={number2} url={props.url}></MaskPage>
    )
}



class MaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: '',
            uziDevice: null,
            projectionType: null,
            patientCard: null,
            uziDate: null,
            tiradsType: null,
            shortResult: false,
            uziWidth: 0,
            uziLength: 0,
            uziDepth: 0,
            uziVolume: null,
            longResult:null,
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
        };

    }
    componentDidMount() {
        this.handleStartPage()
    }

    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+"/uzi/"+this.props.props+"/?format=json")
            .then((response) => {
                this.setState({ startData: response.data.info})
                this.setState({
                    originalImage: this.props.url+response.data.images.original.image,
                })
            });

    }


    render() {
        return (
            <FormControl fullWidth fullHeight sx={{height: '100%', width:'100%'}}>
                <Box sx={{backgroundColor: '#ffffff', paddingLeft: 15,paddingTop: 20,paddingBottom: 10,borderTopLeftRadius:130, elevation:10, boxShadow: 2, '&:hover': {
                        backgroundColor: "#ffffff",
                    },}} >
                    <Grid container={true} direction={'row'} justify = "center">
                        <Grid item>
                            <ConvasComponent img={this.state.originalImage} number={this.props.props} type={this.state.projectionType} url={this.props.url}/>
                        </Grid>
                        <Grid item>
                            <Box sx={{ width: 300, borderRadius:3}} >
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </FormControl>
        );
    }
}

export default MaskPageInterface;

