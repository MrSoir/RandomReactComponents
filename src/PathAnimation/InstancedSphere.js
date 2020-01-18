import * as THREE from 'three';

class InstancedSphere{
    constructor(){
        this.DATA_HEIGHT = 2;
    }
    createInstcMeshTest(){
        var cubeGeo = new THREE.InstancedBufferGeometry().copy(new THREE.SphereBufferGeometry( 1, 32, 32 ));
        //cubeGeo.maxInstancedCount = 8;

        const offs = 2;

        cubeGeo.addAttribute("cubePos", new THREE.InstancedBufferAttribute(new Float32Array([
             offs,  offs,  offs,
             offs,  offs, -offs,
            -offs,  offs,  offs,
            -offs,  offs, -offs,
             offs, -offs,  offs,
             offs, -offs, -offs,
            -offs, -offs,  offs,
            -offs, -offs, -offs
        ]), 3, 1));

        var vertexShader = `#version 300 es
            precision highp float;

            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;

            in vec3 position;
            in vec3 cubePos;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4( cubePos + position, 1.0 );

            }
        `;
        var fragmentShader = `#version 300 es
            precision highp float;

            out vec4 fragCol;

            void main() {
                fragCol = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;

        var mat = new THREE.RawShaderMaterial({
        uniforms: {},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent: false
        });

        var mesh = new THREE.Mesh(cubeGeo, mat);

        return mesh;
    }
    createSphereGeometry({size=0.1}={}){
        // let geometry = new THREE.SphereGeometry( size, 8, 8 );
        // return geometry;

        let geometry;

        let circleGeometry = new THREE.CircleBufferGeometry( 5, 32 );

        geometry       = new THREE.InstancedBufferGeometry();
        geometry.index = circleGeometry.index;
        geometry.attributes = circleGeometry.attributes;

        let particleCount = 75000;

        let translateArray = new Float32Array( particleCount * 3 );

        for(let i = 0, i3 = 0, l = particleCount; i < l; i ++, i3 += 3) {
            translateArray[ i3 + 0 ] = Math.random() * 2 - 1;
            translateArray[ i3 + 1 ] = Math.random() * 2 - 1;
            translateArray[ i3 + 2 ] = Math.random() * 2 - 1;
        }
        geometry.addAttribute( 'translate', new THREE.InstancedBufferAttribute( translateArray, 3 ) );

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
    genInstancedMesh(){
        let geometry, material, mesh;

        let circleGeometry = new THREE.CircleBufferGeometry( 1, 6 );

        geometry = new THREE.InstancedBufferGeometry();
        geometry.index = circleGeometry.index;
        geometry.attributes = circleGeometry.attributes;

        let particleCount = 75000;

        let translateArray = new Float32Array( particleCount * 3 );

        for(let i = 0, i3 = 0, l = particleCount; i < l; i ++, i3 += 3) {
            translateArray[ i3 + 0 ] = Math.random() * 2 - 1;
            translateArray[ i3 + 1 ] = Math.random() * 2 - 1;
            translateArray[ i3 + 2 ] = Math.random() * 2 - 1;
        }

        console.log('geometry: ', geometry, geometry.setAttribute);
        geometry.addAttribute( 'translate', new THREE.InstancedBufferAttribute( translateArray, 3 ) );

        material = new THREE.RawShaderMaterial({
            uniforms: {
                "time": { value: 0.0 }
            },
            vertexShader:   this.vertexShader(),
            fragmentShader: this.fragmentShader(),
            depthTest: true,
            depthWrite: true
        });

        mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }
    vertexShader(){
        return `#version 300 es
            precision highp float;
            precision highp int;

            out vec3 frgmntPos;
            
            void main(){
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                frgmntPos = position;
            }
        `;
    }
    fragmentShader(){
        return `#version 300 es
            precision highp float;
            precision highp int;
            
            const vec3 col = vec3(0.0, 1.0, 0.0);
            
            out vec4 out_FragColor;
            
            void main() {
                out_FragColor = vec4(col, 1.0);
            }
        `;
    }
}

export default InstancedSphere;