import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
//import {SwiperCore, Pagination} from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css'
import "../styles.css";
import OpenSeadragonViewer from "./OpenSeadragonViewer";
import {Link} from "react-router-dom";


//SwiperCore.use([Pagination])

// const SlideComponent = (props) => {
//     const [image] = useImage(props.img, 'anonymous', 'origin',)
//     const layerRef = React.useRef(null);
//     const stageRef = React.useRef(null);
//     const [orBr, setOrBr] = React.useState(0)
//     const [orSat, setOrSat] = React.useState(0)
//
//     const handleChangeBr = (event) => {
//         setOrBr(event.target.value);
//         layerRef.current.cache();
//         layerRef.current.filters([Konva.Filters.Brighten, Konva.Filters.Contrast]);
//         layerRef.current.brightness(orBr / 100)
//         layerRef.current.contrast(orSat)
//     }
//     const handleChangeCont = (event) => {
//         setOrSat(event.target.value);
//         layerRef.current.cache();
//         layerRef.current.filters([Konva.Filters.Contrast, Konva.Filters.Brighten]);
//         layerRef.current.contrast(orSat)
//         layerRef.current.brightness(orBr / 100)
//     }
//     return (
//         <div>
//             <Box component={""} container direction={'column'}>
//                 <GlobalStyles styles={{
//                     h5: {color: 'dimgray', fontSize: 10, fontFamily: "Roboto"}
//                 }}/>
//                 <Stage
//                     width={400}
//                     height={300}
//                     ref={stageRef}
//                 >
//                     <Layer>
//                         <Image ref={layerRef} width={400} height={300} mimeType={"image/png"} image={image}></Image>
//                     </Layer>
//                 </Stage>
//                 <Box component={""} sx={{width: 300, paddingTop: 1}} display={'flex'} alignContent={'center'}>
//                     <h2 style={{fontSize: 12, fontWeight: 'normal', paddingRight: 59, paddingLeft: 30}}>Яркость</h2>
//                     <FormControl variant={'outlined'}>
//                         <Slider aria-label="Яркость" defaultValue={0}
//                                 value={orBr}
//                                 size={'small'}
//                                 track={false}
//                                 min={-100}
//                                 max={100}
//                                 step={5}
//                                 onChange={handleChangeBr}
//                                 valueLabelDisplay="auto"
//                                 sx={{width: 150}}/>
//                     </FormControl>
//                 </Box>
//                 <Box component={""} display={'flex'}>
//                     <Box component={""} sx={{width: 300, paddingBottom: 1}} display={'flex'} alignContent={'center'}>
//                         <h2 style={{
//                             fontSize: 12,
//                             fontWeight: 'normal',
//                             paddingRight: 20,
//                             paddingLeft: 30
//                         }}>Контрастность</h2>
//                         <FormControl variant={'outlined'}>
//                             <Slider aria-label="Контрастность" defaultValue={0}
//                                     value={orSat}
//                                     step={10}
//                                     track={false}
//                                     size={'small'}
//                                     min={-100}
//                                     max={100}
//                                     sx={{width: 150}}
//                                     onChange={handleChangeCont}
//                                     valueLabelDisplay="auto"/>
//                         </FormControl>
//                     </Box>
//                 </Box>
//             </Box>
//             <div id={'stage'}></div>
//         </div>
//     )
// };

