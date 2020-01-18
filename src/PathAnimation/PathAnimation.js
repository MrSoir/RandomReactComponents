import * as THREE from 'three';
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

        this.initScene();
        this.initCamera();
        this.initLight();
        this.initRenderer();

        // this.createCylinder();

        this.resize();

        // this.createRandomBals({n:100})
        // console.log('genRandomCatmullRom: ', this.genRandomCatmullRom());
        this.genRandomCatmullRomBalls();

        this.animate();
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
    genCRHeartPath(){
        var curve = new THREE.CatmullRomCurve3( this.genHeartPath() );
        return curve;
    }
    genRandomPath(n=50){
        const pth = [];
        let scl = 0;
        pth.push( new THREE.Vector3(rand() * scl, rand() * scl, rand() * scl) );
        let lp = pth[0];
        scl = 2;
        for(let i=1; i < n; ++i){
            pth.push( new THREE.Vector3(lp.x + rand() * scl,
                                        lp.y + rand() * scl,
                                        0)//lp.z + rand() * scl)
                    );
            lp = pth[i];
        }
        return pth;
    }
    genRandomCatmullRom(n=10){
        return this.genCatmullRom( this.genHeartPath() );
    }
    genCatmullRom(pth){
        var curve = new THREE.CatmullRomCurve3( pth );
        return curve;
    }
    genRandomCatmullRomBalls(){
        const curve = this.genRandomCatmullRom();
        const points = curve.getPoints( 50 );
        // let lp;
        // points.forEach(pos=>{
            // this.createBall({pos, size: 0.03});
            // if(lp){
            //     this.drawLine(lp, pos, {color: 0xff00ff});
            // }
            // lp = pos;
        // });

        for(let i=0; i < 500; ++i){
            const pt = new PathTravellor({
                path: points,
                moveVel: rand(0.1, 0.3), 
                rotVel:  rand(0.1, 0.3), 
                rotOffs: rand(0.1, 0.3),
                ranomStartPos: true
            });
            let color = this.genRandomColor({
                minr: 0, maxr: 0,
                // ming: 0, maxg: 0,
                minb: 0, maxb: 0,
            });
            console.log('color: ', color);
            let ball = this.createBall({
                color,
                size: 0.05
            });
            pt.ball = ball;
            this.pathTravellors.push( pt );
        }

        const is = new InstancedSphere();
        const mesh = is.genCustomShapeMesh();

        this.scene.add( mesh );
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

        this.cameraRot = 0;
    }
    rotateCamera(){
        this.cameraRot = (this.cameraRot + 0.003) % (Math.PI * 2);
        
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
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            context: context,
            antialias: true, 
            alpha: true 
        });
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
    animate(){
        this.renderer.render( this.scene, this.camera );

        // for(let l of this.lines){
        //     this.scene.remove(l);
        // }            console.log(v1);


        if(!this.animcntr){
            this.animcntr = 0;
        }
        this.animcntr++;

        // this.updateLight();

        this.rotateCamera();

        this.movePt();

        // if(this.animcntr > 100)return;

        requestAnimationFrame( this.animate );
    }
}

export default PathAnimation;