import * as THREE from 'three';
import PathAnimation from './PathAnimation';
import InstancedSphere from './InstancedSphere';

class HeartAnimation extends  PathAnimation{
    constructor({canvas, createHeart=true}={}){
        super({canvas});

        if(createHeart){
            this.genHeart();
        }
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

        const is = new InstancedSphere();
        is.createInstcMeshTest({
            path,
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
        return is;
    }

}

export default HeartAnimation;