// const TiffImageComponent = (props) => {
//     const ref = useRef(props.ref)
//     const [imgArray, setArray] = useState([]);
//     const [succ, setSucc] = useState(false)
//
//     useEffect(() => {
//         setSucc(false)
//         if (props.img !== "" && props.img !== null) {
//             const xhr = new XMLHttpRequest();
//             xhr.open('GET', props.url + props.img);
//             xhr.responseType = 'arraybuffer';
//             xhr.onload = e => {
//                 const ifds = UTIF.decode(e.target.response);
//                 const firstPageOfTif = ifds[0];
//                 const tmp_ar = [];
//                 var index = 0;
//                 for (let tmp of ifds) {
//                     UTIF.decodeImage(e.target.response, ifds[index], ifds);
//                     const rgba = UTIF.toRGBA8(tmp);
//                     const imageWidth = firstPageOfTif.width;
//                     const imageHeight = firstPageOfTif.height;
//                     const cnv = document.createElement('canvas');
//                     cnv.width = imageWidth;
//                     cnv.height = imageHeight;
//                     const ctx = cnv.getContext('2d');
//                     const imageData = ctx.createImageData(imageWidth, imageHeight);
//                     for (let i = 0; i < rgba.length; i++) {
//                         imageData.data[i] = rgba[i];
//                     }
//                     ctx.putImageData(imageData, 0, 0);
//                     const cur = Canvas2image.convertToPNG(cnv, 400, 300)
//                     tmp_ar.push(cur.src)
//                     index += 1;
//                 }
//                 setArray(tmp_ar);
//                 setSucc(true)
//             };
//             xhr.send();
//         }
//     }, [props.url, props.img])
//
//
//     const handleExport = () => {
//         fetch(props.url + props.img, {
//             method: "GET", headers: {'Authorization': `Bearer ${localStorage.getItem('access')}`}
//         })
//             .then(response => {
//                 response.arrayBuffer().then(function (buffer) {
//                     const url = window.URL.createObjectURL(new Blob([buffer]));
//                     const link = document.createElement("a");
//                     link.href = url;
//                     link.setAttribute("download", "image.tiff"); //or any other extension
//                     document.body.appendChild(link);
//                     link.click();
//                 });
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     };
//     return (<div>
//         {!succ &&
//             <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
//                  alignContent={'center'} sx={{minHeight: 300}}>
//
//                 <CircularProgress variant="indeterminate" {...props}/> </Box>}
//         {succ && <Box component={""} container direction={'column'} alignItems={'center'} sx={{paddingBottom: 1}}>
//             <Button onClick={handleExport} sx={{
//                 backgroundColor: '#ffffff', marginBlock: 0.5, marginInline: 0.5, '& svg': {
//                     fontSize: 30, color: '#4fb3ea'
//                 }, fontStyle: {
//                     fontFamily: "Roboto", color: '#4fb3ea'
//                 },
//                 '&:focus': {backgroundColor: '#4fb3ea'},
//                 '&:hover': {
//                     backgroundColor: '#2c608a'
//                 },
//             }}>
//                 <Icon icon="fluent:save-20-filled"/>
//                 Сохранить
//             </Button>
//             <Swiper
//                 modules={[Navigation, Pagination]}
//                 pagination={{
//                     type: "fraction",
//                 }}
//                 navigation={true}
//                 speed={800}
//                 allowTouchMove={false}
//                 slidesPerView={1}
//                 ref={ref}
//             >
//                 {imgArray.map((item) => <SwiperSlide className={'mySwiper'}> <SlideComponent
//                     img={item}></SlideComponent> </SwiperSlide>)}
//             </Swiper>
//         </Box>
//         }
//         <div id={'stage'}></div>
//
//     </div>);
// }

