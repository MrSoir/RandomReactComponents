import React, { Component } from 'react';
import * as THREE from 'three';
import './WaitingBar.css';

function toTwoDigitHexString(x){
	let s = x.toString(16);
	if(s.length === 1){
		s = '0' + s;
	}
	return s;
}

class Color extends THREE.Vector3{
	static fromRGB(r=0, g=0, b=0){
		return new Color(r,g,b);
	}
	mixColor(color, progress=0.5){
		let mixed = this.clone().add( color.clone().sub(this).multiplyScalar(progress) );
		
		let mixedCol = new Color(mixed.x, mixed.y, mixed.z);
		console.log('color0: ', this, 'color1: ', color, '	mixed: ', mixedCol, '	progress: ', progress);
		return mixedCol;
	}
	toHexString(){
		let rs = toTwoDigitHexString(Math.floor(this.x));
		let gs = toTwoDigitHexString(Math.floor(this.y));
		let bs = toTwoDigitHexString(Math.floor(this.z));
		let colHex =  rs + gs + bs;
		console.log('colHex: ', colHex);
		return colHex;
	}
}
class WaitingBar extends Component{
	constructor(props){
		super(props);
		
		this.nextFrame = this.nextFrame.bind(this);
		
		this.canvas = React.createRef();
	}
	goToArduinoHomepage(){
	}

   componentDidMount(){
   	this.ctx = this.canvas.current.getContext('2d');
   	this.ctx.fillStyle = '#00ff00';
		this.ctx.strokeStyle = '#0000ff';
		
		this.selectedFillColor = !!this.props.selectedFillColor ?
											this.selectedFillColor : 
											new Color(0, 255, 0);
		this.selectedStrokeColor = !!this.props.strokeColor ? 
								 this.props.strokeColor : 
								 new Color(0, 255 ,0);
		this.fillColor = !!this.props.fillColor ? 
								 this.props.fillColor : 
								 new Color(150,150,150);
		this.strokeColor = !!this.props.strokeColor ? 
								 this.props.strokeColor : 
								 this.fillColor;//new Color(0,0,0);
		
		this.fragmentCount = !!this.props.fragmentCount ? this.props.fragmentCount : 10;
		this.fragmentPadding = !!this.props.fragmentPadding ? this.props.fragmentPadding : (Math.PI * 2 / 300);
		
		this.initRotation = 0;
		this.rotation = this.initRotation;
		this.rotationSpeed = 0;
		this.curRotationSpeedIncrmnt = 0;
		this.rotationSpeedIncrmnt = 0.01;
		this.maxRotationSpeed = 0.002;
		
		this.scaleSpeed = 0.005;
		this.minScale = 0.9;
		this.maxScale = 1.0;
		this.scale = this.maxScale;
		this.curScaleIncrmnt = 0;
		
		this.selectedId = 0;
		this.selectedIdProgress = 0;
		this.progressSpeed = 0.03;
		
		this.setCanvasSize({
			width: 1000,
			height: 800
		});
   	
		this.nextFrame();
	}
	nextFrame(loop=true){
	  	this.drawWaitingBar();
   	this.incrementProgress();
   	if(loop && !this.props.stop){
   		window.requestAnimationFrame(this.nextFrame);
   	}
	}
	incrementProgress(){
		this.selectedIdProgress += this.progressSpeed;
		if(this.selectedIdProgress > 1){
			this.selectedIdProgress = 0;
			this.selectedId = (this.selectedId + 1) % this.fragmentCount;
		}
		
		this.rotation = (this.rotation + this.rotationSpeed) % (Math.PI * 2);
/*		this.curRotationSpeedIncrmnt = this.curRotationSpeedIncrmnt + this.rotationSpeedIncrmnt ;
		this.rotationSpeed = Math.sin( this.curRotationSpeedIncrmnt ) * this.maxRotationSpeed;*/
		
		this.curScaleIncrmnt = (this.curScaleIncrmnt + this.scaleSpeed) % 1;
		this.scale = (this.maxScale + this.minScale) * 0.5 + (this.maxScale - this.minScale) * Math.sin(this.curScaleIncrmnt * Math.PI * 2) * 0.5;
	}
	drawWaitingBar(){
		this.clearCanvas();
		this.drawCircleFragments();
	}
	clearCanvas(){
		this.ctx.clearRect(0,0, this.ctx.width, this.ctx.height);
	}
	setCanvasSize(size){
		this.ctx.width = size.width;
		this.ctx.height = size.height;
		this.clearCanvas();
	}
	drawCircleFragments(){
		if(!this.ctx){
			// canvas not set yet
			return;
		}
		this.ctx.fillStyle = '#00ff00';
		this.ctx.strokeStyle = '#0000ff';
		
		let frgmnts = this.fragmentCount;
		let padding = this.fragmentPadding;
		let angleRange = ((Math.PI * 2) - (padding * frgmnts)) / frgmnts;
		let angle0 = 0;
		let angle1 = 0;
		
		for(let i=0; i < frgmnts; ++i){
			this.setFragmentColor(i);
			angle0 = i * (angleRange + padding) + this.rotation;
			angle1 = angle0 + angleRange;
			this.drawCirleFragment(angle0 , angle1);
		}
	}
	setFragmentColor(fragmentId){
		if(fragmentId === this.selectedId){
			let progress = Math.sin(this.selectedIdProgress * Math.PI);
			let selProgrCol = this.fillColor.mixColor(this.selectedFillColor, progress);
			this.ctx.fillStyle = '#' + selProgrCol.toHexString();
			
			let selStrkCol = this.strokeColor.mixColor(this.selectedStrokeColor, progress);
			this.ctx.strokeStyle = '#' + selStrkCol.toHexString();
		}else{
			this.ctx.fillStyle = '#' + this.fillColor.toHexString();
			this.ctx.strokeStyle = '#' + this.strokeColor.toHexString();
		}
	}
	drawCirleFragment(angle0, angle1){
		let ctx = this.ctx;
		
		let outerRad = this.props.outerRadius * this.scale;
		let innerRad = this.props.innerRadius * this.scale;
		
		let center = [ctx.width * 0.5, ctx.height * 0.5];
		
		let p0 = [center[0] + Math.cos(angle0) * innerRad, center[1] + Math.sin(angle0) * innerRad];
		let p1 = [center[0] + Math.cos(angle0) * outerRad, center[1] + Math.sin(angle0) * outerRad];
		let p2 = [center[0] + Math.cos(angle1) * outerRad, center[1] + Math.sin(angle1) * outerRad];
		let p3 = [center[0] + Math.cos(angle1) * innerRad, center[1] + Math.sin(angle1) * innerRad];
		
		ctx.beginPath();
		ctx.moveTo(p0[0], p0[1]);
		ctx.lineTo(p1[0], p1[1]);
		ctx.lineTo(p2[0], p2[1]);
		ctx.lineTo(p3[0], p3[1]);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	render(){
		return (
			<div className="WaitingBar">				
				<canvas className="WaitingBarCanvas"
							 width="1000" height="800"
						  ref={this.canvas}>
				</canvas>
			</div>
		);
	}
}

export default WaitingBar;

