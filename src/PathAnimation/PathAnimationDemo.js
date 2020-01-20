import React, { Component, useState, useEffect, useRef } from 'react';
import {Switch, Route, withRouter} from "react-router-dom";
// import PathAnimation from './PathAnimation';
// import MrSoirAnimation from './MrSoirAnimation';
// import HeartAnimation from './HeartAnimation';
import MrSoirHeartAnimation from './MrSoirHeartAnimation';
// import WelcomeMrSoirAnimation from './WelcomeMrSoirAnimation';

import './PathAnimationDemo.scss';

function PathAnimationDemo({}){
    const canvas  = useRef();
    const mainRef = useRef();
    const pathAnimation = useRef();

    useEffect(()=>{
        let pa = new MrSoirHeartAnimation({
            canvas: canvas.current
        });

        let stats = pa.stats;
        mainRef.current.appendChild(stats.dom);

        pathAnimation.current = pa;

        window.addEventListener('resize', onCanvasResized);
        window.addEventListener('orientationchange', onCanvasResized);

        return ()=>{
            window.removeEventListener('resize', onCanvasResized);
            window.removeEventListener('orientationchange', onCanvasResized);
        }
    }, []);

    function onCanvasResized(){
        let cnvs = canvas.current;
        let main = mainRef.current;
        const size = {
            w: main.offsetWidth,
            h: main.offsetHeight
        };
        let ratio = size.w / size.h;
        if(ratio < 4/3){
            size.h = size.w / (4/3);
            cnvs.style.width  = `${size.w}px`;
            cnvs.style.height = `${size.h}px`;
        }else{
            cnvs.style.width  = `100%`;
            cnvs.style.height = `100%`;
        }
        pathAnimation.current.resize(size);
    }

    return (
        <div className="MainPAD"
             ref={mainRef}>
            <canvas 
                id="CanvasPAD"
                ref={canvas}
            />
        </div>
    )
}

// export default PathAnimationDemo;
export default withRouter(PathAnimationDemo);
