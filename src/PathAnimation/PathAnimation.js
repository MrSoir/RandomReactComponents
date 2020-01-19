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
function CatmullRomGenerator(p0, p1, p2, p3){
    const alpha = 0.5;

    function tj(ti, pi, pj){
        return Math.pow(
                    Math.pow((pj.x-pi.x), 2) +
                    Math.pow((pj.y-pi.y), 2),
                 alpha) + ti;
    }

    const t0 = 0;
    const t1 = tj(t0, p0, p1);
    const t2 = tj(t1, p1, p2);
    const t3 = tj(t2, p2, p3);

    function CatmullRom(t){
        const A1x = (t1 - t) / (t1 - t0) * p0.x + (t - t0) / (t1 - t0) * p1.x;
        const A1y = (t1 - t) / (t1 - t0) * p0.y + (t - t0) / (t1 - t0) * p1.y;
        // const A1z = (t1 - t) / (t1 - t0) * p0.z + (t - t0) / (t1 - t0) * p1.z;

        const A2x = (t2 - t) / (t2 - t1) * p1.x + (t - t1) / (t2 - t1) * p2.x;
        const A2y = (t2 - t) / (t2 - t1) * p1.y + (t - t1) / (t2 - t1) * p2.y;
        // const A2z = (t2 - t) / (t2 - t1) * p1.z + (t - t1) / (t2 - t1) * p2.z;

        const A3x = (t3 - t) / (t3 - t2) * p2.x + (t - t2) / (t3 - t2) * p3.x;
        const A3y = (t3 - t) / (t3 - t2) * p2.y + (t - t2) / (t3 - t2) * p3.y;
        // const A3z = (t3 - t) / (t3 - t2) * p2.z + (t - t2) / (t3 - t2) * p3.z;

        const B1x = (t2 - t) / (t2 - t0) * A1x + (t - t0) / (t2 - t0) * A2x;
        const B1y = (t2 - t) / (t2 - t0) * A1y + (t - t0) / (t2 - t0) * A2y;
        // const B1z = (t2 - t) / (t2 - t0) * A1z + (t - t0) / (t2 - t0) * A2z;

        const B2x = (t3 - t) / (t3 - t1) * A2x + (t - t1) / (t3 - t1) * A3x;
        const B2y = (t3 - t) / (t3 - t1) * A2y + (t - t1) / (t3 - t1) * A3y;
        // const B2z = (t3 - t) / (t3 - t1) * A2z + (t - t0) / (t2 - t0) * A3z;

        const Cx = (t2 - t) / (t2 - t1) * B1x + (t - t1) / (t2 - t1) * B2x;
        const Cy = (t2 - t) / (t2 - t1) * B1y + (t - t1) / (t2 - t1) * B2y;
        // const Cz = (t2 - t) / (t2 - t1) * B1z + (t - t1) / (t2 - t1) * B2z;

        let c = new THREE.Vector3(Cx, Cy, 0);// Cz);
        return c;
    }
    return CatmullRom;
}

