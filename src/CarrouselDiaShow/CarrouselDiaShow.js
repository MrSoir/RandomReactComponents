import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import './CarrouselDiaShow.css';


class CarrouselDiaShow extends Component{
  constructor(props){
    super(props);

    this.setHiddenImagePaths = this.setHiddenImagePaths.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
    this.autoplay = this.autoplay.bind(this);

    this.ROTATION_DURATION = 1000;
    this.AUTOPLAY_TIMEOUT  = 5000;
    this.DEFAULT_ASPECT_RATIO = [4,3];

    this.imgs = [React.createRef(),
                 React.createRef(),
                 React.createRef(),
                 React.createRef(),
                 React.createRef()];

    this.mainDiv = React.createRef();

    this.centralImg = 1;
    this.centralImgPathId = 0;
    this.isUpdating = false;
  }
  componentDidMount(){
    const imgPaths = this.props.imgPaths;
    this.imgs[0].current.src = imgPaths[imgPaths.length-1];
    this.imgs[1].current.src = imgPaths[0];
    this.imgs[2].current.src = imgPaths[1];

    this.imgs.forEach(img=>img.current.style.transitionDuration = '' + this.ROTATION_DURATION/1000 + 's');

    this.layoutImgs();

    setTimeout(this.autoplay, this.AUTOPLAY_TIMEOUT);
  }
  componentWillUnmount(){
    // exit autoplay-timeout-loop:
    this.exitAutoplay = true;
  }
  autoplay(){
    if(this.exitAutoplay){
      return;
    }
    if(this.props.autoplay){
      this.rotateLeft();
    }
    setTimeout(this.autoplay, this.AUTOPLAY_TIMEOUT);
  }
  allowedToSpinCarrousel(){
    if(this.isUpdating){
      return false;
    }
    this.isUpdating = true;
    setTimeout( (()=>{this.isUpdating = false}).bind(this), this.ROTATION_DURATION * 0.5);
    return true;
  }
  setHiddenImagePaths(){
    let leftLeftImgId = this.evalLeftLeftId();
    let rightrightImgId = this.evalRightRightId();

    let nextNextImgPath = this.evalNextNextPath();
    let prevPrevImgPath = this.evalPrevPrevPath();

    this.setImagePath(leftLeftImgId, prevPrevImgPath);
    this.setImagePath(rightrightImgId, nextNextImgPath);
  }
  setLeftRightImagesSelectable(){
    this.imgs.forEach((img, i)=>{
      img.current.classList.remove('selectableCDS');
    });

    let leftId = this.evalLeftId();
    let rightId = this.evalRightId();
    this.imgs[leftId].current.classList.add('selectableCDS');
    this.imgs[rightId].current.classList.add('selectableCDS');
  }
  rotateLeft(){
    console.log('rotateLeft: oldCentralImgId: ', this.centralImg);
    if(!this.allowedToSpinCarrousel()){
      return;
    }
    this.incrementCentralIds();
    this.layoutImgs();
  }
  rotateRight(){
    console.log('rotageRight: centralId: ', this.centralImg);
    if(!this.allowedToSpinCarrousel()){
      return;
    }
    this.decrementCentralIds();
    this.layoutImgs();
  }
  setImagePath(imgId, imgPath){
    this.imgs[imgId].current.src = imgPath;
  }
  incrementCentralIds(){
    this.centralImg = (this.centralImg + 1) % this.imgs.length;
    this.centralImgPathId = (this.centralImgPathId + 1) % this.props.imgPaths.length;
  }
  decrementCentralIds(){
    let oldVal = this.centralImg;
    this.centralImg -= 1;
    if(this.centralImg < 0){
      this.centralImg = this.imgs.length - 1;
    }
    console.log('decrementCentralIds: oldCentralImg: ', oldVal, ' newCentralImg: ', this.centralImg);

    this.centralImgPathId -= 1;
    if(this.centralImgPathId < 0){
      this.centralImgPathId = this.props.imgPaths.length - 1;
    }
  }
  layoutImgs(){
    let id = this.centralImg;

    let leftId = this.evalLeftId();
    let leftLeftId = this.evalLeftLeftId();

    let rightId = this.evalRightId();
    let rightRightId = this.evalRightRightId();

    console.log('layoutImgs - centralId: ', id,
                'leftId: ', leftId,
                'leftLeftId: ', leftLeftId,
                'rightId: ', rightId,
                'rightRightId: ', rightRightId);

    this.layoutCentralImg(id);
    this.layoutRightImg( rightId );
    this.layoutLeftImg( leftId );
    this.layoutBackgroundImg( rightRightId );
    this.layoutBackgroundImg( leftLeftId );

    this.setHiddenImagePaths();
    this.setLeftRightImagesSelectable();
  }
  evalAspectRatio(tarWidthFrctn = 0.8){
    let mainDiv = this.mainDiv.current;
    let mdw = mainDiv.offsetWidth;
    let mdh = mainDiv.offsetHeight;

    let [xratio, yratio] = this.props.aspectRatio ? this.props.aspectRatio : this.DEFAULT_ASPECT_RATIO;
    let [aspectWidth, aspectHeight] = [0,0];

    aspectWidth = tarWidthFrctn * 100;
    aspectHeight = (mdw * tarWidthFrctn / xratio * yratio) / mdh * 100;
    if(aspectHeight > 100){
      aspectHeight = 100;
      aspectWidth = (mdh / yratio * xratio) / mdw * 100;
    }

    return [aspectWidth, aspectHeight];
  }
  genCentralLayout(){
    let aspectRatio = this.evalAspectRatio(0.6);
    let style = {
      zIndex: '2',
      left: '50%',
      height: '' + aspectRatio[1] + '%',
      width:  '' + aspectRatio[0] + '%',
      transform: 'translate(-50%, -50%)',
      // opacity: '1'
    };
    return style;
  }
  genLeftLayout(){
    let aspectRatio = this.evalAspectRatio(0.4);
    let style = {
      zIndex: '1',
      left: '20%',
      height: '' + aspectRatio[1] + '%',
      width:  '' + aspectRatio[0] + '%',
      transform: 'translate(-50%, -40%)',
      // opacity: '1'
    };
    return style;
  }
  genRightLayout(){
    let aspectRatio = this.evalAspectRatio(0.4);
    let style = {
      zIndex: '1',
      left: '80%',
      height: '' + aspectRatio[1] + '%',
      width:  '' + aspectRatio[0] + '%',
      transform: 'translate(-50%, -60%)',
      // opacity: '1'
    };
    return style;
  }
  genBackgroundLayout(){
    let aspectRatio = this.evalAspectRatio(0.4);
    let style = {
      zIndex: '0',
      left: '50%',
      height: '' + aspectRatio[1] + '%',
      width:  '' + aspectRatio[0] + '%',
      transform: 'translate(-50%, -50%)',
      // opacity: '0'
    };
    return style;
  }
  layoutCentralImg(id){
    this.setLayoutToImg(id, this.genCentralLayout());
  }
  layoutRightImg(id){
    this.setLayoutToImg(id, this.genRightLayout());
  }
  layoutLeftImg(id){
    this.setLayoutToImg(id, this.genLeftLayout());
  }
  layoutBackgroundImg(id){
    this.setLayoutToImg(id, this.genBackgroundLayout());
  }
  setLayoutToImg(imgId, style){
    let img = this.imgs[imgId].current;
    Object.assign(img.style, style);
  }
  onImgClicked(id){
    let leftId = this.evalLeftId();
    let rightId = this.evalRightId();
    let centralId = this.centralId;
    console.log('id: ', id, ' centralImg: ', this.centralImg, '  leftId: ', leftId, '  rightId: ', rightId);
    if(id === this.evalLeftId()){
      this.rotateRight();
    }else{
      this.rotateLeft();
    }
  }
  evalLeftId(){
    return this.evalLeftOffsetId(1);
    // return (this.centralImg - 1) < 0 ? 2 : this.centralImg - 1;
  }
  evalRightId(){
    return this.evalRightOffsetId(1);
  }
  evalLeftLeftId(){
    return this.evalLeftOffsetId(2);
  }
  evalRightRightId(){
    return this.evalRightOffsetId(2);
  }
  evalLeftOffsetId(offset){
    let x = this.centralImg - offset;
    while(x < 0){
      x = this.imgs.length + x;
    }
    return x;
  }
  evalRightOffsetId(offset){
    return (this.centralImg + offset) % this.imgs.length;
  }
  evalPrevPath(){
    return this.props.imgPaths[this.evalPrevPathId()];
  }
  evalPrevPathId(){
    return this.evalPrevPathIdOffset(1);
    // return (this.centralImgPathId - 1) < 0 ? this.props.imgPaths.length - 1 : this.centralImgPathId - 1;
  }
  evalPrevPrevPath(){
    return this.props.imgPaths[this.evalPrevPrevPathId()];
  }
  evalPrevPrevPathId(){
    return this.evalPrevPathIdOffset(2);
  }
  evalNextPath(){
    return this.props.imgPaths[this.evalNextPathId()];
  }
  evalNextPathId(){
    return this.evalNextPathIdOffset(1);
    // return (this.centralImgPathId + 1) % this.props.imgPaths.length;
  }
  evalNextNextPath(){
    return this.props.imgPaths[this.evalNextNextPathId()];
  }
  evalNextNextPathId(){
    return this.evalNextPathIdOffset(2);
  }
  evalPrevPathIdOffset(offset){
    let x = this.centralImgPathId - offset;
    while(x < 0){
      x = this.props.imgPaths.length + x;
    }
    return x;
  }
  evalNextPathIdOffset(offset){
    return (this.centralImgPathId + offset) % this.props.imgPaths.length;
  }
	render(){
    console.log('rendering CDS');
		return (
			<div className="CDS"
           ref={this.mainDiv}>
        <img ref={this.imgs[0]}
             className="ImgCDS"
             onClick={()=>{this.onImgClicked(0);}}
        />
        <img ref={this.imgs[1]}
             className="ImgCDS"
             onClick={()=>{this.onImgClicked(1);}}
        />
        <img ref={this.imgs[2]}
             className="ImgCDS"
             onClick={()=>{this.onImgClicked(2);}}
        />
        <img ref={this.imgs[3]}
             className="ImgCDS"
             onClick={()=>{this.onImgClicked(3);}}
        />
        <img ref={this.imgs[4]}
             className="ImgCDS"
             onClick={()=>{this.onImgClicked(4);}}
        />
			</div>
		);
	}
}

export default withRouter(CarrouselDiaShow);
