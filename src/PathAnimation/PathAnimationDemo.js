import React, { Component, useState, useEffect, useRef } from 'react';
import PathAnimation from './PathAnimation';
import './PathAnimationDemo.scss';

function PathAnimationDemo({}){
    const canvas  = useRef();
    const mainRef = useRef();
    const pathAnimation = useRef();

    useEffect(()=>{
        let pa = new PathAnimation({
            canvas: canvas.current
        });

        let stats = pa.stats;
        mainRef.current.appendChild(stats.dom);

        pathAnimation.current = pa;


        window.addEventListener('resize', onCanvasResized);
        return ()=>{
            window.removeEventListener('resize', onCanvasResized);
        }
    }, []);

    function onCanvasResized(){
        pathAnimation.current.resize();
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

export default PathAnimationDemo;