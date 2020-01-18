import React, {useEffect, useState, useRef} from 'react';
import './DropDownMenu.scss';


function DropDownMenu({
    showDropDown,
    dropDownActivated,
    suggestions,
    onSuggestionClicked
}){
    const dropDownCls = 'DropDownDivINPT' 
        + (showDropDown ? ' displayed' : ' hidden')
        + (dropDownActivated ? ' activated' : ' disabled');
    return (
        <div className={dropDownCls}
        >
            {suggestions.map((sgstn, id)=>{
                return (
                    <div 
                        className="DropDownEelementINPT"
                        key={id}
                        onClick={()=>onSuggestionClicked(id)}
                    >
                        {sgstn}
                    </div>
                );
            })}
        </div>
    );
}

export default DropDownMenu;