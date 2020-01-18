import * as THREE from 'three';

const Math3D = {
    quaternion: (v0)=>{
        let vtar = v0.clone().normalize();

        let vref = new THREE.Vector3(0,1,0);
        if(vref.clone().dot(vtar) === 1){
            vref = new THREE.Vector3(1,0,0);
        }

        let cross = vref.clone().cross(vtar).normalize();
		let angle = vref.clone().angleTo(vtar);

        let quat = new THREE.Quaternion().setFromAxisAngle( cross.clone(), angle );
        // let quat = Math3D.quaternionFromAxisAngle( cross, angle );

		return {quat, vref, cross};
    },
    evalArbitraryOrthogonal: (vec)=>{
        let vtar = vec.clone().normalize();

        let vref = new THREE.Vector3(0,1,0);
        if(vref.clone().dot(vtar) === 1){
            vref = new THREE.Vector3(1,0,0);
        }

        let cross = vref.clone().cross(vtar).normalize();
        return cross;
    },
    orthogonalQuaternion: (dir, angle)=>{
        let quat = new THREE.Quaternion().setFromAxisAngle( dir.clone(), angle );

		return quat;
    },
    orthogonalQuaternion_bckup: (dir, angle)=>{
		let vref = new THREE.Vector3(0,1,0);
		let vtar = dir.normalize();

		let cross = vref.clone().cross(vtar).normalize();

        // let quat = new THREE.Quaternion().setFromAxisAngle( cross, angle );
        let quat = Math3D.quaternionFromAxisAngle( cross, angle );

		return quat;
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
    roationAroundAxis: (axis, angle)=>{
        let v = axis;

        let x = v.x;
        let y = v.y;
        let z = v.z;

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let x2 = v.x*v.x;
        let y2 = v.y*v.y;
        let z2 = v.z*v.z;

        const m3 = new THREE.Matrix3();

        let m00 = cos + x2 * (1 - cos);
        let m01 = x * y * (1 - cos) - z * sin;
        let m02 = x * z * (1 - cos) + y * sin;

        let m10 = y * x * (1 - cos) + z * sin;
        let m11 = cos + y2 * (1 - cos);
        let m12 = y * z * (1 - cos) - x * sin;
        
        let m20 = z * x * (1 - cos) - y * sin;
        let m21 = z * y + (1 - cos) + x * sin;
        let m22 = cos + z2 * (1 - cos);
        
        m3.set(
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22
        )
        return m3;
    },
}

export default Math3D;