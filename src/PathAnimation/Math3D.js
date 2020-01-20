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

    //-------------------------------------------

    // function CatmullRomGenerator(p0, p1, p2, p3){
//     const alpha = 0.5;

//     function tj(ti, pi, pj){
//         return Math.pow(
//                     Math.pow((pj.x-pi.x), 2) +
//                     Math.pow((pj.y-pi.y), 2),
//                  alpha) + ti;
//     }

//     const t0 = 0;
//     const t1 = tj(t0, p0, p1);
//     const t2 = tj(t1, p1, p2);
//     const t3 = tj(t2, p2, p3);

//     function CatmullRom(t){
//         const A1x = (t1 - t) / (t1 - t0) * p0.x + (t - t0) / (t1 - t0) * p1.x;
//         const A1y = (t1 - t) / (t1 - t0) * p0.y + (t - t0) / (t1 - t0) * p1.y;
//         // const A1z = (t1 - t) / (t1 - t0) * p0.z + (t - t0) / (t1 - t0) * p1.z;

//         const A2x = (t2 - t) / (t2 - t1) * p1.x + (t - t1) / (t2 - t1) * p2.x;
//         const A2y = (t2 - t) / (t2 - t1) * p1.y + (t - t1) / (t2 - t1) * p2.y;
//         // const A2z = (t2 - t) / (t2 - t1) * p1.z + (t - t1) / (t2 - t1) * p2.z;

//         const A3x = (t3 - t) / (t3 - t2) * p2.x + (t - t2) / (t3 - t2) * p3.x;
//         const A3y = (t3 - t) / (t3 - t2) * p2.y + (t - t2) / (t3 - t2) * p3.y;
//         // const A3z = (t3 - t) / (t3 - t2) * p2.z + (t - t2) / (t3 - t2) * p3.z;

//         const B1x = (t2 - t) / (t2 - t0) * A1x + (t - t0) / (t2 - t0) * A2x;
//         const B1y = (t2 - t) / (t2 - t0) * A1y + (t - t0) / (t2 - t0) * A2y;
//         // const B1z = (t2 - t) / (t2 - t0) * A1z + (t - t0) / (t2 - t0) * A2z;

//         const B2x = (t3 - t) / (t3 - t1) * A2x + (t - t1) / (t3 - t1) * A3x;
//         const B2y = (t3 - t) / (t3 - t1) * A2y + (t - t1) / (t3 - t1) * A3y;
//         // const B2z = (t3 - t) / (t3 - t1) * A2z + (t - t0) / (t2 - t0) * A3z;

//         const Cx = (t2 - t) / (t2 - t1) * B1x + (t - t1) / (t2 - t1) * B2x;
//         const Cy = (t2 - t) / (t2 - t1) * B1y + (t - t1) / (t2 - t1) * B2y;
//         // const Cz = (t2 - t) / (t2 - t1) * B1z + (t - t1) / (t2 - t1) * B2z;

//         let c = new THREE.Vector3(Cx, Cy, 0);// Cz);
//         return c;
//     }
//     return CatmullRom;
// }
}

export default Math3D;