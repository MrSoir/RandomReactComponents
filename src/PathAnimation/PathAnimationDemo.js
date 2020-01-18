import React, { Component, useState, useEffect, useRef } from 'react';
import PathAnimation from './PathAnimation';
import './PathAnimationDemo.scss';

function PathAnimationDemo({}){
    const canvas = useRef();
    const pathAnimation = useRef();

    useEffect(()=>{
        pathAnimation.current = new PathAnimation({
            canvas: canvas.current
        });

        window.addEventListener('resize', onCanvasResized);
        return ()=>{
            window.removeEventListener('resize', onCanvasResized);
        }
    }, []);

    function onCanvasResized(){
        pathAnimation.current.resize();
    }

    return (
        <div className="MainPAD">
            <canvas 
                id="CanvasPAD"
                ref={canvas}
            />
        </div>
    )
}

export default PathAnimationDemo;