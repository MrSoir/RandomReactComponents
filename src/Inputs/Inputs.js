import React, {useEffect, useState, useRef} from 'react';
import AutocompleteInput from './AutocompleteInput';
import FreeInput from './FreeInput';
import AddressInput from './AddressInput';
import './Inputs.scss';


function Inputs({}){

    return (
        <div className="MainINPTS">
            <div className="TextInputsDivINPTS">
                <div className="TextInputINPTS"
                    style={{zIndex: 5}}
                >
                    <AutocompleteInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 4}}
                >
                    <AutocompleteInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 3}}
                >
                    <AutocompleteInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 2}}
                >
                    <AutocompleteInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 1}}
                >
                    <AutocompleteInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 0}}
                >
                    <AutocompleteInput/>
                </div>
            </div>

            <div className="TextInputsDivINPTS">
                <div className="TextInputINPTS">
                    <FreeInput/>
                </div>
                <div className="TextInputINPTS">
                    <FreeInput/>
                </div>
                <div className="TextInputINPTS">
                    <FreeInput/>
                </div>
                <div className="TextInputINPTS">
                    <FreeInput/>
                </div>
                <div className="TextInputINPTS">
                    <FreeInput/>
                </div>
                <div className="TextInputINPTS">
                    <FreeInput/>
                </div>
            </div>

            <div className="TextInputsDivINPTS">
                <div className="TextInputINPTS"
                    style={{zIndex: 5}}
                >
                    <AddressInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 4}}
                >
                    <AddressInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 3}}
                >
                    <AddressInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 2}}
                >
                    <AddressInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 1}}
                >
                    <AddressInput/>
                </div>
                <div className="TextInputINPTS"
                    style={{zIndex: 0}}
                >
                    <AddressInput/>
                </div>
            </div>

            <div className="PufferINPTS"></div>

        </div> 
    );
}

export default Inputs;