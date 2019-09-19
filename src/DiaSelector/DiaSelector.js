import React, { Component } from 'react';
import './DiaSelector.css';


class DiaSelector extends Component{
	constructor(props){
		super(props);
		
		this.previewBarDSRef 	  = React.createRef();
		this.previewBarShowBtnRef = React.createRef();
		this.mainWindowRef 		  = React.createRef();
		
		this.onOverPreviewBarShowBtn = this.onOverPreviewBarShowBtn.bind(this);
		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		
		this.state = {
			showPreviewBar: true,
			imgPaths: this.evalImagePaths()
		};
	}
   componentDidMount(){
   	
	}
	onOverPreviewBarShowBtn(){
		let showPreviewBar = !this.state.showPreviewBar;
		
		console.log('showPreviewBar: ', showPreviewBar);
		
		let previewBarDSRef = this.previewBarDSRef.current;
		let previewBarShowBtnRef = this.previewBarShowBtnRef.current;
		
		if(showPreviewBar){
			previewBarDSRef.style.width = '300px';
			previewBarShowBtnRef.style.opacity = '0';
			setTimeout(()=>{
				previewBarShowBtnRef.innerHTML = '⮜';
				previewBarShowBtnRef.style.opacity = '1';
			}, 500);
		}else{
			previewBarDSRef.style.width = '0px';
			previewBarShowBtnRef.style.opacity = '0';
			setTimeout(()=>{
				previewBarShowBtnRef.innerHTML = '⮞';
				previewBarShowBtnRef.style.opacity = '1';
			}, 500);
		}
		
		this.setState({showPreviewBar});
	}
	evalImagePaths(){
		let imgBaseURI = process.env.PUBLIC_URL + '/pics/hippos/';
		let imgPaths = []
		for(let i=0; i < 6; ++i){
			imgPaths.push( imgBaseURI + 'HippoPreview' + i + '.jpg' );
		}
		return imgPaths;
	}
	onPreviewClicked(id){
		console.log('id: ', id);
		let mainWindowRef = this.mainWindowRef.current;
		mainWindowRef.style.opacity = '0';
		mainWindowRef.style.transform = 'scale(0)';
		setTimeout(()=>{
			this.setMainContent(id);
			mainWindowRef.style.opacity = '1';
			mainWindowRef.style.transform = 'scale(1)';
		}, 500);
	}
	setMainContent(id){
		let mainWindowRef = this.mainWindowRef.current;
		mainWindowRef.innerHTML = 'Preview # ' + id;
	}
	render(){
		return (
			<div className="DiaSelector">
				<div className="PreviewBarDS"
					  ref={this.previewBarDSRef}>
					<div className="PreviewBarImgContainerDS">
						<div className="PreviewBarImgFlexDS">
							{this.state.imgPaths.map((imgPath,id)=>{
								return <img className="PreviewImgDS"
												onClick={()=>{this.onPreviewClicked(id)}} 
												src={imgPath} 
												width={'80%'} 
												height={'150px'}/>;
							})}
						</div>
					</div>
				</div>
				<div className="PreviewBarShowBtn">
						<div className="PreviewBarShowBtnTxt"
							  ref={this.previewBarShowBtnRef}
							  onMouseOver={()=>{if(!window.mobilecheck()){this.onOverPreviewBarShowBtn();}}}
							  onClick    ={()=>{if( window.mobilecheck()){this.onOverPreviewBarShowBtn();}}}>
							⮜
						</div>
				</div>
				<div className="MainWindowContainerDS">
					<div className="MainWindowDS"
						  ref={this.mainWindowRef}>
						  Preview # 0
					</div>
				</div>
			</div>
		);
	}
}

export default DiaSelector;

