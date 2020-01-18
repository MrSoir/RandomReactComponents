import * as THREE from 'three';
import Math3D from './Math3D';

class PathTravellor{
    constructor({path, moveVel, rotVel=0.01, rotOffs=0.1, ranomStartPos=false}){
        this.path = path;
        this.moveVel = moveVel;
        this.rotVel  = rotVel;
        this.rotOffs = rotOffs;

        this.curPathId = 0;
        this.curPathIdOffsSq = 0;
        this.curRot = 0;

        this.posAlrCalculated = false;

        if(ranomStartPos){
            this.setRandomPos();
        }
    }
    setRandomPos(){
        this.curPathId = Math.floor( Math.random() * this.path.length );
    }
    pos(){
        return this.curPos();
    }
    curPos(){
        if(this.posAlrCalculated){
            return this._pos;
        }
        this.posAlrCalculated = true;

        let p0 = this.curPoint();
        let p1 = this.nextPoint();
        let dir = p1.clone().sub(p0);
        let prgrs = this.curPathIdOffsSq / dir.lengthSq();
        let posOnPath = p0.add( p1.sub(p0).multiplyScalar( prgrs ) );

        let angle = this.curRot;
        let mat = Math3D.quaternionMatrix(dir, angle);
        let ortho = Math3D.arbitraryOrthogonal(dir);
        let rotUni = ortho.clone().applyMatrix4(mat);
        let rot = rotUni.multiplyScalar( this.rotOffs );

        let posRot = posOnPath.clone().add(rot);

        this._pos = posRot;

        return this._pos;
    }

    move(){
        this._movePos();
        this._moveRot();
    }
    _movePos(){
        this.posAlrCalculated = false;

        let moveDt = this.moveVel * this.moveVel;
        let dt = this.curPathIdOffsSq + moveDt;

        let p0 = this.curPoint();
        let p1 = this.nextPoint();

        let dtBetweenPoints = this.copyV3(p1).sub(p0).lengthSq();

        // let obj = {
        //     dtBetweenPoints,
        //     dt,
        //     moveDt,
        //     p0, p1,
        //     curPathId: this.curPathId
        // };

        while(dtBetweenPoints <= dt){
            dt -= dtBetweenPoints;

            this.incrementPathId();
            p0 = this.curPoint();
            p1 = this.nextPoint();
            dtBetweenPoints = this.copyV3(p1).sub(p0).lengthSq();

            // obj = {
            //     dtBetweenPoints,
            //     dt,
            //     moveDt,
            //     p0, p1,
            //     curPathId: this.curPathId
            // };
            // console.log('updated obj: ', obj);
        }

        this.curPathIdOffsSq = dt;
    }
    _moveRot(){
        this.curRot = (this.curRot + this.rotVel) % (Math.PI * 2);
    }
    copyV3(vec){
        return new THREE.Vector3(vec.x, vec.y, vec.z);
    }
    curPoint(){
        return this.copyV3(this.path[this.curPathId]);
    }
    nextPoint(){
        let id = (this.curPathId + 1) % this.path.length;
        return this.copyV3(this.path[id]);
    }
    incrementPathId(){
        this.curPathId = (this.curPathId + 1) % this.path.length;
    }
    prevPoint(){
        let id = this.curPathId - 1;
        if(id < 0){
            id = this.path.length - 1;
        }
        return this.copyV3(this.path[id]);
    }

}

export default PathTravellor;