class PathAnimation{
    constructor({canvas}={}){
        this.canvas = canvas;
        this.balls = [];
        this.pathTravellors = [];

        this.LIGHT_VEL = 1;

        this.animate = this.animate.bind(this);

        this.lines = [];

        this.stats = new Stats();

        this.initScene();
        this.initCamera();
        this.initLight();
        this.initRenderer();

        // this.createCylinder();

        this.resize();

        // this.createRandomBals({n:100})
        // console.log('genRandomCatmullRom: ', this.genRandomCatmullRom());

        // this.genRandomCatmullRomBalls();
        this.genMrSoir();

        setTimeout(this.animate, 100);
        // this.animate();
    }
    genTestPath(){
        const pth = [];
        pth.push( new THREE.Vector3(-8, -2, 0) );
        pth.push( new THREE.Vector3(-6,  2, 0) );
        pth.push( new THREE.Vector3(-4, -2, 0) );
        pth.push( new THREE.Vector3(-2,  2, 0) );
        pth.push( new THREE.Vector3( 0, -2, 0) );
        pth.push( new THREE.Vector3( 2,  2, 0) );
        pth.push( new THREE.Vector3( 4, -2, 0) );
        pth.push( new THREE.Vector3( 6,  2, 0) );
        pth.push( new THREE.Vector3( 8, -2, 0) );
        return pth;
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
    genMrPath(sclFctr){
        let pnts = [
            -0.728, -0.08, 0,
            -0.748, -0.084, 0,
            -0.76, -0.1, 0,
            -0.752, -0.12, 0,
            -0.736, -0.14, 0,
            -0.724, -0.16, 0,
            -0.708, -0.176, 0,
            -0.688, -0.192, 0,
            -0.664, -0.212, 0,
            -0.636, -0.232, 0,
            -0.604, -0.252, 0,
            -0.564, -0.272, 0,
            -0.532, -0.276, 0,
            -0.508, -0.26, 0,
            -0.508, -0.228, 0,
            -0.52, -0.188, 0,
            -0.536, -0.144, 0,
            -0.576, -0.056, 0,
            -0.62, 0.016, 0,
            -0.656, 0.06, 0,
            -0.684, 0.084, 0,
            -0.684, 0.052, 0,
            -0.66, 0.012, 0,
            -0.62, -0.036, 0,
            -0.556, -0.104, 0,
            -0.484, -0.164, 0,
            -0.456, -0.176, 0,
            -0.44, -0.168, 0,
            -0.44, -0.148, 0,
            -0.452, -0.108, 0,
            -0.472, -0.056, 0,
            -0.492, -0.012, 0,
            -0.512, 0.032, 0,
            -0.52, 0.06, 0,
            -0.48, 0.012, 0,
            -0.42, -0.056, 0,
            -0.344, -0.128, 0,
            -0.276, -0.184, 0,
            -0.232, -0.204, 0,
            -0.212, -0.196, 0,
            -0.208, -0.172, 0,
            -0.224, -0.148, 0,
            -0.248, -0.112, 0,
            -0.276, -0.064, 0,
            -0.296, -0.02, 0,
            -0.312, 0.02, 0,
            -0.324, 0.06, 0,
            -0.328, 0.096, 0,
            -0.312, 0.116, 0,
            -0.276, 0.096, 0,
            -0.244, 0.064, 0,
            -0.22, 0.028, 0,
            -0.204, -0.008, 0,
            -0.192, -0.044, 0,
            -0.172, -0.052, 0,
            -0.176, -0.024, 0,
            -0.184, -0.004, 0,
            -0.148, -0.036, 0,
            -0.104, -0.06, 0,
            -0.084, -0.06, 0,
        ];
        pnts = this.centerPoints(pnts);
        return this.genPathFromPoints(pnts, sclFctr);
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
    genIDotPath(sclFctr){
        let pnts = [
            0.444, 0.132, 0,
            0.416, 0.132, 0,
            0.388, 0.144, 0,
            0.368, 0.16, 0,
            0.344, 0.188, 0,
            0.324, 0.22, 0,
            0.308, 0.252, 0,
            0.3, 0.28, 0,
            0.304, 0.3, 0,
            0.324, 0.304, 0,
            0.356, 0.288, 0,
            0.396, 0.26, 0,
            0.444, 0.22, 0,
            0.468, 0.188, 0,
            0.48, 0.156, 0,
            0.472, 0.136, 0,
        ];
        pnts = this.centerPoints(pnts);
        return this.genPathFromPoints(pnts, sclFctr);
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

    genSPath(sclFctr){
        let pnts = [
            -0.508, 0.14, 0,
            -0.572, 0.14, 0,
            -0.644, 0.14, 0,
            -0.704, 0.16, 0,
            -0.736, 0.204, 0,
            -0.744, 0.276, 0,
            -0.72, 0.344, 0,
            -0.64, 0.372, 0,
            -0.544, 0.376, 0,
            -0.452, 0.38, 0,
            -0.368, 0.384, 0,
            -0.3, 0.392, 0,
            -0.248, 0.428, 0,
            -0.244, 0.5, 0,
            -0.252, 0.576, 0,
            -0.316, 0.616, 0,
            -0.412, 0.62, 0,
            -0.508, 0.62, 0,
            -0.608, 0.62, 0,
            -0.684, 0.624, 0,
            -0.76, 0.62, 0,
        ];
        return this.genPathFromPoints(pnts, sclFctr);
    }
    genOPath(sclFctr){
        let pnts = [
            0.112, 0.272, 0,
            0.024, 0.272, 0,
            -0.036, 0.3, 0,
            -0.072, 0.376, 0,
            -0.076, 0.508, 0,
            -0.04, 0.588, 0,
            0.008, 0.608, 0,
            0.132, 0.624, 0,
            0.284, 0.62, 0,
            0.368, 0.6, 0,
            0.404, 0.532, 0,
            0.4, 0.404, 0,
            0.384, 0.316, 0,
            0.3, 0.272, 0,
            0.208, 0.272, 0,
        ];
        return this.genPathFromPoints(pnts, sclFctr);
    }
    genIPath(sclFctr){
        let pnts = [
            0.612, 0.096, 0,
            0.544, 0.092, 0,
            0.492, 0.108, 0,
            0.472, 0.168, 0,
            0.484, 0.212, 0,
            0.54, 0.228, 0,
            0.58, 0.284, 0,
            0.576, 0.348, 0,
            0.58, 0.416, 0,
            0.576, 0.484, 0,
            0.58, 0.56, 0,
            0.58, 0.624, 0,
            0.588, 0.232, 0,
            0.628, 0.22, 0,
            0.64, 0.144, 0,
        ];
        return this.genPathFromPoints(pnts, sclFctr);
    }
    genRPath(sclFctr){
        let pnts = [
            0.96, 0.276, 0,
            0.908, 0.28, 0,
            0.852, 0.288, 0,
            0.8, 0.312, 0,
            0.772, 0.364, 0,
            0.768, 0.416, 0,
            0.768, 0.472, 0,
            0.768, 0.528, 0,
            0.768, 0.584, 0,
            0.768, 0.632, 0,           
        ];
        return this.genPathFromPoints(pnts, sclFctr);
    }
    genCRHeartPath(){
        var curve = new THREE.CatmullRomCurve3( this.genHeartPath() );
        return curve;
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
    genRandomCatmullRomBalls(){
        const curve = this.genRandomCatmullRom(true);
        const points = curve.getSpacedPoints ( 500 );
        console.log('points: ', points);
        // let lp;
        // points.forEach(pos=>{
        //     // this.createBall({pos, size: 0.03});
        //     if(lp){
        //         this.drawLine(lp, pos, {color: 0xff00ff});
        //     }
        //     lp = pos;
        // });

        const is = new InstancedSphere();
        const mesh = is.createInstcMeshTest({
            path: points,
            startAtOrigin: false,
            cameraRotation: this.cameraRot
        });
        this.scene.add( mesh );
        this.is = is;
    }
    genMrSoir(){
        let sclFctr = 8;
        let iDotSclFctr = 1.5;
        const MRcr   = this.genCatmullRom( this.genMrPath(sclFctr), false );
        const SOIRcr = this.genCatmullRom( this.genSoirPath(sclFctr), false );
        const IDOTcr = this.genCatmullRom( this.genIDotPath(iDotSclFctr), true);
        // const Scr = this.genCatmullRom( this.genSPath(sclFctr), false );
        // const Ocr = this.genCatmullRom( this.genOPath(sclFctr), true );
        // const Icr = this.genCatmullRom( this.genIPath(sclFctr), true );
        // const Rcr = this.genCatmullRom( this.genRPath(sclFctr), false );

        const curves = [];
        curves.push(MRcr);
        curves.push(SOIRcr);
        curves.push(IDOTcr);
        // curves.push(Scr);
        // curves.push(Ocr);
        // curves.push(Icr);
        // curves.push(Rcr);

        let translate = [];
        translate.push( new THREE.Vector3(-10, -1, 0) ); // Mr
        translate.push( new THREE.Vector3( -2, -4, 0) ); // Soir
        translate.push( new THREE.Vector3(  3, 0, 0) ); // i-dot

        let instanceCounts = [
            2000, // Mr
            2000, // Soir
             200, // idot
        ];


        this.instancedPaths = [];
        
        curves.map((curve, id)=>{
            const points = curve.getSpacedPoints ( 500 );
            let trnsl = translate[id];
    
            const is = new InstancedSphere();
            const mesh = is.createInstcMeshTest({
                path: points,
                instanceCount: instanceCounts[id],
                startAtOrigin: false,
                cameraRotation: this.cameraRot,
                secondsPerLoop: 5,
                rotationOffset: 1,
                rotEllipseOffs: 3,
            });
            mesh.geometry.translate(trnsl.x, trnsl.y, trnsl.z);
            this.scene.add( mesh );
            this.instancedPaths.push( is );
        });
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
    resize(){
        const [w,h] = this.canvasSize();
        this.camera.aspect = w/h;
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

        console.log('context: ', context);

        if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {
			console.error('instancing not supported!');
        }else{
            console.log('instancing IS supported!');
        }
        
        this.renderer = renderer;
    }
    createBall({
        pos=new THREE.Vector3(0,0,0),
        vel=new THREE.Vector3(0,0,0),
        size=0.1,
        color=0x00ff00
    }={}){
        let geometry = new THREE.SphereGeometry( size, 8, 8 );
        // let geometry = new THREE.ConeGeometry( size, size, 5 );
        let material = genMaterial({color});
        let sphere = new THREE.Mesh( geometry, material );

        sphere.position.set(pos.x, pos.y,pos.z);
        this.balls.push( sphere );
        this.scene.add( sphere );
        return sphere;
    }

    createRandomBals({n}){
        let posScl = 3;
        for(let i=0; i < n; ++i){
            let pos = new THREE.Vector3(rand()*posScl, rand()*posScl, rand()*posScl);
            let vel = new THREE.Vector3(rand(), rand(), rand());
            this.createBall({pos, vel});
        }
    }
    movePt(){
        for(let pt of this.pathTravellors){
            pt.move();
            let pos = pt.pos();
            pt.ball.position.set(pos.x, pos.y, pos.z);
        }
    }
    createCylinder(){
        // var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 3, 5 );
        // var cylinder = new THREE.Mesh( geometry, genMaterial() );
        // this.cylinder = cylinder;
        // this.cp0 = this.createBall({
        //     pos: new THREE.Vector3(0,0,0),
        //     vel: new THREE.Vector3(0,0,0),
        //     size: 0.08
        // });
        // this.cpcross = this.createBall({
        //     pos: new THREE.Vector3(0,0,0),
        //     vel: new THREE.Vector3(0,0,0),
        //     size: 0.1,
        //     color: 0xff0000
        // });
        // this.cpvref = this.createBall({
        //     pos: new THREE.Vector3(0,0,0),
        //     vel: new THREE.Vector3(0,0,0),
        //     size: 0.1,
        //     color: 0x0000ff
        // });
        // // this.scene.add( this.cylinder );

        // this.cylinderRot = 0;

        // this.cylinderRot = (this.cylinderRot + 0.03) % (Math.PI * 2);

        // let v0 = new THREE.Vector3(1,1,0).normalize();
        // let vref = new THREE.Vector3(1,0,0).normalize();
        // let cross = Math3D.arbitraryOrthogonal(v0);

        // this.cp0.position.set(v0.x, v0.y, v0.z);
        // this.cpcross.position.set(cross.x, cross.y, cross.z);
        // this.cpvref.position.set(vref.x, vref.y, vref.z);

        // this.drawLine(v0);
        // this.drawLine(vref);
        // this.drawLine(cross);

        // for(let angle=0; angle < Math.PI * 2; angle += 0.01){
        //     let mat = Math3D.quaternionMatrix(v0.clone(), angle);
        //     let v1 = cross.clone().applyMatrix4(mat);

        //     this.drawLine(v1);

        //     let cp1 = this.createBall({
        //         pos: new THREE.Vector3(0,0,0),
        //         vel: new THREE.Vector3(0,0,0),
        //         size: 0.05
        //     });

        //     cp1.position.set(v1.x, v1.y, v1.z);
        // }
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
    moveInstancedSphere(time){
        if(this.is){
            this.is.move(time);
        }

        if(this.instancedPaths){
            this.instancedPaths.forEach(is=>is.move(time));
        }
    }
    animate(){
        this.renderer.render( this.scene, this.camera );
        this.stats.update();

        var time = performance.now() * 0.001;

        // this.updateLight(time);

        this.rotateCamera(time);

        // this.movePt(time);
        this.moveInstancedSphere({
            time,
            cameraRotation: this.cameraRot
        });

        requestAnimationFrame( this.animate );
        // setTimeout(this.animate, 100);
    }
}

export default PathAnimation;