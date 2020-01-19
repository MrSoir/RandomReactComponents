import * as THREE from 'three';

const Math3D = {
    quaternion: (axis, angle)=>{
        let quat = Math3D.quaternionFromAxisAngle( axis.clone().normalize(), angle );

		return quat;
    },
    quaternionMatrix: (axis, angle)=>{
        let quat = Math3D.quaternion(axis, angle);
        return Math3D.quaternionToMat(quat);
    },
    quaternionToMat: (q)=>{
        let m40 = new THREE.Matrix4();
        m40.set(
             q.w,  q.z, -q.y,  q.x,
            -q.z,  q.w,  q.x,  q.y,
             q.y, -q.x,  q.w,  q.z,
            -q.x, -q.y, -q.z,  q.w
        );
        let m41 = new THREE.Matrix4();
        m41.set(
            q.w,  q.z, -q.y, -q.x,
           -q.z,  q.w,  q.x, -q.y,
            q.y, -q.x,  q.w, -q.z,
            q.x,  q.y,  q.z,  q.w
        );
        return m40.transpose().multiply(m41.transpose());
    },
    quaternionFromAxisAngle: (axis, angle)=>{
        axis = axis.clone().normalize();
        let x = axis.x * Math.sin(angle * 0.5);
        let y = axis.y * Math.sin(angle * 0.5);
        let z = axis.z * Math.sin(angle * 0.5);
        let w = Math.cos(angle * 0.5);
        return new THREE.Quaternion(x, y, z, w);
    },
    //-------------------------------------------
    arbitraryOrthogonal: (vec)=>{
        let vtar = vec.clone().normalize();

        let vref = new THREE.Vector3(0,1,0);
        if(vref.dot(vtar) === 1){
            vref = new THREE.Vector3(1,0,0);
        }

        let cross = vref.cross(vtar).normalize();
        return cross;
    },
    //-------------------------------------------
    rand: (min=-1.0, max=1.0)=>{
        return min + Math.random() * (max - min);
    },
}

export default Math3D;