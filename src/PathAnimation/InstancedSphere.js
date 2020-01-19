import * as THREE from 'three';
import Math3D from './Math3D';

class InstancedSphere{
    constructor(){
        this.DATA_HEIGHT = 2;
        this.secondsPerRound = 10;
    }
    move({
        time,
        cameraRotation
    }){
        this.material.uniforms[ "time" ].value = time;
        this.material.uniforms[ "cameraRotation" ].value = cameraRotation;
        
        // let curPrgrsInBetween = this.evalCurPrgrsInBetween(time);
    }
    // progress(time){
    //     return (time % this.secondsPerRound) / this.secondsPerRound;
    // }
    // curPathId(prgrs){
    //     let pathCountF = this.pathCount;
    //     let curIdF = pathCountF * prgrs;
    //     let curId = Math.floor(curIdF);
    //     return curId;
    // }
    // nextPathId(curId){
    //     let nxtId = curId + 1;
    //     if(nxtId >= this.pathCount){
    //         nxtId = 0;
    //     }
    //     return nxtId;
    // }
    // evalCurPrgrsInBetween(time){
    //     let prgrs = this.progress(time);

    //     let curId = this.curPathId(prgrs);
    //     let nxtId = this.nextPathId(curId);

    //     let v0 = this.path[curId];
    //     let v1 = this.path[nxtId];
        
    //     let curIdF  = curId;
    //     let nxtIdF  = nxtId;
    //     let pthCntF = this.pathCount;

    //     let curIdPrgrs = curIdF / pthCntF;
    //     let nxtIdPrgrs = nxtIdF / pthCntF;
    //     let prgrInBetween = (prgrs - curIdPrgrs) / (nxtIdPrgrs - curIdPrgrs);  

    //     console.log({
    //         time,
    //         prgrs,
    //         curId,
    //         nxtId,
    //         curIdPrgrs,
    //         prgrInBetween
    //     });
    //     return prgrInBetween;              
    //     // return v0;
    //     // return v1;

