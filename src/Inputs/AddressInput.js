import React, {useEffect, useState, useRef} from 'react';
import ArrowDown from './arrowDown.png';
import DropDownMenu from './DropDownMenu';
import './AddressInput.scss';


async function genAddressTestResults(str){
    let xs = [];

    const genAddress = (label, value)=>{return {label, value}};

    xs.push( genAddress('TOWN NAME', 'LAS ROZAS') );
    xs.push( genAddress('ALTERNATIVE TOWN NAME', 'ROZAS') );
    xs.push( genAddress('CITY', 'MADRID') );
    xs.push( genAddress('ALTERNATIVE CITY', 'MADRID') );
    xs.push( genAddress('PROVINCE', 'MADRID') );
    xs.push( genAddress('SQM', '--') );

    return xs;
}

function Address({label, value}){
    return (
        <div className="MainADRSINPT">
            <div className="LabelADRSINPT">
                {label}
            </div>
            <div className="ValueADRSINPT">
                {value}
            </div>
        </div>
    );
}

function AddressInput({
    type='text',
    placeholder='input required...',
}){
    const [suggestions, setSuggestions] = useState([]);

    useEffect(()=>{
        genAddressTestResults()
            .then(suggestions=>{
                if(suggestions){
                    generateSuggestionTags(suggestions);
                }
            })
            .catch(err=>{
                console.error(err);
            });
    }, []);

    function generateSuggestionTags(sgstns){
        const sgstnsTags = sgstns.map((sgstn, id)=>{
            return ({
                label: sgstn.value,
                value: sgstn,
                tag: (<Address
                    key={id}
                    label={sgstn.label}
                    value={sgstn.value}
                />)
            });
        });
        setSuggestions(sgstnsTags);
    }

    return (
        <InputTemplate
            type={type}
            placeholder={placeholder}
            suggestions={suggestions}
        />
    );
}

function InputTemplate({
    type='text', // possible values: 'text', 'password'
    placeholder='input required...',
    suggestions,
    inputDisabled=true
}){
    const inputRef = useRef();

    const [showDropDown, setShowDropDown] = useState(false);
    const [dropDownActivated, setDropDownActivated] = useState(true);
    const [missingInputCls, setMissingInputCls] = useState(' MissingInput');
    const [userSelection, setUserSelection] = useState(null);

    useEffect(()=>{
        setDropDownActivated( !!suggestions && suggestions.length );
    }, [suggestions]);
    useEffect(()=>{
        setMissingInputCls(!!userSelection ? '' : ' MissingInput');
    }, [userSelection]);

    function inputChanged(e){
        const inpt = e.target;
        const txt = inpt.value;

        setMissingInputCls( txt ? '' : ' MissingInput');
    }
    function onSuggestionClicked(id){
        inputRef.current.value = suggestions[id].label;
        setUserSelection(suggestions[id].value);
        setShowDropDown(false);
    }
    function onArrowDownClicked(){
        onOpenDropDownMenuClicked();
    }
    function inputClicked(){
        onOpenDropDownMenuClicked();
    }
    function onOpenDropDownMenuClicked(){
        if(dropDownActivated && !showDropDown){
            setShowDropDown(true);
        }
    }

    const arrowBtnCls = 'ArrowDownDivINPT'
        + (dropDownActivated ? ' activated' : ' disabled')
        + missingInputCls;
    
    const inputCls = 'InputINPT' + missingInputCls;

    const suggestionTags = suggestions.map(sgstn=>sgstn.tag);

    return (
        <div className="MainINPT">
            <div className='InputDivINPT'
                 onClick={inputClicked}
            >
                <input
                    type={type}
                    ref={inputRef}
                    className={inputCls}
                    placeholder={placeholder}
                    onChange={inputChanged}
                    disabled={!!inputDisabled}
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



export default AddressInput;