import React from 'react';
import { useEffect, useState } from "react";
import OpenSeaDragon from "openseadragon";
import '../styles/style.css'
import * as Annotorious from '@recogito/annotorious-openseadragon';
import SelectorPack from '@recogito/annotorious-selector-pack'
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import axios from "axios";
import BetterPolygon from '@recogito/annotorious-better-polygon';
import { fromGeoJSON, toGeoJSON } from 'svg-polygon-points';


// const boxColor = {A: 'green', B: 'blue', C: 'pink', D: 'yellow', E: 'orange'}
// const icons = {A: 'http://localhost:3000/home/right-arrow_green.png', B: 'http://localhost:3000/home/right-arrow_blue.png', C: 'http://localhost:3000/home/right-arrow_pink.png', D: 'http://localhost:3000/home/right-arrow_yellow.png', E: 'http://localhost:3000/home/right-arrow_orange.png'}
// const pages = [ 'example_1.json', 'example_1-3.json', 'example_1-4.json', 'example_1-5.json']

const OpenSeadragonViewerUpdater = ({image, boxes, tool, url, seg, type, imageid, length, group}) => {

    const [viewer, setViewer] = useState( null);
    const [anno, setAnno] = useState(null)
    const [info, setInfo] = useState({})
    const [closed, setClosed] = useState(true)
    var [tiffanno, setTiffAnno] = useState(new Array(image.length))
    const [groupId, setGroup] = useState(group)
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
            allowEmpty: true,
            //gigapixelMode: true,
            widgets: [
                'COMMENT',
                { widget: 'TAG', vocabulary: [ 'TI-RADS 1', 'TI-RADS 2', 'TI-RADS 3', 'TI-RADS 4', 'TI-RADS 5', 'Doctor result', 'AI'],  }
            ],
            //tools: ['polygon', 'rect'],
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

    useEffect(() => {
        const annotations = []
        let emptyFlag = false
        console.log(seg)
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
                        let flag = false
                        for (let item of tmp.body) {
                            if (item.value === group) {
                                flag = true
                            }
                        }
                        if (flag) {
                            anno.addAnnotation(tmp)
                        }
                    }
                }
            }
            if (type === 'tiff') {
                for (var cur of seg) {
                    if(cur.data.length !== 0) {
                        cur.data.sort((a, b) => a.id > b.id)
                    }
                    if(cur.data.length === 0){
                        emptyFlag = true
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
                        emptyFlag = false
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
                            let flag = false
                            for(let item of tmp.body){
                                if(item.value === group){
                                    flag = true
                                }
                            }
                            if(flag) {
                                anno.addAnnotation(tmp)
                            }
                        }
                    }
                }
            }
        }
        else{
            setClosed(false)
            if(!closed) {
                alert("Прогнозирование еще не окончено.\nПосетите страницу результата позже.")
                setClosed(true)
            }
        }
        if(emptyFlag && seg.size === 1){
            let i = 0
            let tmp = []
            while (i<image.length){
                tmp.push([])
                i++
            }
            setTiffAnno([...tmp])
        }

    }, [anno, closed, length, seg, type])


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
        console.log("image")
        if (image !== null){
            const viewer_tmp = initOpenseadragon()
            initializeAnnotations(viewer_tmp)
        }
    },[image]);

    const handleOverlay = () => {
        setTimeout(() => {
            BetterPolygon(anno);
            if(viewer && tiffanno.length !== 0 && type === 'tiff') {
                viewer.removeAllHandlers('page')
                viewer.addHandler('page', handleAnnotations)
            }
        })
    }

    function handleAnnotations (){
        console.log(tiffanno)
        if(type === "tiff" && viewer && anno) {
            const num = viewer.currentPage()
            anno.clearAnnotations()
            if (tiffanno.length !== 0) {
                for (let tmp of tiffanno[num]) {
                    let flag = false
                    for (let item of tmp.body) {
                        if (item.value === group) {
                            flag = true
                        }
                    }
                    if (flag) {
                        anno.addAnnotation(tmp)
                    }
                }
            }
        }
        // if(type === "png") {
        //     anno.clearAnnotations()
        //     if (tiffanno.length !== 0) {
        //         for (let tmp of tiffanno) {
        //             let flag = false
        //             for (let item of tmp.body) {
        //                 if (item.value === group) {
        //                     flag = true
        //                 }
        //             }
        //             if (flag) {
        //                 anno.addAnnotation(tmp)
        //             }
        //         }
        //     }
        // }
    }
    useEffect(() => {
        console.log(tiffanno)
        setTimeout(() => {
            //anno.loadAnnotations('http://localhost:3000/home/example_1.json');
            if(viewer && type === 'tiff') {
                viewer.removeAllHandlers('page')
                viewer.addHandler('page', handleAnnotations)
            }
        })
    }, [tiffanno])

    useEffect(() => {
        if(viewer && anno) {
            if(type === "tiff") {
                console.log(tiffanno)
                setTimeout(() => {
                    if(viewer) {
                        viewer.removeAllHandlers('page')
                        viewer.addHandler('page', handleAnnotations)
                    }
                })
                const num = viewer.currentPage()
                anno.clearAnnotations()
                if (tiffanno.length !== 0) {
                    for (let tmp of tiffanno[num]) {
                        let flag = false
                        for (let item of tmp.body) {
                            if (item.value === group) {
                                flag = true
                            }
                        }
                        if (flag) {
                            anno.addAnnotation(tmp)
                        }
                    }
                }
            }
            if(type === "png") {
                console.log(tiffanno)
                anno.clearAnnotations()
                if (tiffanno.length !== 0) {
                    for (let tmp of tiffanno) {
                        let flag = false
                        for (let item of tmp.body) {
                            if (item.value === group) {
                                flag = true
                            }
                        }
                        if (flag) {
                            anno.addAnnotation(tmp)
                        }
                    }
                }
            }
        }

    }, [group])



    useEffect(() => {
        if(anno) {
            anno.off('createAnnotation');
            anno.off('updateAnnotation');
            anno.off('deleteAnnotation');
            anno.on('createAnnotation', async function (annotation, overrideId) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                annotation.body=[...annotation.body, {
                    type: "TextualBody",
                    value: group,
                    purpose: "group"
                }]
                annotation.body = [...annotation.body, {
                    type: "TextualBody",
                    value: "Doctor result",
                    purpose: "tagging"
                }]
                console.log(annotation)
                const data = Object()
                data.points = []
                data.segment_group = group
                if (tool === 'polygon') {
                    let cur = toGeoJSON(annotation.target.selector.value.split('"')[1])
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
                }
                if(viewer) {
                    if(type === "tiff") {
                        let num = viewer.currentPage()
                        console.log(tiffanno)
                        var tmp = [...tiffanno]
                        tmp[num].push(annotation)
                        setTiffAnno(tmp)
                        //tiffanno.splice(num,1,[...tiffanno[num], annotation])
                        setTimeout(() => {
                            if(viewer) {
                                viewer.removeAllHandlers('page')
                                viewer.addHandler('page', handleAnnotations)
                            }
                        })
                        anno.clearAnnotations()
                        if (tiffanno.length !== 0) {
                            for (let tmp of tiffanno[num]) {
                                let flag = false
                                for (let item of tmp.body) {
                                    if (item.value === group) {
                                        flag = true
                                    }
                                }
                                if (flag) {
                                    anno.addAnnotation(tmp)
                                }
                            }
                        }
                    }
                    else {
                        anno.clearAnnotations()
                        let cur2 = [...tiffanno]
                        let cur = [...tiffanno, annotation]
                        setTiffAnno([...tiffanno, annotation])
                        if (tiffanno.length !== 0) {
                            for (let tmp of cur) {
                                let flag = false
                                for (let item of tmp.body) {
                                    if (item.value === group) {
                                        flag = true
                                    }
                                }
                                if (flag) {
                                    anno.addAnnotation(tmp)
                                }
                            }
                        }
                    }
                }
                if(group !== 0) {
                    axios.post(url + '/uzi/segment/add/', data).then((response) => {
                        overrideId(response.data.id)
                    }).catch((response) => {
                        // console.log(response)
                    })
                }
            });
            anno.on('updateAnnotation', async function (annotation, previous) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                let tmp = Object()
                tmp.segment_group = group
                tmp.points = []
                let cur = toGeoJSON(annotation.target.selector.value.split('"')[1])
                //console.log(cur)
                for (let item of cur[0]) {
                    tmp.points.push({x: parseInt(item[0]), y: parseInt(item[1]), z: viewer.currentPage()})
                }
                if(type === "png") {
                    tiffanno.splice(tiffanno.findIndex(val => val.id === previous.id),1, annotation)
                }
                else {
                    tiffanno[viewer.currentPage()].splice([tiffanno[viewer.currentPage()].findIndex(val => val.id === previous.id)], 1, annotation)
                }
                if(viewer) {
                    viewer.removeAllHandlers('page')
                    viewer.addHandler('page', handleAnnotations)
                }
                console.log(tmp)
                axios.put(url + '/uzi/segment/update/' + annotation.id+'/', tmp).then((response) => {
                    // console.log(response.data)
                })
            });
            anno.on('deleteAnnotation', async function (annotation) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                var index = 0
                var tmp = [...tiffanno]
                if(type === "png") {
                    tiffanno.splice(tiffanno.findIndex(val => val.id === annotation.id),1)
                }
                else {
                    for (let item of tmp[viewer.currentPage()]) {
                        if (item.id === annotation.id) {
                            tmp[viewer.currentPage()].splice(index, 1)
                            setTiffAnno(tmp)
                        }
                        index++
                    }
                }
                console.log(annotation.id)
                await axios.delete(url + '/uzi/segment/update/' + annotation.id).then((response) => {
                })
            });
        }
    }, [anno, group])



    useEffect(() => {
        if (viewer && type!== 'png'){
            handleOverlay()
        }
    }, [viewer])


    return (
        <div>
            <div id="openseadragon">
            </div>
        </div>

    );
}

export default OpenSeadragonViewerUpdater;

