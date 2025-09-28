import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import 'swiper/css/navigation';
import 'swiper/css'
import "../styles.css";
import {BiShapePolygon, BiRectangle} from 'react-icons/bi'
import OpenSeadragonViewerUpdater from "./OpenSeadragonViewerUpdater";
import {Link} from "react-router-dom";



const TiffImageComponent = (props) => {
    const [imgArray, setArray] = useState([]);
    const [succ, setSucc] = useState(false)
    const [tool, setTool] = useState('polygon')
    const [type, setType] = useState('png')
    const [length, setLength] = useState(0)
    const [sidebar, setSideBar] = useState(false)
    const [image, setImage] = useState({type: "image", url: props.img})
    const handleChangeTool = () => {
        if(tool === 'polygon'){
            setTool("rect")
        }
        else{
            setTool("polygon")
        }
    }
    useEffect( () => {
        if (props.img !== "" && props.img !== null) {
            if (props.img.split('.')[1] === 'tiff' || props.img.split('.')[1] === 'tif') {
                setType('tiff')
                const tmp_ar = [];
                var i = 1
                while (i <= props.image_count){
                    tmp_ar.push({type: 'image', url: props.slide_template[0]+'/'+ props.slide_template[1]+i+props.slide_template[2]})
                    i++
                }
                // const xhr = new XMLHttpRequest();
                // xhr.open('GET', 'http://msa.mephi.ru'+ props.img);
                // xhr.responseType = 'arraybuffer';
                // xhr.onload = e => {
                //     const ifds = UTIF.decode(e.target.response);
                //     const firstPageOfTif = ifds[0];
                //     const tmp_ar = [];
                //     var index = 0;
                //     for (let tmp of ifds) {
                //         UTIF.decodeImage(e.target.response, ifds[index], ifds);
                //         const rgba = UTIF.toRGBA8(tmp);
                //         const imageWidth = firstPageOfTif.width;
                //         const imageHeight = firstPageOfTif.height;
                //         const cnv = document.createElement('canvas');
                //         cnv.width = imageWidth;
                //         cnv.height = imageHeight;
                //         const ctx = cnv.getContext('2d');
                //         const imageData = ctx.createImageData(imageWidth, imageHeight);
                //         for (let i = 0; i < rgba.length; i++) {
                //             imageData.data[i] = rgba[i];
                //         }
                //         ctx.putImageData(imageData, 0, 0);
                //         const cur = Canvas2image.convertToPNG(cnv)
                //         tmp_ar.push({type: 'image', url: cur.src})
                //         index += 1;
                //     }
                setArray(tmp_ar);
                setLength(tmp_ar.length)
                setSucc(true)
                // };
                // xhr.send();
            } else {
                setSucc(true)
                setImage({type: 'image', url: props.img})
            }
        }
    }, [props.url, props.img])


    const handleExport = () => {
        fetch(props.img, {
            method: "GET", headers: {'Authorization': `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image.tiff"); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };
    const handleChange = () => {
        setSideBar(!sidebar)
    }

    useEffect(() =>{
        console.log(props.seg)
    }, [props.group])

    return (
        <div className={'sixth-step'}>
            <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                 alignContent={'center'}>

                <Button className={'ninth-step'} variant={'outlined'} sx={{marginY: 2, color: '#4fb3ea'}} alt={'Сменить инструмент'} onClick={handleChangeTool}>
                    {tool === 'polygon'? <BiShapePolygon size={'2em'}/> : <BiRectangle size={'2em'}/>}
                </Button>

                <Button component={Link} to={`/result/`+props.number} variant={'outlined'} sx={{marginY: 2,marginX:1, color: '#4fb3ea'}}>
                    Сохранить результаты
                </Button>
            </Box>
            {!succ &&
                <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                     alignContent={'center'} sx={{minHeight: 600}}>
                    <CircularProgress variant="indeterminate" sx={{color:'#4fb3ea'}} {...props}/> </Box>}

            <Box className={'seventh-step'} component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                 alignContent={'center'} sx={{height: !succ? 20:600, visibility: !succ? 'hidden': 'visible'}}>
                <OpenSeadragonViewerUpdater group={props.group} sidebar={sidebar} type={type} image={props.img.split('.')[1] === 'tiff' || props.img.split('.')[1] === 'tif'? imgArray : image} url={props.url} seg={props.seg} boxes={props.boxes} tool={tool} imageid={props.imageid} length={length}/>
            </Box>
        </div>
    );
}
const GalleryUpdate = (props) => {

    const link1 = props.link1 !== null && props.link1 !== "" ? props.link1 : ""


    return (
        <div className={'fifth-step'}>
            {(props.link1 !== null && props.link1 !== "") &&
                <TiffImageComponent number={props.number} url={props.url} img={link1} seg={props.seg} imageid={props.imageid} group={props.group} image_count={props.image_count} slide_template={props.slide_template}/>
            }
            {(props.link1 === null || props.link1 === "") &&
                <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                     alignContent={'center'} sx={{minHeight: 600}}>
                    {/*<CircularProgress variant="indeterminate" sx={{color:'#4fb3ea'}} {...props}/> */}
                </Box>
            }
        </div>
    );
};
export default GalleryUpdate;