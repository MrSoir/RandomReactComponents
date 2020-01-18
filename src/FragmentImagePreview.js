import React, { useState, useEffect, useRef } from 'react';
import {FragmentAnmiator} from './FragmentImage';
import EasingFunctions from './EasingFunctions';
import './FragmentImagePreview.scss';

function genFadingComponent(component, x=50, y=50, vertFadeIn=false){
  return {
    component,
    x,
    y,
    fadeInOffsX: (vertFadeIn ? 0 : -10),
    fadeInOffsY: (vertFadeIn ? -10 : 0),
  };
}

function AnimatedLabel({label, fadeInDelay=0, fadeOutDelay, fadeIn, fadeOut}){
  const labelRef = useRef();

  function validNumb(x){
    return !(x === undefined || x === null);
  }

  const FADE_IN_OFFS_X = validNumb(label.fadeInOffsX) ? label.fadeInOffsX :   0;
  const FADE_IN_OFFS_Y = validNumb(label.fadeInOffsY) ? label.fadeInOffsY : -10;
  const FADE_OUT_OFFS_X = FADE_IN_OFFS_X * -2;
  const FADE_OUT_OFFS_Y = FADE_IN_OFFS_Y * -2;

  if(fadeOutDelay === undefined || fadeOutDelay === null){
    fadeOutDelay = fadeInDelay;
  }

  function animatePosition(sx,sy, ex,ey, sop, eop){
    const lbl = labelRef.current;
    let totalDuration = 1000;
    let elpsd = 0;
    let st = new Date().getTime();
    function animPos(){
      let ct = new Date().getTime();
      elpsd = ct - st;
      let prgrs = elpsd / totalDuration;
      let easedPrgrs = EasingFunctions.easeOutCubic( prgrs );
      let tx = sx + (ex - sx) * easedPrgrs;
      let ty = sy + (ey - sy) * easedPrgrs;
      let top = sop + (eop - sop) * EasingFunctions.easeOutQuart( prgrs );
      lbl.style.left = '' + tx + '%';
      lbl.style.top  = '' + ty + '%';
      lbl.style.opacity = '' + top;
    }
    function runAnimPos(){
      const lbl = labelRef.current;
      animPos();
      if(elpsd < totalDuration){
        requestAnimationFrame(runAnimPos);
      }else{
        lbl.style.left = '' + ex + '%';
        lbl.style.top  = '' + ey + '%';
        lbl.style.opacity = '' + eop;
      }
    }
    runAnimPos();
  }

  function fadeInAnim(){
    const lbl = labelRef.current;
    const [x,y] = [label.x, label.y];
    setTimeout(()=>{
      animatePosition(x+FADE_IN_OFFS_X, y+FADE_IN_OFFS_Y,   x, y, 0, 1);
    }, fadeInDelay);
  }
  function fadeOutAnim(){
    const [x,y] = [label.x, label.y];
    setTimeout(()=>{
      animatePosition(x, y,    x+FADE_OUT_OFFS_X, y+FADE_OUT_OFFS_Y,   1, 0);
    }, fadeOutDelay);
  }

  useEffect(()=>{
    // const cssFontSize = '' + label.fontSize + 'px';
    // labelRef.current.style.fontSize = cssFontSize;
  }, []);
  useEffect(()=>{
    if(fadeIn){
      fadeInAnim();
    }else if(fadeOut){
      fadeOutAnim();
    }
  }, [fadeIn, fadeOut]);

  return (
    <div className="AnimatedLabelFIP"
         ref={labelRef}>
      {label.component}
    </div>
  );
}

function PositionedPreviewLabels({imgLabels, previewId,
                                  fadeIn, fadeOut}){
  const FADE_IN_DELAY  = 500;
  const FADE_OUT_DELAY = 250;
  let cumulFadeInDelay = 0;
  let cumulFadeOutDelay = imgLabels ? FADE_OUT_DELAY * (imgLabels.length-1) : 0;

  const labelDivs = imgLabels
        ? imgLabels[previewId].map((label)=>{
            cumulFadeInDelay  += FADE_IN_DELAY;
            cumulFadeOutDelay -= FADE_OUT_DELAY;
            return (
              <AnimatedLabel label={label}
                             fadeInDelay={cumulFadeInDelay}
                             fadeOutDelay={cumulFadeOutDelay}
                             fadeIn={fadeIn}
                             fadeOut={fadeOut}
              />
            );
          })
        : '';
  return (
    <div className="PositionedPreviewLabelsFIP">
        {labelDivs}
    </div>
  );
}
function FragmentImagePreview({imgPaths, imgLabels}){
  const [previewId, setPreviewId] = useState(0);
  const [labelFadeInOut, setLabelFadeInOut] = useState([false, false]);
  const [initialized, setInitialized] = useState(false);

  useEffect(()=>{
    setInitialized(true);
  }, []);

  function incrementPreviewId(){
    if(initialized){
      setPreviewId( (previewId + 1) % imgLabels.length );
    }
  }

  const imageTimeoutDuration = 5000;

  return (
    <div className="MainFIP">
      <div className="PreviewFIP">
        <FragmentAnmiator imgPaths={imgPaths}
                          imageTimeoutDuration={imageTimeoutDuration}
                          onImageEasedIn={()=>{
                            incrementPreviewId();
                            setLabelFadeInOut( [true, false] );
                            setTimeout(()=>{
                              setLabelFadeInOut( [false, true] );
                            }, imageTimeoutDuration - 250);
                          }}
        />
      </div>
      <div className="FragmentAnimatorFIP">
        <PositionedPreviewLabels imgLabels={imgLabels}
                                 previewId={previewId}
                                 fadeIn ={labelFadeInOut[0]}
                                 fadeOut={labelFadeInOut[1]}
        />
      </div>
    </div>
  );
}

export {FragmentImagePreview, genFadingComponent};