const TiffImageComponent = (props) => {
    const [imgArray, setArray] = useState([]);
    const [succ, setSucc] = useState(false)
    const [tool, setTool] = useState('polygon')
    const [type, setType] = useState('png')
    const [length, setLength] = useState(0)
    const [sidebar, setSideBar] = useState(false)
    const handleChangeTool = () => {
        if(tool === 'polygon'){
            setTool("rect")
        }
        else{
            setTool("polygon")
        }
    }
    useEffect( () => {
        console.log(props.img)
        console.log(props.url)
        console.log(props.link1)
        if (props.img !== "" && props.img !== null) {
            if (props.img.split('.')[1] === 'tiff' || props.img.split('.')[1] === 'tif') {
                setType('tiff')
                const tmp_ar = [];
                var i = 1
                while (i <= props.image_count){
                    tmp_ar.push({type: 'image', url: props.slide_template[0]+'/'+ props.slide_template[1]+i+props.slide_template[2]})
                    i++
                }
                console.log(tmp_ar)
                setArray(tmp_ar);
                setLength(tmp_ar.length)
                setSucc(true)
            } else {
                setSucc(true)
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
    return (
        <div>
            <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                 alignContent={'center'}>

                {/*<Button variant={'outlined'} sx={{marginY: 2, color: '#4fb3ea'}} alt={'Сменить инструмент'} onClick={handleChangeTool}>*/}
                {/*    {tool === 'polygon'? <BiShapePolygon size={'2em'}/> : <BiRectangle size={'2em'}/>}*/}
                {/*</Button>*/}
                {/*<Button variant={'outlined'} sx={{marginY: 2,marginX:1, color: '#4fb3ea'}} onClick={handleExport}>*/}
                {/*    <AiOutlineSave size={'2em'}/>*/}
                {/*</Button>*/}
                <Button className={'sixth-step'} component={Link} to={`update/`} variant={'outlined'} sx={{marginY: 2,marginX:1, color: '#194964', borderRadius:10, borderColor: '#194964'}}>
                    Изменить результаты
                </Button>
            </Box>
            {!succ &&
                <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                     alignContent={'center'} sx={{minHeight: 600}}>
                    <CircularProgress variant="indeterminate" sx={{color:'#4fb3ea'}} {...props}/> </Box>}

            <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                 alignContent={'center'} sx={{height: !succ? 20:600, visibility: !succ? 'hidden': 'visible'}}>
                <OpenSeadragonViewer sidebar={sidebar} type={type} image={props.img.split('.')[1] === 'tiff' || props.img.split('.')[1] === 'tif'? imgArray : {type: "image", url: props.img}} url={props.url} seg={props.seg} boxes={props.boxes} tool={tool} imageid={props.imageid} length={length} date={props.date}/>
            </Box>
            {/*  //      <Box component={""} container direction={'column'} alignItems={'center'} sx={{paddingBottom: 1}}>*/}
            {/*  //      <Button onClick={handleExport} sx={{*/}
            {/*  //          backgroundColor: '#ffffff', marginBlock: 0.5, marginInline: 0.5, '& svg': {*/}
            {/*  //              fontSize: 30, color: '#4fb3ea'*/}
            {/*  //          }, fontStyle: {*/}
            {/*  //             fontFamily: "Roboto", color: '#4fb3ea'*/}
            {/*  //          },*/}
            {/*  //          '&:focus': {backgroundColor: '#4fb3ea'},*/}
            {/*  //          '&:hover': {*/}
            {/*  //             backgroundColor: '#2c608a'*/}
            {/*  //         },*/}
            {/*  //     }}>*/}
            {/*  //         <Icon icon="fluent:save-20-filled"/>*/}
            {/*  //          Сохранить*/}
            {/*  //      </Button>*/}
            {/*  //*/}
            {/*  // </Box>*/}
            {/*}*/}

            {/*<div id={'stage'}></div>*/}
        </div>
    );
}
const getStyles = () => ({
    clickableCard: {
        style: {
            height: 'auto',
            width: '1000',
            margin: '0px',
            padding: '0px'
        }
    },
    cardStyle: {
        style: {
            width: '400',
            height: 'auto',
            shadowBlur: 20,
            backgroundColor: '#ffffff',

        },
        containerStyle: {
            width: 400,
            height: '100%',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
        }
    },
});
const Gallery = (props) => {
    //const styles = getStyles();
    //const originalSwiperRef = useRef(null);
    // const segSwiperRef = useRef(null);
    // const boxSwiperRef = useRef(null);
    // const [predictedTypes, setPred] = useState([])
    const link1 = props.link1 !== null && props.link1 !== "" ? props.link1 : ""


    // useEffect(() => {
    //     const originalSwiper = originalSwiperRef?.current?.swiper;
    //     const boxSwiper = segSwiperRef?.current?.swiper;
    //     const segSwiper = boxSwiperRef?.current?.swiper;
    //     if (originalSwiper?.controller && segSwiper?.controller && boxSwiper?.controller) {
    //         originalSwiper.controller.control = [boxSwiper, segSwiper];
    //         segSwiper.controller.control = [originalSwiper, boxSwiper];
    //         boxSwiper.controller.control = [segSwiper, originalSwiper];
    //     }
    // }, []);

    // useEffect(() => {
    //     if (link2 === "" || link2 === null || link3 === "" || link3 === null) {
    //         const interval = setInterval(() => {
    //             axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
    //             axios.get(props.url + "/uzi/" + props.props + "/?format=json").then(
    //                 (response) => {
    //                     setLink2(response.data.images.segmentation.image !== null && response.data.images.segmentation.image !== "" ? response.data.images.segmentation.image : "")
    //                     setLink3(response.data.images.box.image !== null && response.data.images.box.image !== "" ? response.data.images.box.image : "")
    //                     var tmpTirads = [];
    //                     var secondTmpTirads = []
    //                     secondTmpTirads.push(parseFloat(response.data.info.details.nodule_1), parseFloat(response.data.info.details.nodule_2), parseFloat(response.data.info.details.nodule_3), parseFloat(response.data.info.details.nodule_4), parseFloat(response.data.info.details.nodule_5))
    //                     secondTmpTirads.sort(function (a, b) {
    //                         return a - b;
    //                     })
    //                     const indexes = {1: true, 2: true, 3: true, 4: true, 5: true}
    //                     secondTmpTirads.reverse()
    //                     for (let a of secondTmpTirads) {
    //                         if ((a === parseFloat(response.data.info.details.nodule_1)) && indexes[1]) {
    //                             tmpTirads.push(a + '% - EU-TIRADS 1')
    //                             indexes[1] = false
    //                         } else if ((a === parseFloat(response.data.info.details.nodule_2)) && indexes[2]) {
    //                             tmpTirads.push(a + '% - EU-TIRADS 2')
    //                             indexes[2] = false
    //                         } else if ((a === parseFloat(response.data.info.details.nodule_3)) && indexes[3]) {
    //                             tmpTirads.push(a + '% - EU-TIRADS 3')
    //                             indexes[3] = false
    //                         } else if ((a === parseFloat(response.data.info.details.nodule_4)) && indexes[4]) {
    //                             tmpTirads.push(a + '% - EU-TIRADS 4')
    //                             indexes[4] = false
    //                         } else if ((a === parseFloat(response.data.info.details.nodule_5)) && indexes[5]) {
    //                             tmpTirads.push(a + '% - EU-TIRADS 5')
    //                             indexes[5] = false
    //                         }
    //                     }
    //                     setPred(tmpTirads)
    //                 }
    //             )
    //         }, 5000);
    //         return () => clearInterval(interval);
    //     }
    //
    // }, [link3, link2]);
    return (
        <div>
            {
                (props.link1 !== null && props.link1 !== "") &&
                <TiffImageComponent url={props.url} img={link1} seg={props.seg} imageid={props.imageid} date={props.date} image_count={props.image_count} slide_template={props.slide_template}/>
            }
            {(props.link1 === null || props.link1 === "") &&
                <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'} justifyContent={'center'}
                     alignContent={'center'} sx={{minHeight: 600}}>
                    {/*<CircularProgress variant="indeterminate" sx={{color:'#4fb3ea'}} {...props}/> */}
                </Box>
            }
            {/*<Box component={""} sx={{*/}
            {/*    justifyItems: 'center',*/}
            {/*    alignItems: 'center',*/}
            {/*    marginBlockStart: 0*/}
            {/*}}>*/}
            {/*<GlobalStyles styles={{*/}
            {/*    h2: {color: 'dimgray', fontSize: 18, fontFamily: "Roboto", fontWeight: 'normal'},*/}
            {/*}}/>*/}
            {/*<h5 style={{color: 'dimgray', fontSize: 18, fontWeight: 'normal'}}>Определенный искуственным интеллектом*/}
            {/*    тип узла: </h5>*/}
            {/*<Chip label={predictedTypes[0]} variant={'outlined'}*/}
            {/*      sx={{color: '#4FB3EAFF', fontWeight: 'normal', borderColor: '#4FB3EAFF', marginInline: 1}}>*/}
            {/*    /!*<h5 style={{color: '#4FB3EAFF', fontWeight: 'normal'}}>{}</h5>*!/*/}
            {/*</Chip>*/}
            {/*<GlobalStyles styles={{*/}
            {/*    h5: {color: 'dimgray', fontSize: 18, fontFamily: "Roboto", fontWeight: 'lighter'}*/}
            {/*}}/>*/}
            {/*<Chip label={predictedTypes[1]} variant={'outlined'} sx={{marginInline: 1}}>*/}
            {/*    /!*<h5 color={'#417bbe'}>{} </h5>*!/*/}
            {/*</Chip>*/}
            {/*<Chip label={predictedTypes[2]} variant={'outlined'} sx={{marginInline: 1}}>*/}
            {/*    /!*<h5>{} </h5>*!/*/}
            {/*</Chip>*/}
            {/*</Box>*/}
            {/*<Card*/}
            {/*    style={styles.cardStyle.style}*/}
            {/*    sx={{width: 1000}}*/}
            {/*    containerStyle={Object.assign(styles.cardStyle.containerStyle, props.containerStyle)}>*/}


            {/*</Card>*/}


            {/*<Grid component={""} item>*/}
            {/*    <Card*/}
            {/*        style={styles.cardStyle.style}*/}
            {/*        sx={{width: 400, minHeight: 300}}*/}
            {/*        containerStyle={Object.assign(styles.cardStyle.containerStyle, props.containerStyle)}>*/}
            {/*        {(link2.split('.')[1] === 'tiff' || link2.split('.')[1] === 'tif') &&*/}
            {/*            <TiffImageComponent url={props.url} img={link2} ref={segSwiperRef}/>}*/}
            {/*        {link2.split('.')[1] === 'png' &&*/}
            {/*            <ImageComponent url={props.url} img={link2} number={props.number} type={props.type}/>}*/}
            {/*        {link2 === "" &&*/}
            {/*            <Box component={""} display={'flex'} dir={'column'} alignItems={'center'} justifyItems={'center'}*/}
            {/*                 justifyContent={'center'} alignContent={'center'} sx={{minHeight: 300}}>*/}

            {/*                <CircularProgress variant="indeterminate"*/}
            {/*                                  disableShrink*/}
            {/*                                  sx={{*/}
            {/*                                      marginInline: 2,*/}
            {/*                                      color: '#4FB3EAFF',*/}
            {/*                                      animationDuration: '550ms',*/}
            {/*                                      [`& .${circularProgressClasses.circle}`]: {*/}
            {/*                                          strokeLinecap: 'round',*/}
            {/*                                      },*/}
            {/*                                  }}*/}
            {/*                                  size={40}*/}
            {/*                                  thickness={4}*/}
            {/*                                  {...props}/> <Typography component={""} variant="h7"*/}
            {/*                                                           color="text.secondary">{'Снимок анализируется'}</Typography>*/}
            {/*            </Box>}*/}
            {/*    </Card>*/}
            {/*</Grid>*/}
            {/*<Grid component={""} item>*/}
            {/*    <Card*/}
            {/*        style={styles.cardStyle.style}*/}
            {/*        sx={{width: 400, minHeight: 300}}*/}
            {/*        containerStyle={Object.assign(styles.cardStyle.containerStyle, props.containerStyle)}>*/}
            {/*        {(link3.split('.')[1] === 'tiff' || link3.split('.')[1] === 'tif') &&*/}
            {/*            <TiffImageComponent url={props.url} img={link3} ref={boxSwiperRef}/>}*/}
            {/*        {link3.split('.')[1] === 'png' &&*/}
            {/*            <ImageComponent url={props.url} img={link3} number={props.number} type={props.type}/>}*/}
            {/*        {link3 === "" && <Box component={""} display={'flex'} alignItems={'center'} justifyItems={'center'}*/}
            {/*                              justifyContent={'center'} alignContent={'center'} sx={{minHeight: 300}}>*/}
            {/*            <CircularProgress variant="indeterminate"*/}
            {/*                              disableShrink*/}
            {/*                              sx={{*/}
            {/*                                  marginInline: 2,*/}
            {/*                                  color: '#4FB3EAFF',*/}
            {/*                                  animationDuration: '550ms',*/}
            {/*                                  [`& .${circularProgressClasses.circle}`]: {*/}
            {/*                                      strokeLinecap: 'round',*/}
            {/*                                  },*/}
            {/*                              }}*/}
            {/*                              size={40}*/}
            {/*                              thickness={4}*/}
            {/*                              {...props}/> <Typography component={""} variant="h7"*/}
            {/*                                                       color="text.secondary">{'Снимок анализируется'}</Typography></Box>}*/}
            {/*    </Card>*/}
            {/*</Grid>*/}
        </div>
    );
};
export default Gallery;