import * as THREE from 'three';
import PathAnimation from './PathAnimation';
import InstancedSphere from './InstancedSphere';

class HeartAnimation extends  PathAnimation{
    constructor({canvas}={}){
        super({canvas, createHeart:false});

        this.updateHeartPath = this.updateHeartPath.bind(this);

        this.addAnimationCallback(this.updateHeartPath);
        this.pathTransitionProgress = 0;
        this.doTransition = 1;

        this.genHeart();
    }
    updateHeartPath(){

        // if( (this.hrtCntr % 20) === 0 ){
            let offs = 0.01;
            this.pathTransitionProgress += offs;
            this.heartIs.updateUniforms({
                pathTransitionProgress: 0.5 + Math.sin(this.pathTransitionProgress) * 0.5
            });

            // this.path = this.path.map(v=>{
            //     return new THREE.Vector3(v.x+offs, v.y, v.z);
            // });
            // this.heartIs.updatePath( this.path );
        // }
    }
    genSoirPath(sclFctr){
        let pnts = [
            0.46, -0.06, 0,
            0.464, -0.08, 0,
            0.46, -0.104, 0,
            0.452, -0.132, 0,
            0.424, -0.156, 0,
            0.388, -0.164, 0,
            0.344, -0.168, 0,
            0.296, -0.164, 0,
            0.252, -0.156, 0,
            0.208, -0.14, 0,
            0.172, -0.12, 0,
            0.144, -0.096, 0,
            0.132, -0.06, 0,
            0.14, -0.024, 0,
            0.164, 0.016, 0,
            0.188, 0.048, 0,
            0.216, 0.084, 0,
            0.248, 0.128, 0,
            0.272, 0.176, 0,
            0.272, 0.216, 0,
            0.256, 0.248, 0,
            0.22, 0.272, 0,
            0.168, 0.292, 0,
            0.112, 0.296, 0,
            0.068, 0.292, 0,
            0.028, 0.28, 0,
            0.008, 0.248, 0,
            0.024, 0.208, 0,
            0.064, 0.184, 0,
            0.112, 0.168, 0,
            0.172, 0.156, 0,
            0.224, 0.144, 0,
            0.284, 0.14, 0,
            0.34, 0.136, 0,
            0.392, 0.132, 0,
            0.424, 0.128, 0,
            0.46, 0.128, 0,
            0.476, 0.144, 0,
            0.472, 0.172, 0,
            0.452, 0.212, 0,
            0.424, 0.24, 0,
            0.392, 0.264, 0,
            0.356, 0.288, 0,
            0.324, 0.3, 0,
            0.3, 0.296, 0,
            0.3, 0.264, 0,
            0.312, 0.232, 0,
            0.336, 0.192, 0,
            0.356, 0.168, 0,
            0.376, 0.148, 0,
            0.408, 0.128, 0,
            0.488, 0.124, 0,
            0.516, 0.128, 0,
            0.536, 0.132, 0,
            0.556, 0.128, 0,
            0.552, 0.112, 0,
            0.528, 0.164, 0,
            0.516, 0.192, 0,
            0.5, 0.232, 0,
            0.488, 0.268, 0,
            0.5, 0.292, 0,
            0.528, 0.292, 0,
            0.564, 0.268, 0,
            0.608, 0.24, 0,
            0.644, 0.216, 0,
            0.664, 0.164, 0,
            0.664, 0.128, 0,
            0.656, 0.196, 0,
            0.624, 0.256, 0,
            0.6, 0.288, 0,
            0.66, 0.216, 0,
            0.708, 0.168, 0,
            0.748, 0.136, 0,
            0.776, 0.124, 0,
            0.8, 0.124, 0,
            0.808, 0.132, 0,
        ];
        pnts = this.centerPoints(pnts);
        return this.genPathFromPoints(pnts, sclFctr);
    }
    genHeartPath(){
        const pth = [];
        pth.push( new THREE.Vector3( 0, -5, 0) );
        pth.push( new THREE.Vector3(-2, -2, 0) );
        pth.push( new THREE.Vector3(-4,  2, 0) );
        pth.push( new THREE.Vector3(-3.5,  6, 0) );
        pth.push( new THREE.Vector3(-2,  7, 0) );
        pth.push( new THREE.Vector3( 0,  4, 0) );
        pth.push( new THREE.Vector3( 2,  7, 0) );
        pth.push( new THREE.Vector3(3.5,  6, 0) );
        pth.push( new THREE.Vector3( 4,  2, 0) );
        pth.push( new THREE.Vector3( 2, -2, 0) );
        pth.push( new THREE.Vector3( 0, -5, 0) );
        return pth;
    }
    genCatmullRomHeart(){
        return this.genCatmullRomFromPath( this.genHeartPath(), true );
    }
    genCatmullRomSoir(sclFctr=8){
        return this.genCatmullRomFromPath( this.genSoirPath(sclFctr), false );
    }
    genCatmullRomFromPath(path, closed){
        return this.genCatmullRom( path, closed );
    }
    genHeart(){
        const curve = this.genCatmullRomHeart();
        const path = curve.getSpacedPoints ( 500 );
        this.path = path;

        const curve2 = this.genCatmullRomSoir();
        let path2 = curve2.getSpacedPoints ( 500 );
        path2 = path2.map(v=>{
            return new THREE.Vector3(v.x - 2, v.y, v.z);
        })
        this.path2 = path2;
        // let lp;
        // points.forEach(pos=>{
        //     if(lp){
        //         this.drawLine(lp, pos, {color: 0xff00ff});
        //     }
        //     lp = pos;
        // });

        const is = new InstancedSphere();
        is.createInstcMeshTest({
            path,
            path2,
            startAtOrigin: false,
            instanceCount: 5000,
            // initOffset: 0.5,
            cameraRotation: this.cameraRot,
            secondsPerLoop: 10,
            rotationVelocity: 4,
            rotationOffset: 1,
            rotEllipseOffs: 3,
            colRange: 0.5,
            hearts: true,
        });
        this.addInstancedPath(is);
        this.heartIs = is;
    }

}

export default HeartAnimation;