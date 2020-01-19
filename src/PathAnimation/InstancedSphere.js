import * as THREE from 'three';
import Math3D from './Math3D';

class InstancedSphere{
    constructor(){
        this.DATA_HEIGHT = 2;
        this.secondsPerRound = 60;
    }
    move(time){
        this.material.uniforms[ "time" ].value = time;

        let secondsPerRound = this.secondsPerRound;
        let prgrs = (time % secondsPerRound ) / secondsPerRound;
        // console.log({
        //     time,
        //     secondsPerRound: this.secondsPerRound,
        //     prgrs,
        // });
    }
    progress(time){
        return (time % this.secondsPerRound) / this.secondsPerRound;
    }
    curPathId(prgrs){
        let pathCountF = this.pathCount;
        let curIdF = pathCountF * prgrs;
        let curId = Math.floor(curIdF);
        return curId;
    }
    nextPathId(curId){
        let nxtId = curId + 1;
        if(nxtId >= this.pathCount){
            nxtId = 0;
        }
        return nxtId;
    }
    evalCurPrgrsInBetween(time){
        let prgrs = this.progress(time);

        let curId = this.curPathId(prgrs);
        let nxtId = this.nextPathId(curId);

        let v0 = this.path[curId];
        let v1 = this.path[nxtId];
        
        let curIdF  = curId;
        let nxtIdF  = nxtId;
        let pthCntF = this.pathCount;

        let curIdPrgrs = curIdF / pthCntF;
        let nxtIdPrgrs = nxtIdF / pthCntF;
        let prgrInBetween = (prgrs - curIdPrgrs) / (nxtIdPrgrs - curIdPrgrs);  

        // console.log({
        //     time,
        //     prgrs,
        //     curId,
        //     nxtId,
        //     curIdPrgrs,
        //     prgrInBetween
        // });
        return prgrInBetween;              
        // return v0;
        // return v1;

        // return v0.clone().add( v1.clone().sub(v0.clone()).multiplyScalar(prgrInBetween) );
    }
    createInstcMeshTest(path){
        var geometry = new THREE.InstancedBufferGeometry().copy(new THREE.SphereBufferGeometry( 0.5, 32, 32 ));

        let p0 = path[0];
        this.p0 = p0;

        let curId = 0;
        this.curId = curId;
        this.path = path;
        this.pathCount = path.length;

        const rand = Math3D.rand;
        let pathArr = [];
        let initPos = [];
        let secondsPerRound = [];
        let rotVel = [];
        let rotOffs = [];
        path.forEach(p=>{
            initPos = initPos.concat( [0,0,0] );
            pathArr = pathArr.concat( [p.x, p.y, p.z] );
            secondsPerRound.push( this.secondsPerRound );//rand(2, 4) );
            rotVel.push( rand(0.1, 0.3) );
            rotOffs.push( rand(0.1, 0.3) );
        });
        console.log('path: ', path.length, '    pathArr: ', pathArr.length);
        geometry.addAttribute("initPos",         new THREE.InstancedBufferAttribute(new Float32Array(initPos), 3, false));
        geometry.addAttribute("secondsPerRound", new THREE.InstancedBufferAttribute(new Float32Array(secondsPerRound), 1, false));
        geometry.addAttribute("rotVel",          new THREE.InstancedBufferAttribute(new Float32Array(rotVel), 1, false));
        geometry.addAttribute("rotOffs",         new THREE.InstancedBufferAttribute(new Float32Array(rotOffs), 1, false));

        let material = new THREE.RawShaderMaterial({
            uniforms: {
                "time":      { value: 0.0 },
                "path":      { type: "fv",  value: pathArr },
                "pathCount": { value: path.length },
                // "uVec3" : { type: "v3", value: new THREE.Vector3( 0, 3, 0 ) },    // single Vector3
                "uFloatArray3" : { type: "fv",  value: [ 2.0, 3.0, 0.0, 0.4, 0.5, 0.6 ] }, // float array (vec3)
                // "curId": { value: curId },
            },
            vertexShader:   this.vertexShader(),
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
    vertexShader(){
        return `#version 300 es
            precision highp float;

            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform float time;
            uniform vec3 path[ 51 ];
            uniform int pathCount;
            uniform vec3 uVec3;
            uniform int curId;

            // uniform vec3 path;
            uniform vec3 uFloatArray3[ 2 ];
            in vec3 initPos;

            in vec3 position;
            in float secondsPerRound;
            in float rotVel;
            in float rotOffs;

            out vec3 col;

            float progress(){
                return mod(time, secondsPerRound) / secondsPerRound;
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
                float pthCntF = float(51);

                float curIdPrgrs = curIdF / pthCntF;
                float nxtIdPrgrs = nxtIdF / pthCntF;
                float prgrInBetween = (prgrs - curIdPrgrs) / (nxtIdPrgrs - curIdPrgrs);  
                // return v0;
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

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4( initPos + evalCurPos() + position, 1.0 );

                float prgrs = progress();
                col = vec3(prgrs, 0.0, 0.0);//uFloatArray3[0];
            }
        `;
    }
    fragmentShader(){
        return `#version 300 es
            precision highp float;

            in vec3 col;
            out vec4 fragCol;

            void main() {
                //fragCol = vec4(1.0, 0.0, 1.0, 1.0);
                fragCol = vec4(col, 1.0);
            }
        `;
    }
}

export default InstancedSphere;