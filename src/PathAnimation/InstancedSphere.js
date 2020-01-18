import * as THREE from 'three';

class InstancedSphere{
    constructor(){
        this.DATA_HEIGHT = 2;
    }
    createSphereGeometry({size=0.1}={}){
        let geometry = new THREE.SphereGeometry( size, 8, 8 );
        return geometry;
    }
    genCustomShapeMesh(){
        let geometry = this.createSphereGeometry();
        let material = this.createCustomShaderMaterial();
		let mesh = new THREE.Mesh(geometry, material );//new THREE.MeshPhongMaterial() );
		return mesh;
	}
	createCustomShaderMaterial(){
		let vertexShader = `#version 300 es
		
			out vec3 frgmntPos;
			out vec2 vUv;
			
			void main(){
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				frgmntPos = position;
				vUv = uv;
			}
		`;
		let fragmentShader = `#version 300 es
		
			precision highp float;
			precision highp int;
			
			in vec3 frgmntPos;
			in vec2 vUv;
			
			uniform float maxY;
			uniform float minY;
			
			const vec3 col = vec3(0.0, 1.0, 0.0);
			
			out vec4 out_FragColor;
			
			void main() {
				float a = (vUv.y - minY) / (maxY - minY);
				
				out_FragColor = vec4(col, a);
			}
		`;
		
		let material = new THREE.ShaderMaterial({
			uniforms: {
//				resolution: { value: new THREE.Vector2() },
				minY: {value: 0.0},
				maxY: {value: this.DATA_HEIGHT}
			},
			transparent: true,
			blending: THREE.NormalBlending,
			side: THREE.DoubleSide,
		
			vertexShader,
			fragmentShader
		});
		
		return material;
    }
}

export default InstancedSphere;