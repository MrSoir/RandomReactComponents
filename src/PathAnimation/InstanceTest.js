import * as THREE from 'three';

class InstanceTest{
	vertexShader(){
		return `precision highp float;

			uniform float sineTime;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec3 offset;
			attribute vec4 color;
			attribute vec4 orientationStart;
			attribute vec4 orientationEnd;

			varying vec3 vPosition;
			varying vec4 vColor;

			void main(){

				vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
				vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
				vec3 vcV = cross( orientation.xyz, vPosition );
				vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

				vColor = color;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

			}
		`;
	}
	fragmentShader(){
		return `precision highp float;

			uniform float time;

			varying vec3 vPosition;
			varying vec4 vColor;

			void main() {

				vec4 color = vec4( vColor );
				color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

				gl_FragColor = color;

			}
		`;
	}
	genMesh(){		
		var vector = new THREE.Vector4();

		var instances = 50000;

		var positions = [];
		var offsets = [];
		var colors = [];
		var orientationsStart = [];
		var orientationsEnd = [];

		positions.push( 0.025, - 0.025, 0 );
		positions.push( - 0.025, 0.025, 0 );
		positions.push( 0, 0, 0.025 );
		for ( var i = 0; i < instances; i ++ ) {
			offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
			colors.push( Math.random(), Math.random(), Math.random(), Math.random() );
			vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
			vector.normalize();

			orientationsStart.push( vector.x, vector.y, vector.z, vector.w );

			vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
			vector.normalize();

			orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );
		}

		var geometry = new THREE.InstancedBufferGeometry();
		geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise

		console.log('geometry: ', geometry);
		geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
		geometry.addAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
		geometry.addAttribute( 'orientationStart', new THREE.InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
		geometry.addAttribute( 'orientationEnd', new THREE.InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );

		var material = new THREE.RawShaderMaterial( {
			uniforms: {
				"time": { value: 1.0 },
				"sineTime": { value: 1.0 }
			},
			vertexShader: this.vertexShader(),
			fragmentShader: this.fragmentShader(),
			side: THREE.DoubleSide,
			transparent: true

		} );

		var mesh = new THREE.Mesh( geometry, material );

		return mesh;
	}

	// function animate() {

	// 	requestAnimationFrame( animate );

	// 	render();
	// 	stats.update();

	// }

	// function render() {

	// 	var time = performance.now();

	// 	var object = scene.children[ 0 ];

	// 	object.rotation.y = time * 0.0005;
	// 	object.material.uniforms[ "time" ].value = time * 0.005;
	// 	object.material.uniforms[ "sineTime" ].value = Math.sin( object.material.uniforms[ "time" ].value * 0.05 );

	// 	renderer.render( scene, camera );

	// }
}

export default InstanceTest;
