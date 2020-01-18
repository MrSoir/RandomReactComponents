import React, { Component } from 'react';
import CarrouselDiaShow from '../CarrouselDiaShow/CarrouselDiaShow';
import './CarrouselDiaShowRSC.css';


class CarrouselDiaShowRSC extends Component{
	constructor(props){
		super(props);

		this.state = {
			autoplay: true
		};
	}
  generateImagePaths(){
    // let imgGenerator = (id) => process.env.PUBLIC_URL + '/pics/testImgs/test' + id + '.png';
    let imgGenerator = (id) => process.env.PUBLIC_URL + '/pics/hippos/HippoPreview' + id + '.jpg';
    let imgPaths = [];
    for(let i=0; i < 6; ++i){
      imgPaths.push( imgGenerator(i) );
    }
    return imgPaths;
  }
	render(){
		const heading = 'Carrousel Dia Show';
		const description = <div>
			This is an advanced range slider. In addition to the range slider html tag,
			you can add a label that is rendered at the center of it.
			You can also add a reference value. This comes in handy when you,
			for example, need to display real time values like sensor data.
		</div>;

		return (
			<div id="CarrouselDiaShoMainDivwRSC">
				<div className="HeadingRSC">
					{heading}
				</div>
				<div className="DescriptionRSC">
					{description}
				</div>
				<CarrouselDiaShow imgPaths={this.generateImagePaths()}
                          autoplay={this.state.autoplay}
                          id="CarrouselDiaShowRSC"
        />
				<div className="SettingsCDS">

			</div>
		);
	}
}

export default CarrouselDiaShowRSC;
