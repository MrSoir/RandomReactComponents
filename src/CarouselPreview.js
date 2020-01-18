import React, { useState, useEffect, useRef } from 'react';
import Carousel from './CarouselCanvas/Carousel';
import './CarouselPreview.scss';


function CarouselPreview({imgPaths}){
    const [run, setRun] = useState(true);
    const [imgRatio, setImgRatio] = useState({
        w: 5,
        h: 3
    });

    function onLoaded(){
        console.log('images loaded!');
    }
    function onSelectedImgIdChanged(id){
        console.log('onSelectedImgIdChanged: ', id);
    }
    return (
        <div className="MainCP">
            <Carousel 
                imgPaths={imgPaths}
                run={run}
                onLoaded={onLoaded}
                imgRatio={imgRatio}
                onSelectedImgIdChanged={onSelectedImgIdChanged}
            />
        </div>
    );
}

export default CarouselPreview;