    //     // return v0.clone().add( v1.clone().sub(v0.clone()).multiplyScalar(prgrInBetween) );
    // }
    heartGeometry(){
        // var x = 0, y = 0;

        // var heartShape = new THREE.Shape();
        
        // heartShape.moveTo( x + 5, y + 5, 0 );
        // heartShape.lineTo( x + 5, y + 5, x + 4, y, x, y );
        // heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
        // heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
        // heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
        // heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
        // heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

        // var extrudeSettings = {
        //     steps: 1,
        //     depth: 5,
        // };
        
        // var geometry = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );

        var x = 0, y = 0;

        var heartShape = new THREE.Shape();

        heartShape.moveTo( x + 5, y + 5 );
        heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
        heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
        heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
        heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
        heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
        heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

        var geometry = new THREE.ShapeBufferGeometry( heartShape );
        
        // var geometry = new THREE.ShapeBufferGeometry( heartShape );
        let sclFctr = 0.01;
        geometry.scale(sclFctr, sclFctr, sclFctr);
        geometry.rotateZ(Math.PI);
        return geometry;
    }
    createInstcMeshTest({
        path,
        startAtOrigin=true,
        initOffset=1,
        cameraRotation,
        rotationVelocity=3,
        rotationOffset=1,
        rotEllipseOffs=1,
        secondsPerLoop=20,
        instanceCount=1000,
        color=[1,0,0],
        colRange=0.4,
        hearts=true
    }){
        
        var geometry;
        if(hearts){
        var geometry = new THREE.InstancedBufferGeometry().copy(this.heartGeometry());
        }else{
            let bfGeom;
            bfGeom = new THREE.CircleBufferGeometry( 0.1, 5 );
            // bfGeom = new THREE.SphereBufferGeometry(0.1, 4, 4);
            geometry = new THREE.InstancedBufferGeometry().copy( bfGeom );
        }
        // var geometry = this.heartGeometry();)

        let curId = 0;
        this.curId = curId;
        this.path = path;
        let pathCount  = path.length;
        this.pathCount = pathCount;


        const rand = Math3D.rand;
        let pathArr = [];
        let secondsPerRound = [];

        let rotVel = [];
        let rotOffs = [];
        let rotAngleOffs = [];
        let rotEllipseFctr = [];
        let timeOffs = [];
        let randoms = [];

        for(let i=0; i < 50; ++i){
            let r = Math.random();
            let e = Math.exp(r);
            let p = e / Math.exp(1);
            let obj = {
                r,e,p
            }
            console.log(obj);
        }

        let col = [];
        path.forEach(p=>{
            pathArr = pathArr.concat( [p.x, p.y, p.z] );
        });
        for(let i=0; i < instanceCount; ++i){
            // secondsPerRound.push( 100 );
            // secondsPerRound.push( rand(6, 12) );

            let scndsPerRnd = rand(0.5, 1.0) *  10 * secondsPerLoop ;
            secondsPerRound.push( scndsPerRnd );

            timeOffs.push( startAtOrigin ? 0 : rand(0, scndsPerRnd) * initOffset );

            rotVel.push( rand(0.5, 1.0) * rotationVelocity );

            rotOffs.push(  rand(0.1, 0.2) * rotationOffset );
            rotAngleOffs.push( rand(0, Math.PI * 2) );

            let expFctr = 3;
            let ellipsSclFctr = rotEllipseOffs;
            rotEllipseFctr.push(
                (Math.exp(Math.random() * expFctr) / Math.exp(expFctr)) * ellipsSclFctr,
                (Math.exp(Math.random() * expFctr) / Math.exp(expFctr)) * ellipsSclFctr,
            );
            randoms.push( rand(), rand(), rand() );

            let r = rand(1-colRange, 1) * color[0];
            let g = rand(1-colRange, 1) * color[1];
            let b = rand(1-colRange, 1) * color[2];
            col.push( r,g,b )
        }
        console.log('rotEllipseFctr: ', rotEllipseFctr);
        console.log('path: ', path.length, '    pathArr: ', pathArr.length);
        geometry.addAttribute("randoms",           new THREE.InstancedBufferAttribute(new Float32Array(randoms), 3, false));
        geometry.addAttribute("col",               new THREE.InstancedBufferAttribute(new Float32Array(col), 3, false));
        geometry.addAttribute("rotVel",            new THREE.InstancedBufferAttribute(new Float32Array(rotVel), 1, false));
        geometry.addAttribute("secondsPerRound",   new THREE.InstancedBufferAttribute(new Float32Array(secondsPerRound), 1, false));
        geometry.addAttribute("rotVel",            new THREE.InstancedBufferAttribute(new Float32Array(rotVel), 1, false));
        geometry.addAttribute("rotOffs",           new THREE.InstancedBufferAttribute(new Float32Array(rotOffs), 1, false));
        geometry.addAttribute("rotAngleOffs",      new THREE.InstancedBufferAttribute(new Float32Array(rotAngleOffs), 1, false));
        geometry.addAttribute("rotEllipseFctr",    new THREE.InstancedBufferAttribute(new Float32Array(rotEllipseFctr), 2, false));
        geometry.addAttribute("timeOffs",          new THREE.InstancedBufferAttribute(new Float32Array(timeOffs), 1, false));

        let material = new THREE.RawShaderMaterial({
            uniforms: {
                "time":      { value: 0.0 },
                "path":      { type: "fv",  value: pathArr },
                "pathCount": { value: path.length },
                "cameraRotation": {value: cameraRotation}
                
                // "uFloatArray3" : { type: "fv",  value: [ 2.0, 3.0, 0.0, 0.4, 0.5, 0.6 ] }, // float array (vec3)
                // "curId": { value: curId },
                // "uVec3" : { type: "v3", value: new THREE.Vector3( 0, 3, 0 ) },    // single Vector3
            },
            vertexShader:   this.vertexShader(pathCount),
            fragmentShader: this.fragmentShader(),
            side: THREE.DoubleSide,
            transparent: false
        });

        let mesh = new THREE.Mesh(geometry, material);

        this.material = material;
        this.gemoetry = geometry;
        this.mesh     = mesh;


        return mesh;
    }
    vertexShader(pathCount){
        if(!pathCount){
            console.error('InstancedSphere::vetexShader: pathCount not defined!');
        }

        return `#version 300 es
        precision highp float;

        #define PI  3.1415926535897932384626433832795
        #define TAU 6.2831853071795864769252867665590

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float time;
        uniform vec3 path[ ${pathCount + 1} ];
        uniform int pathCount;
        uniform vec3 uVec3;
        uniform int curId;
        uniform float cameraRotation;

        // uniform vec3 path;
        // uniform vec3 uFloatArray3[ 2 ];

        in vec3 position;
        in vec3 col;
        in vec3 randoms;
        in float secondsPerRound;
        in float rotVel;
        in float rotOffs;
        in float rotAngleOffs;
        in vec2 rotEllipseFctr;
        in float timeOffs;

        out vec3 fcol;

        float getTime(){
            return time + timeOffs;
        }
        float progress(){
            return mod(getTime(), secondsPerRound) / secondsPerRound;
        }
        int curPathId(float prgrs){
            float pathCountF = float(pathCount);
            float curIdF = pathCountF * prgrs;
            int curId = int(curIdF);
            return curId;
        }
        int nextPathId(int curId){
            int nxtId = curId + 1;
            if(nxtId >= pathCount){
                nxtId = 0;
            }
            return nxtId;
        }
        vec3 evalCurPos(){
            float prgrs = progress();

            int curId = curPathId(prgrs);
            int nxtId = nextPathId(curId);

            vec3 v0 = path[curId];
            vec3 v1 = path[nxtId];
            
            float curIdF  = float(curId);
            float nxtIdF  = float(nxtId);
            float pthCntF = float(pathCount);

            float curIdPrgrs = curIdF / pthCntF;
            float nxtIdPrgrs = nxtIdF / pthCntF;
            float prgrInBetween = (prgrs - curIdPrgrs) / (nxtIdPrgrs - curIdPrgrs);  

            // return vs0;
            // return v1;
            return v0 + (v1 - v0) * prgrInBetween;
        }

        vec4 quaternionFromAxisAngle(vec3 axis, float angle){
            axis = normalize(axis);
            float sin_a = sin(angle * 0.5);
            float cos_a = cos(angle * 0.5);

            float x = axis.x * sin_a;
            float y = axis.y * sin_a;
            float z = axis.z * sin_a;
            float w = cos_a;

            return vec4(x, y, z, w);
        }
        vec4 quaternion(vec3 axis, float angle){
            vec4 quat = quaternionFromAxisAngle( axis, angle );
            return quat;
        }
        mat4 quaternionToMat(vec4 q){
            mat4 m40 = mat4(
                vec4(  q.w,  q.z, -q.y,  q.x ),
                vec4( -q.z,  q.w,  q.x,  q.y ),
                vec4(  q.y, -q.x,  q.w,  q.z ),
                vec4( -q.x, -q.y, -q.z,  q.w )
            );
            mat4 m41 = mat4(
                vec4(  q.w,  q.z, -q.y, -q.x ),
                vec4( -q.z,  q.w,  q.x, -q.y ),
                vec4(  q.y, -q.x,  q.w, -q.z ),
                vec4(  q.x,  q.y,  q.z,  q.w )
            );
            return transpose(m40) * transpose(m41);
        }
        mat4 quaternionMatrix(vec3 axis, float angle){
            vec4 quat = quaternion(axis, angle);
            return quaternionToMat(quat);
        }
        vec3 arbitraryOrthogonal(vec3 v){
            vec3 vtar = normalize( v );
    
            vec3 vref = vec3(0.0, 1.0, 0.0);
            float d = dot(vref, vtar);
            if(d > 0.99 && d < 1.01){
                vref = vec3(1.0, 0.0, 0.0);
            }
    
            vec3 c = normalize( cross(vref, vtar) );
            return c;
        }

        vec3 evalRotationVec(){
            float t = getTime();
            // if(randoms[0] > 0.5){
            //     t *= -1.0;
            // }
            float rotAngle = mod(t * rotVel + rotAngleOffs, TAU);

            float prgrs = progress();

            int curId = curPathId(prgrs);
            int nxtId = nextPathId(curId);

            vec3 v0 = path[curId];
            vec3 v1 = path[nxtId];
            vec3 dir = v1 - v0;

            mat4 m = quaternionMatrix(dir, rotAngle);
            vec3 ortho = arbitraryOrthogonal(dir);
            vec4 ortho4 = vec4(ortho, 1.0);
            vec4 rotUni4 = m * ortho4;
            vec3 rotUni = vec3(rotUni4.xyz);
            vec3 rot = rotUni * rotOffs;

            float rotEllipseFctrX = rotEllipseFctr.x;
            float rotEllipseFctrY = rotEllipseFctr.y;
            float dx = cos(rotAngle * 0.5) * rotEllipseFctrX;
            float dy = sin(rotAngle * 0.5) * rotEllipseFctrY;
            float ellipseSclFctr = pow(dx*dx + dy*dy, 0.5);
            rot = rot * ellipseSclFctr;
            
            return rot;
        }

        mat4 rotationX(float angle ) {
            return mat4(	1.0,		0,			0,			0,
                             0, 	cos(angle),	-sin(angle),		0,
                            0, 	sin(angle),	 cos(angle),		0,
                            0, 			0,			  0, 		1);
        }
        
        mat4 rotationY(float angle ) {
            return mat4(	cos(angle),		0,		sin(angle),	0,
                                     0,		1.0,			 0,	0,
                            -sin(angle),	0,		cos(angle),	0,
                                    0, 		0,				0,	1);
        }
        
        mat4 rotationZ(float angle ) {
            return mat4(	cos(angle),		-sin(angle),	0,	0,
                             sin(angle),		cos(angle),		0,	0,
                                    0,				0,		1,	0,
                                    0,				0,		0,	1);
        }

        void main() {
            mat4 cameraRotMat = rotationY(cameraRotation + PI * 0.5);

            vec3 pos = position;
            vec4 pos4 = vec4(pos, 1.0);
            vec4 cameraRotPos4 = cameraRotMat * pos4;
            vec3 cameraRotPos = vec3(cameraRotPos4);

            vec3 curPos = evalCurPos();
            vec3 rotVec = evalRotationVec();
            vec3 tarPos = curPos + cameraRotPos + rotVec;


            gl_Position = projectionMatrix * modelViewMatrix * vec4(tarPos, 1.0);

            float prgrs = progress();
            fcol = col;//vec3(prgrs, 0.0, 0.0);
        }
    `;
    }
    fragmentShader(){
        return `#version 300 es
            precision highp float;

            in vec3 fcol;
            out vec4 fragCol;

            void main() {
                //fragCol = vec4(1.0, 0.0, 1.0, 1.0);
                fragCol = vec4(fcol, 1.0);
            }
        `;
    }
}

export default InstancedSphere;