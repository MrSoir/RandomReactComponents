import React, {useEffect, useState, useRef} from 'react';
import './PathTracker.scss';
import img from './Welcome.png';

function Point({p, pointClicked}){

    const rad = 3;

    const style = {
        left: `${p.x - rad}px`,
        top:  `${p.y - rad}px`
    };

    return (
        <div
            className="PointTRCKR"
            width
            onClick={pointClicked}
            style={style}
        >
        </div>
    )
}

function PathTracker({imgPath=''}){
    const [pnts, setPnts] = useState([]);

    useEffect(()=>{
        console.log('pnts changed:');
        console.log(pnts.map(p=>[p.x,p.y]));
        console.log(evalRelPoints());
    }, [pnts]);

    function evalRelPoints(){
        return pnts.map(p=>{
            return [
                (p.x - 250) / 250,
                (p.y - 250) / 250,
            ];
        });
    }

    function relPosition(e){
        const element = e.target;

        let px = e.pageX;
        let py = e.pageY;
        let ex = element.offsetLeft;
        let ey = element.offsetTop;

        let x = px - ex;
        let y = py - ey;

        return {x,y};
    }

    function pointClicked(e, id){
        e.stopPropagation();

        console.log('point clicked');

        pnts.splice(id, 1);
        setPnts( [...pnts] );

        return false;
    }
    function canvasClicked(e){
         const pos = relPosition(e);
         addPoint(pos);
    }
    function addPoint(pos){
        // console.log('pos: ', pos);
        pnts.push(pos);
        setPnts( [...pnts] );
    }
    function clear(){
        setPnts( [] );
    }

    return (
        <div className="MainTRCKR">
            <div className="TrackerTRCKR">
                <img 
                    className="ImgTRCKR"
                    src={img}
                />
                <div
                    className="PointsTRCKR"
                    onClick={canvasClicked}
                >
                    {pnts.map((p,id)=>{
                        return (
                            <Point
                                p={p}
                                key={id}
                                pointClicked={(e)=>{pointClicked(e, id)}}
                            />
                        );
                    })}
                </div>
            </div>
            <button onClick={clear}
            >
                clear
            </button>
            <div className="ArraysTRCKR">
                {evalRelPoints().map((p, id)=>{
                    return (
                        <div className="">
                            {`${p[0]}, ${p[1]}, 0,`}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PathTracker;