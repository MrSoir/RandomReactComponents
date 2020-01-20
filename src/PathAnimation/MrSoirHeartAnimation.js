import * as THREE from 'three';
import HeartAnimation from './HeartAnimation';
import InstancedSphere from './InstancedSphere';

class MrSoirHeartAnimation extends HeartAnimation{
    constructor({canvas}={}){
        super({canvas, createHeart:false});

        this.updateMrSoirPaths = this.updateMrSoirPaths.bind(this);

        this.addAnimationCallback(this.updateMrSoirPaths);
        this.pathTransitionProgress = 0;
        this.doTransition = false;

        this.genMrSoir();
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
    updateMrSoirPaths(){
        let offs = 0.015;
        this.pathTransitionProgress += offs;

        let  pathTransitionProgress = 0.5 + Math.sin(this.pathTransitionProgress);
        pathTransitionProgress = Math.min(pathTransitionProgress, 1);
        pathTransitionProgress = Math.max(pathTransitionProgress, 0);

        this.instancedPaths.forEach(ip=>{
            ip.updateUniforms({
                pathTransitionProgress
            });
        })
    }
    genMrSoir(){
        let mrSclFctr = 8;
        let soirSclFctr = mrSclFctr * 1.2;
        let iDotSclFctr = 1.5;
        const MRcr   = this.genCatmullRom( this.genMrPath(mrSclFctr), false );
        const SOIRcr = this.genCatmullRom( this.genSoirPath(soirSclFctr), false );
        const IDOTcr = this.genCatmullRom( this.genIDotPath(iDotSclFctr), true);

        const curve = this.genCatmullRomHeart();
        const heartPath = curve.getSpacedPoints ( 500 );

        let heartScales = [
            0.5, 1, 0.3
        ];

        const curves = [];
        curves.push(MRcr);
        curves.push(SOIRcr);
        curves.push(IDOTcr);

        let scale = [
            mrSclFctr,
            soirSclFctr,
            iDotSclFctr
        ];

        let translate = [];
        translate.push( new THREE.Vector3(-10, -1, 0) ); // Mr
        translate.push( new THREE.Vector3( -2, -4, 0) ); // Soir
        translate.push( new THREE.Vector3(  4.5, 1, 0) ); // i-dot

        let instanceCounts = [
             2000, // Mr
             5000, // Soir
              200, // idot
        ];
        let colors = [
            [0,1,0],
            [0,1,0],
            [0,1,0],
        ]
        let hearts = [
            false,
            false,
            false
        ];
        
        curves.map((curve, id)=>{
            let trnsl = translate[id];
            let col = colors[id];
            
            const points = curve.getSpacedPoints ( 500 );

            let is, mesh;
            
            // is = new InstancedSphere();
            // mesh = is.createInstcMeshTest({
            //     path: points,
            //     instanceCount: instanceCounts[id] * 0.1,
            //     startAtOrigin: false,
            //     cameraRotation: this.cameraRot,
            //     secondsPerLoop: 30,
            //     rotationVelocity: 2,
            //     rotationOffset: 1,
            //     rotEllipseOffs: 2,
            //     color: [col[0]*0.2, col[1]*0.2, col[2]*0.1],
            //     colRange: 0.5,
            //     hearts: hearts[id],
            // });
            // mesh.geometry.translate(trnsl.x, trnsl.y, trnsl.z);
            // this.addInstancedPath(is);

            let heartScale = heartScales[id];
            let path2 = heartPath.map(v=>{
                return new THREE.Vector3(v.x * heartScale, v.y * heartScale, v.z * heartScale);
            })
    
            is = new InstancedSphere();
            mesh = is.createInstcMeshTest({
                path: points,
                path2: path2,
                instanceCount: instanceCounts[id] * 0.3,
                startAtOrigin: false,
                initOffset: 1,
                cameraRotation: this.cameraRot,
                secondsPerLoop: 2,
                rotationVelocity: 4,
                rotationOffset: 1,
                rotEllipseOffs: 3,
                color: col,
                colRange: 0.5,
                hearts: hearts[id],
            });
            mesh.geometry.translate(trnsl.x, trnsl.y, trnsl.z);
            this.addInstancedPath( is );
        });
    }
}

export default MrSoirHeartAnimation;