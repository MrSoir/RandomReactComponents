import React, {useEffect, useState, useRef} from 'react';
import ArrowDown from './arrowDown.png';
import './FreeInput.scss';



function FreeInput({type='text',
                    label='label',
                    placeholder='input required...'
}){
    const inputRef = useRef();

    const [missingInputCls, setMissingInputCls] = useState(' MissingInput');

    useEffect(()=>{

    }, []);

    function inputChanged(e){
        const inpt = e.target;
        const txt = inpt.value;

        setMissingInputCls( txt ? '' : ' MissingInput');        
    }

    const vertBordersCls = 'VertBorderFREEINPUT' + missingInputCls;
    const inputCls       = 'InputFREEINPT'       + missingInputCls;
    return (
        <div className="MainFREEINPT">
            <div className="LabelFREEINPT">
                {label}
            </div>
            <div className="BorderedInputDivFREEINPUT">
                <div className={vertBordersCls}></div>
                <input
                    type={type}
                    ref={inputRef}
                    className={inputCls}
                    placeholder={placeholder}
                    onChange={inputChanged}
                />
                <div className={vertBordersCls}></div>
            </div>
        </div>
    );
}

export default FreeInput;