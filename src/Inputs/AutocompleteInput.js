import React, {useEffect, useState, useRef} from 'react';
import ArrowDown from './arrowDown.png';
import DropDownMenu from './DropDownMenu';
import './AutocompleteInput.scss';


function genTestResults(str){
    let xs = [];
    for(let i=0; i < Math.floor(3 + Math.random()*4); ++i){
        let s = str;
        for(let r=0; r < Math.floor(3 + Math.random() * 4); ++r){
            s += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        xs.push( s );
    }
    return xs;
}

function HighlightedString({str, refStr}){
    let toHighlightCount = 0;
    for(let i=0; i < Math.min(str.length, refStr.length); ++i){
        if(str.charAt(i) === refStr.charAt(i)){
            toHighlightCount = i;
        }else{
            break;
        }
    }

    const toHghlght    = str.substring(0, toHighlightCount+1);
    const notToHghlght = str.substring(toHighlightCount+1, str.length);
    return (
        <span className="MainHighlightedStringINPT">
            <span className="HighlightedStrINPT">
                {toHghlght}
            </span>
            <span className="NotHighlightedStrINPT">
                {notToHghlght}
            </span>
        </span>
    );
}

function AutocompleteInput({type='text', // possible values: 'text', 'password'
                placeholder='input required...'},
                inputType='address'
                ){
    const inputRef = useRef();

    const [showDropDown, setShowDropDown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [dropDownActivated, setDropDownActivated] = useState(false);
    const [missingInputCls, setMissingInputCls] = useState(' MissingInput');

    function genAndDisplayTestResults(){
        const testRslts = genTestResults('Nila');
        console.log('testRstls: ', testRslts);
        setTimeout(genAndDisplayTestResults, 2000);
    }

    function inputChanged(e){
        const inpt = e.target;
        const txt = inpt.value;

        setUserInput(txt);

        setMissingInputCls( txt ? '' : ' MissingInput');

        if(txt.length < 3){
            setSuggestions([]);
            setShowDropDown( false );
            setDropDownActivated(false);
        }else{
            setSuggestions( genTestResults(txt) );
            setShowDropDown( true );
            setDropDownActivated(true);
        }
    }
    function onSuggestionClicked(id){
        inputRef.current.value = suggestions[id];
        setShowDropDown(false);
    }
    function onArrowDownClicked(){
        if(dropDownActivated){
            setShowDropDown(true);
        }
    }


    const arrowBtnCls = 'ArrowDownDivINPT'
        + (dropDownActivated ? ' activated' : ' disabled')
        + missingInputCls;
    
    const inputCls = 'InputINPT' + missingInputCls;

    const suggestionTags = suggestions.map((sgstn, id)=>{
        return (
            <HighlightedString
                key={id}
                str={sgstn}
                refStr={userInput}
            />
        );
    });

    return (
        <div className="MainINPT">
            <div className='InputDivINPT'>
                <input
                    type={type}
                    ref={inputRef}
                    className={inputCls}
                    placeholder={placeholder}
                    onChange={inputChanged}
                />
                <div className={arrowBtnCls}
                     onClick={onArrowDownClicked}
                >
                    <img src={ArrowDown}
                        className="ArrowDownINPT"
                    />
                </div>

                <DropDownMenu
                    showDropDown={showDropDown}
                    dropDownActivated={dropDownActivated}
                    suggestions={suggestionTags}
                    onSuggestionClicked={onSuggestionClicked}
                />
            </div>
        </div>
    );
}


export default AutocompleteInput;