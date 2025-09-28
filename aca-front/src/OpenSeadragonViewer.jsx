import React from 'react';
import { useEffect, useState } from "react";
import OpenSeaDragon from "openseadragon";
import '../styles/style.css'
import  Annotorious from '@recogito/annotorious-openseadragon';
import SelectorPack from '@recogito/annotorious-selector-pack'
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import axios from "axios";
import BetterPolygon from '@recogito/annotorious-better-polygon';
import { fromGeoJSON, toGeoJSON } from 'svg-polygon-points';


// const boxColor = {A: 'green', B: 'blue', C: 'pink', D: 'yellow', E: 'orange'}
// const icons = {A: 'http://localhost:3000/home/right-arrow_green.png', B: 'http://localhost:3000/home/right-arrow_blue.png', C: 'http://localhost:3000/home/right-arrow_pink.png', D: 'http://localhost:3000/home/right-arrow_yellow.png', E: 'http://localhost:3000/home/right-arrow_orange.png'}
// const pages = [ 'example_1.json', 'example_1-3.json', 'example_1-4.json', 'example_1-5.json']

const OpenSeadragonViewer = ({image, boxes, tool, url, seg, type, imageid, length, sidebar, date}) => {

    const [viewer, setViewer] = useState( null);
    const [anno, setAnno] = useState(null)
    const [info, setInfo] = useState({})
    const [closed, setClosed] = useState(true)
    var [tiffanno, setTiffAnno] = useState([])
    const initOpenseadragon = () => {
        viewer && viewer.destroy()
        const viewwr_tmp = OpenSeaDragon({
            id: "openseadragon",
            prefixUrl: "/static/front/openseadragon-images/",
            tileSources: image,
            sequenceMode: true,
            showNavigator: false,
            showFullPageControl: false,
            showHomeControl: false,
            showZoomControl: false,
            //showReferenceStrip: true,
            //errorText: "Снимок загружается",
            // zoomPerScroll: 1.2,
            // animationTime: 1,
            // blendTime: 0.01,
            // constrainDuringPan: true,
            // maxZoomPixelRatio: 2,
            // minZoomLevel: 1,
            // visibilityRatio: 1,
        })
        setViewer(
            viewwr_tmp
        );
        return viewwr_tmp
    };
    const initializeAnnotations = (viewer) => {
        anno && anno.destroy()
        const annotateState = Annotorious(viewer, {
            //locale: 'en',
            //allowEmpty: true,
            //gigapixelMode: true,
            readOnly: true,
            widgets: [
                'COMMENT',
                { widget: 'TAG', vocabulary: [ 'TI-RADS 1', 'TI-RADS 2', 'TI-RADS 3', 'TI-RADS 4', 'TI-RADS 5', 'Doctor result', 'AI'],  }
            ], tools: ['ellipse', 'freehand', 'point'],
            formatter});
        annotateState.setDrawingTool('polygon')
        SelectorPack(annotateState)
        // annotateState.setDrawingTool('ellipse')
        setAnno(annotateState)
    }
    useEffect(() => {
        if (anno !== null) {
            anno.setDrawingTool(tool)
        }
    }, [anno, tool])

    useEffect(()=>{
        const annotations = []

        var date1 = new Date();
        var date2 = new Date(date);


        var timestamp1 = date1.getTime();
        var timestamp2 = date2.getTime();

        var difference = timestamp1 - timestamp2;

        var daysDifference = Math.floor(difference / (1000 * 60));

        console.log('Разница в минутах:', daysDifference);
        if(seg !== null && seg.length !== 0) {
            if (type === 'png') {
                for (var cur2 of seg) {
                    if (cur2.data.length === 0) {
                        continue
                    }
                    for (var item of cur2.data) {
                        var coord = []
                        for (let cur of item.points) {
                            coord.push([cur.x, cur.y])
                        }
                        let cur = fromGeoJSON(coord).toString()
                        let str = "<svg><polygon points=\"" + cur + "\"></polygon></svg>"
                        annotations.push(
                            {
                                type: "Annotation",
                                body: [
                                    {
                                        type: "TextualBody",
                                        value: "TI-RADS 2-3: " + Number((cur2.details.nodule_2_3 * 100).toFixed(1)) + "%\n\nTI-RADS 4: " + Number((cur2.details.nodule_4 * 100).toFixed(1)) + "%\n\nTI-RADS 5: " + Number((cur2.details.nodule_5 * 100).toFixed(1)) + "%",
                                        purpose: "commenting"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur2.is_ai ? "AI only" : "Updated",
                                        purpose: "commenting"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: "TI-RADS " + cur2.details.nodule_type,
                                        purpose: "tagging"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur2.id,
                                        purpose: "group"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur2.is_ai ? "AI" : "Doctor result",
                                        purpose: "tagging"
                                    },
                                ],
                                target: {
                                    source: "http://localhost:3000/result/undefined",
                                    selector: {
                                        type: "SvgSelector",
                                        value: str,
                                    }
                                },
                                "@context": "http://www.w3.org/ns/anno.jsonld",
                                id: item.id.toString()
                            }
                        )
                    }
                }
                setTiffAnno([...annotations])
                if (anno) {
                    for (let tmp of annotations) {
                        anno.addAnnotation(tmp)
                    }
                }
            }
            if (type === 'tiff') {
                for (var cur of seg) {
                    if(cur.data.length !== 0) {
                        cur.data.sort((a, b) => a.id > b.id)
                    }
                    if(cur.data.length === 0){
                        continue
                    }
                    var previous = -1;
                    if (cur.data[0].points[0].z !== 0) {
                        var i = 0
                        while (i < cur.data[0].points[0].z) {
                            annotations.push([])
                            i++
                        }
                        previous = cur.data[0].points[0].z - 1
                    }
                    for (let item of cur.data) {
                        if (item.points[0].z !== previous + 1 && item.points[0].z !== previous) {
                            if(previous < item.points[0].z){
                                var i = 0
                                while (i < item.points[0].z - previous) {
                                    annotations.push([])
                                    i++
                                }
                                previous = item.points[0].z
                            }
                        }
                        var coord = []
                        var shot = item.points[0].z
                        if (annotations.length !== shot + 1) {
                            annotations.push([])
                        }
                        for (let tmp of item.points) {
                            coord.push([tmp.x, tmp.y])
                        }
                        let cur2 = fromGeoJSON(coord).toString()
                        let str = "<svg><polygon points=\"" + cur2 + "\"></polygon></svg>"
                        annotations[shot].push(
                            {
                                type: "Annotation",
                                body: [
                                    {
                                        type: "TextualBody",
                                        value: cur.is_ai? "TI-RADS 2-3: " + Number((item.details.nodule_2_3 * 100).toFixed(1)) + "%\n\nTI-RADS 4: " + Number((item.details.nodule_4 * 100).toFixed(1)) + "%\n\nTI-RADS 5: " + Number((item.details.nodule_5 * 100).toFixed(1)) + "%":"TI-RADS 2-3: " + Number((cur.details.nodule_2_3 * 100).toFixed(1)) + "%\n\nTI-RADS 4: " + Number((cur.details.nodule_4 * 100).toFixed(1)) + "%\n\nTI-RADS 5: " + Number((cur.details.nodule_5 * 100).toFixed(1)) + "%",
                                        purpose: "commenting"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur.is_ai? "AI only": "Updated",
                                        purpose: "commenting"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur.is_ai? "TI-RADS " + item.details.nodule_type:"TI-RADS " + cur.details.nodule_type,
                                        purpose: "tagging"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur.id,
                                        purpose: "group"
                                    },
                                    {
                                        type: "TextualBody",
                                        value: cur.is_ai? "AI": "Doctor result",
                                        purpose: "tagging"
                                    },
                                ],
                                target: {
                                    source: "http://localhost:3000/result/undefined",
                                    selector: {
                                        type: "SvgSelector",
                                        value: str,
                                    }
                                },
                                "@context": "http://www.w3.org/ns/anno.jsonld",
                                id: item.id.toString()
                            }
                        )
                        previous = item.points[0].z
                    }
                    if (annotations.length !== length) {
                        var j = annotations.length
                        var i = 0
                        while (i < length - j) {
                            annotations.push([])
                            i++
                        }
                    }
                    setTiffAnno([...annotations])
                    if (anno) {
                        for (let tmp of annotations[viewer.currentPage()]) {
                            anno.addAnnotation(tmp)
                        }
                    }
                }
            }
        }
        else{
            setClosed(false)

            if(!closed && daysDifference > 30) {
                alert("Прогнозирование еще не окончено.\nПосетите страницу результата позже.")
                setClosed(true)
            }
        }

    }, [anno, seg])


    const formatter = (annotation) => {
        const isA = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 1'
        });
        const isB = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 2'
        });
        const isC = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 3'
        });
        const isD = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 4'
        });
        const isE = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 5'
        });
        const isAI = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ai'
        });
        const isDOC = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'doctor result'
        });
        if (isDOC) {
            const isDOCA = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 1'
            });
            const isDOCB = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 2'
            });
            const isDOCC = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 3'
            });
            const isDOCD = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 4'
            });
            const isDOCE = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 5'
            });
            if (isDOCA) {
                return 'DOC-A';
            }
            if (isDOCB) {
                return 'DOC-B';
            }
            if (isDOCC) {
                return 'DOC-C';
            }
            if (isDOCD) {
                return 'DOC-D';
            }
            if (isDOCE) {
                return 'DOC-E';
            }
            return 'DOC';
        }
        if (isA) {
            return 'A';
        }
        if (isB) {
            return 'B';
        }
        if (isC) {
            return 'C';
        }
        if (isD) {
            return 'D';
        }
        if (isE) {
            return 'E';
        }
    }

    useEffect(() => {
        //console.log(image)
        if (image !== null){
            const viewer_tmp = initOpenseadragon()
            initializeAnnotations(viewer_tmp)
        }
    },[image]);

    var overlay = false;

    const handleOverlay = () => {
        setTimeout(() => {
            BetterPolygon(anno);
            //anno.loadAnnotations('http://localhost:3000/home/example_1.json');
            if(viewer) {
                viewer.addHandler('page', handleAnnotations)
            }
        })
        //console.log(anno.getAnnotations())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAnnotations = () => {
        const num = viewer.currentPage()
        anno.clearAnnotations()
        for (let tmp of tiffanno[num]) {
            anno.addAnnotation(tmp)
        }
    }
    useEffect(() => {
        if(anno) {
            anno.on('createAnnotation', async function (annotation, overrideId) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                //console.log(annotation)
                const data = Object()
                data.points = []
                for (let item of annotation.body) {
                    if (item.purpose === 'tagging') {
                        data.details = {
                            nodule_type: parseInt(item.value.split(' ')[1]),
                            nodule_2_3: 0,
                            nodule_4: 0,
                            nodule_5: 0,
                            nodule_width: 1,
                            nodule_height: 1,
                            nodule_length: 1
                        }
                    }
                }

                if (tool === 'polygon') {
                    let cur = toGeoJSON(annotation.target.selector.value.split('"')[1])
                    //console.log(cur)
                    for (let item of cur[0]) {
                        data.points.push({x: parseInt(item[0]), y: parseInt(item[1]), z: viewer.currentPage()})
                    }
                }
                if (tool === "rect") {
                    let cur = annotation.target.selector.value.split(':')[1].split(',')
                    data.points.push({x: parseInt(cur[0]), y: parseInt(cur[1]), z: viewer.currentPage()})
                    data.points.push({
                        x: parseInt(cur[0]) + parseInt(cur[2]),
                        y: parseInt(cur[1]),
                        z: viewer.currentPage()
                    })
                    data.points.push({
                        x: parseInt(cur[0]) + parseInt(cur[2]),
                        y: parseInt(cur[1]) + parseInt(cur[3]),
                        z: viewer.currentPage()
                    })
                    data.points.push({
                        x: parseInt(cur[0]),
                        y: parseInt(cur[1]) + parseInt(cur[3]),
                        z: viewer.currentPage()
                    })
                    //console.log(data.points)
                }
                //console.log(data)
                //console.log(url + '/uzi/segment/' + imageId)
                await axios.post(url + '/uzi/segment/' + imageid + '/', data).then((response) => {
                    // console.log(response)
                    overrideId(response.data.id)
                }).catch((response) => {
                    // console.log(response)
                })
            });
            anno.on('updateAnnotation', async function (annotation, previous) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                let details = Object()
                for (let item of annotation.body) {
                    if (item.purpose === 'tagging') {
                        details.nodule_type = parseInt(item.value.split(' ')[1])
                    }
                }

                // if (tool === 'polygon') {
                //     let cur = toGeoJSON(annotation.target.selector.value.split('"')[1])
                //     console.log(cur)
                //     for (let item of cur[0]) {
                //         data.points.push({x: parseInt(item[0]), y: parseInt(item[1]), z: viewer.currentPage()})
                //     }
                // }
                axios.patch(url + '/uzi/segment/' + imageid + '/' + annotation.id).then((response) => {
                        //console.log(response.data)
                        let tmp = Object()
                        tmp.details = response.data.details
                        tmp.details.nodule_type = details.nodule_type
                        axios.put(url + '/uzi/segment/' + imageid + '/' + annotation.id, tmp).then((response) => {
                            // console.log(response.data)
                        })
                    }
                );
            });
            anno.on('deleteAnnotation', async function (annotation) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                //console.log(url + '/uzi/segment/' + imageId + '/' + annotation.id)
                await axios.delete(url + '/uzi/segment/' + imageid + '/' + annotation.id).then((response) => {
                    // console.log(response.data)
                })
            });
        }
    }, [anno])


    const handleNewOverlay = () => {
        if(viewer){
            // console.log(anno.getAnnotations())
            //download(JSON.stringify(anno.getAnnotations()), 'example_1.json', 'json');
            if (boxes.category === 'A'){
                anno.loadAnnotations('http://localhost:3000/home/example_1.json');
            }
            if (boxes.category === 'B'){
                anno.loadAnnotations('http://localhost:3000/home/example_1-2.json');
            }
            if (boxes.category === 'C'){
                anno.loadAnnotations('http://localhost:3000/home/example_1-3.json');
            }
            if (boxes.category === 'D'){
                anno.loadAnnotations('http://localhost:3000/home/example_1-4.json');
            }
            if (boxes.category === 'E'){
                anno.loadAnnotations('http://localhost:3000/home/example_1-5.json');
            }
            // viewer.clearOverlays()
            // const boxCategory = boxes.category
            // boxes.boxes.forEach((box, index) => {
            //         const elt = document.createElement("div");
            //         elt.id = "category " + boxCategory + '_' + index;
            //         elt.className = "highlight";
            //         elt.style.border = 'solid'
            //         elt.style.borderColor = boxColor[boxCategory]
            //         elt.style.position = 'static'
            //         viewer.addOverlay({
            //             element: elt,
            //             location: new OpenSeaDragon.Rect(box.x, box.y, box.w*10/viewer.viewport._contentSize.x,box.h*10/viewer.viewport._contentSize.y),
            //         });
            //         const arrow = document.createElement("img");
            //         arrow.src = icons[boxCategory]
            //         arrow.alt = ''
            //         arrow.id = 'right-arrow'+ index
            //         viewer.addOverlay({
            //             // element: arrow,
            //             // location: new OpenSeaDragon.Point(box.x, box.y),
            //             // placement: OpenSeaDragon.Placement.RIGHT,
            //             // checkResize: true
            //     });

            //     }
            // )
        }

    }
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }


    useEffect(() => {
        if (viewer){
            handleOverlay()
        }
    }, [viewer])


    useEffect(() => {
        if (viewer){
            handleNewOverlay()
        }
    }, [boxes])

    return (
        <div>
            <div id="openseadragon">
            </div>
        </div>

    );
}

export default OpenSeadragonViewer;

