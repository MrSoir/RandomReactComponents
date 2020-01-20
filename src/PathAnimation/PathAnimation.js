import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import InstanceTest from './InstanceTest';
import Math3D from './Math3D';
import PathTravellor from './PathTravellor';
import InstancedSphere from './InstancedSphere';

const USE_PHONG = false;
const MATERIAL_COLOR = 0x00aa00;

function genMaterial(
    materialOptions={
        color: MATERIAL_COLOR,
        metalness: 0.0,
        roughness: 0.25
    }
){
    return (USE_PHONG
        ? new THREE.MeshPhongMaterial(materialOptions)
        : new THREE.MeshBasicMaterial(materialOptions) );
}
function rand(min=-1.0, max=1.0){
    return min + Math.random() * (max - min);
}

class PathAnimation{
    constructor({canvas}={}){
        this.canvas = canvas;
        this.balls = [];
        this.pathTravellors = [];
        this.instancedPaths = [];
        this.onAnimateCallbacks = [];
        this.SPACED_POINTS_COUNT = 20;

        this.LIGHT_VEL = 1;

        this.animate = this.animate.bind(this);

        this.lines = [];

        this.stats = new Stats();

        this.initScene();
        this.initCamera();
        this.initLight();
        this.initRenderer();

        this.resize();

        // this.genHeart();
        // this.genMrSoir();

        setTimeout(this.animate, 100);
    }
    addAnimationCallback(cb){
        this.onAnimateCallbacks.push(cb);
    }
    addInstancedPath(ip){
        this.scene.add( ip.mesh );
        this.instancedPaths.push( ip );
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

    genPathFromPoints(pnts, sclFctr){
        let pth = [];
        for(let i=0; i < pnts.length-3; i += 3){
            let p0 = pnts[i];
            let p1 = pnts[i+1];
            let p2 = pnts[i+2];
            pth.push( new THREE.Vector3(p0, 1-p1, p2) );
        }
        pth = pth.map(v=>v.multiplyScalar(sclFctr));
        return pth;
    }
    centerPoints(pnts){
        pnts = [...pnts];
        let [minx, maxx] = [1,-1];
        let [miny, maxy] = [1,-1];
        let [minz, maxz] = [1,-1];
        for(let i=0; i < pnts.length-3; i += 3){
            let [x,y,z] = [pnts[i+0], pnts[i+1], pnts[i+2]];
            if(minx > x)minx = x;
            if(miny > y)miny = y;
            if(minz > z)minz = z;

            if(maxx < x)maxx = x;
            if(maxy < y)maxy = y;
            if(maxz < z)maxz = z;
        }
        let dx = maxx - minx;
        let dy = maxy - miny;
        let dz = maxz - minz;
        for(let i=0; i < pnts.length-3; i += 3){
            let [x,y,z] = [pnts[i+0], pnts[i+1], pnts[i+2]];
            pnts[i+0] = (x - minx) / dx;
            pnts[i+1] = (y - miny) / dy;
            pnts[i+2] = (z - minz) / dz;
        }
        return pnts;
    }

    genRandomPath(n=50){
        const pth = [];
        let scl = 0;
        pth.push( new THREE.Vector3(rand() * scl, rand() * scl, rand() * scl) );
        let lp = pth[0];
        scl = 3;
        for(let i=1; i < n; ++i){
            pth.push( new THREE.Vector3(lp.x + rand() * scl,
                                        lp.y + rand() * scl,
                                        0)//lp.z + rand() * scl)
                    );
            lp = pth[i];
        }
        return pth;
    }
    genRandomCatmullRom(n=10, closed){
        return this.genCatmullRom( this.genHeartPath(n), closed );
    }
    genCatmullRom(pth, closed=false){
        var curve = new THREE.CatmullRomCurve3( pth, closed );
        return curve;
    }
    genHeart(){
        const curve = this.genRandomCatmullRom(true);
        const points = curve.getSpacedPoints ( this.SPACED_POINTS_COUNT );
        console.log('points: ', points);
        // let lp;
        // points.forEach(pos=>{
        //     if(lp){
        //         this.drawLine(lp, pos, {color: 0xff00ff});
        //     }
        //     lp = pos;
        // });

        const is = new InstancedSphere();
        const mesh = is.createInstcMeshTest({
            path: points,
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
        this.scene.add( mesh );
        this.is = is;
    }
    genRandomColor({
        minb=80, maxb=255,
        ming=80, maxg=255,
        minr=80, maxr=255,
    }={}){
        let b = Math.floor(rand(minb, maxb));
        let g = Math.floor(rand(ming, maxg)) << 8;
        let r = Math.floor(rand(minr, maxr)) << 16;
        return r + g + b;
    }
    resize(newSize){
        let [w,h] = this.canvasSize();
        if(newSize){
            w = newSize.w;
            h = newSize.h;
        }
        this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
    canvasSize(){
        return [this.canvas.offsetWidth, this.canvas.offsetHeight];
    }
    initScene(){
        this.scene = new THREE.Scene();
    }
    initCamera(){
        this.cameraOffs = -10;

        const [w,h] = this.canvasSize();

        this.camera = new THREE.PerspectiveCamera( 
                75, 
                w / h, 
                0.1, 1000
        );
        this.camera.position.z = this.cameraZ;

        this.cameraRot = Math.PI * 1.5;
    }
    rotateCamera(){
        this.cameraRot = (this.cameraRot + 0.0) % (Math.PI * 2);
        
        this.camera.position.set(
            Math.cos(this.cameraRot) * this.cameraOffs,
            0 * this.cameraOffs,
            Math.sin(this.cameraRot) * this.cameraOffs
        )
        this.camera.up = new THREE.Vector3(0,1,0);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    }
    initLight(){
        this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 0, 0, -1 );
		this.scene.add(this.light);
    }
    updateLight(){
		let light = this.light;
		light.position.x += this.LIGHT_VEL;
		light.position.set(light.position.x, light.position.y, light.position.z);
	}
    initRenderer(){
        let context = this.canvas.getContext( 'webgl2', { alpha: true, antialias: true } );
        let renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            context: context,
            antialias: true, 
            alpha: true 
        });
        
        this.renderer = renderer;
    }
    drawLine(v0, v1=new THREE.Vector3(0,0,0), {color}={color: 0xff00ff}){
        var geometry = new THREE.Geometry();
        geometry.vertices.push( v0 );
        geometry.vertices.push( v1 );

        var material = new THREE.LineBasicMaterial( { color } );
        var line = new THREE.Line( geometry, material );
        this.scene.add(line);

        this.lines.push(line);

        return line;
    }
    updateInstancedSpheres(){
        if(this.instancedPaths){
            this.instancedPaths.forEach(is=>{
                is.move({
                    time: this.time,
                    cameraRotation: this.cameraRot
                });
            });
        }
    }
    animate(){
        this.renderer.render( this.scene, this.camera );
        this.stats.update();

        var time = performance.now() * 0.001;
        this.time = time;

        // this.updateLight(time);

        this.rotateCamera(time);

        this.updateInstancedSpheres();

        for(let cb of this.onAnimateCallbacks){
            cb();
        }

        requestAnimationFrame( this.animate );
        // setTimeout(this.animate, 100);
    }
}

export default PathAnimation;