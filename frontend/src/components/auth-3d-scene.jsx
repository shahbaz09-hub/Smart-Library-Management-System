import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingBooks() {
  const items = useMemo(
    () => [
      { position: [-3.8, 1.9, -2.5], scale: 0.46, speed: 1.2, color: '#189ab4' },
      { position: [3.9, 1.6, -3.2], scale: 0.4, speed: 1.6, color: '#75e6da' },
      { position: [-4.4, -1.4, -1.7], scale: 0.34, speed: 1.1, color: '#58c8d0' },
      { position: [4.1, -1.7, -2.8], scale: 0.52, speed: 1.4, color: '#2ea9bf' },
    ],
    [],
  );

  return (
    <group>
      {items.map((item, index) => (
        <Float key={`book-${index}`} speed={item.speed} floatIntensity={0.6} rotationIntensity={0.55}>
          <group position={item.position} scale={item.scale}>
            <mesh castShadow>
              <boxGeometry args={[1.05, 1.4, 0.23]} />
              <meshStandardMaterial color={item.color} metalness={0.2} roughness={0.35} />
            </mesh>
            <mesh position={[0.0, 0.0, 0.13]}>
              <boxGeometry args={[0.98, 1.29, 0.04]} />
              <meshStandardMaterial color="#d4f1f4" roughness={0.9} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

function FloatingPages() {
  const pages = useMemo(
    () => [
      { position: [-2.6, 2.8, -4.4], rot: [0.6, 0.2, 0.8], speed: 1.1 },
      { position: [2.3, 2.5, -4.1], rot: [0.4, 0.4, -0.6], speed: 1.5 },
      { position: [-3.1, -2.5, -3.6], rot: [0.8, -0.5, 0.2], speed: 1.2 },
      { position: [3.0, -2.3, -4.5], rot: [0.2, 0.7, -0.4], speed: 1.7 },
      { position: [0.8, -3.0, -5.0], rot: [0.3, 0.1, 0.6], speed: 1.35 },
    ],
    [],
  );

  return (
    <group>
      {pages.map((page, index) => (
        <Float key={`page-${index}`} speed={page.speed} floatIntensity={0.8} rotationIntensity={0.75}>
          <mesh position={page.position} rotation={page.rot}>
            <planeGeometry args={[0.56, 0.78]} />
            <meshStandardMaterial color="#d4f1f4" transparent opacity={0.88} side={THREE.DoubleSide} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function FloatingLibraryIcons() {
  return (
    <group>
      <Float speed={1.1} floatIntensity={0.8} rotationIntensity={1.2}>
        <mesh position={[-1.6, 3.1, -5.5]}>
          <torusGeometry args={[0.3, 0.08, 16, 32]} />
          <meshStandardMaterial color="#75e6da" emissive="#75e6da" emissiveIntensity={0.4} />
        </mesh>
      </Float>

      <Float speed={1.6} floatIntensity={0.9} rotationIntensity={1.2}>
        <mesh position={[1.8, 3.3, -5.2]}>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color="#189ab4" metalness={0.5} roughness={0.2} emissive="#75e6da" emissiveIntensity={0.22} />
        </mesh>
      </Float>

      <Float speed={1.45} floatIntensity={0.7} rotationIntensity={1.0}>
        <mesh position={[0, -3.25, -5.7]}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#4ec2cd" metalness={0.45} roughness={0.22} />
        </mesh>
      </Float>
    </group>
  );
}

function FlyingBirds({ cardHovered }) {
  const flockRef = useRef(null);
  const wingRefs = useRef([]);
  const birds = useMemo(
    () => [
      { baseY: 2.3, baseZ: -1.3, speed: 0.11, phase: 0.08, scale: 1.35, color: '#ecfcff' },
      { baseY: 1.8, baseZ: -1.9, speed: 0.13, phase: 0.38, scale: 1.22, color: '#d4f1f4' },
      { baseY: 2.65, baseZ: -2.2, speed: 0.12, phase: 0.54, scale: 1.18, color: '#bff6f9' },
      { baseY: 1.45, baseZ: -1.1, speed: 0.1, phase: 0.76, scale: 1.28, color: '#dffcff' },
      { baseY: 2.05, baseZ: -2.55, speed: 0.125, phase: 0.93, scale: 1.15, color: '#c8f8fb' },
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    birds.forEach((bird, index) => {
      const birdMesh = flockRef.current?.children[index];
      if (!birdMesh) return;

      const travel = (t * bird.speed + bird.phase) % 1;
      const x = THREE.MathUtils.lerp(-7.2, 7.2, travel);
      const z = bird.baseZ + Math.sin(travel * Math.PI * 2 + bird.phase * 7) * 0.46;
      const y = bird.baseY + Math.sin(t * 2.2 + bird.phase * 12) * 0.24 + (cardHovered ? 0.06 : 0);

      birdMesh.position.set(x, y, z);
      birdMesh.rotation.y = -Math.PI / 2 + Math.sin(t * 0.9 + bird.phase * 8) * 0.08;
      birdMesh.rotation.x = Math.sin(t * 1.2 + bird.phase * 9) * 0.05;
      birdMesh.rotation.z = Math.sin(t * 1.8 + bird.phase * 6) * 0.05;

      const flap = Math.sin(t * (cardHovered ? 22 : 15) + bird.phase * 15) * 0.95;
      const leftWing = wingRefs.current[index * 2];
      const rightWing = wingRefs.current[index * 2 + 1];

      if (leftWing) leftWing.rotation.z = 0.18 + flap;
      if (rightWing) rightWing.rotation.z = -0.18 - flap;
    });
  });

  return (
    <group ref={flockRef}>
      {birds.map((bird, index) => (
        <group key={`bird-${index}`} scale={bird.scale}>
          <mesh position={[0, 0.02, 0.02]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color={bird.color} emissive="#bff8fb" emissiveIntensity={0.24} roughness={0.45} />
          </mesh>

          <mesh position={[0, 0.03, 0.18]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#ecfcff" emissive="#ffffff" emissiveIntensity={0.12} />
          </mesh>

          <mesh position={[-0.02, 0.01, -0.15]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.04, 0.14, 6]} />
            <meshStandardMaterial color="#9fe8ed" />
          </mesh>

          <mesh
            ref={(node) => {
              wingRefs.current[index * 2] = node;
            }}
            position={[-0.16, 0.03, 0.02]}
            rotation={[0.04, 0.1, 0.25]}
          >
            <planeGeometry args={[0.42, 0.14]} />
            <meshStandardMaterial color="#d4f1f4" emissive="#75e6da" emissiveIntensity={0.18} transparent opacity={0.92} side={THREE.DoubleSide} />
          </mesh>

          <mesh
            ref={(node) => {
              wingRefs.current[index * 2 + 1] = node;
            }}
            position={[0.16, 0.03, 0.02]}
            rotation={[0.04, -0.1, -0.25]}
          >
            <planeGeometry args={[0.42, 0.14]} />
            <meshStandardMaterial color="#d4f1f4" emissive="#75e6da" emissiveIntensity={0.18} transparent opacity={0.92} side={THREE.DoubleSide} />
          </mesh>

          <mesh position={[-0.22, -0.01, -0.1]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#ecfcff" emissive="#75e6da" emissiveIntensity={0.2} transparent opacity={0.8} />
          </mesh>

          <mesh position={[-0.3, -0.02, -0.13]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#ecfcff" emissive="#75e6da" emissiveIntensity={0.18} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InteractiveBook({ cardHovered, loginPhase }) {
  const bookGroup = useRef(null);
  const frontCover = useRef(null);
  const pageRefs = useRef([]);
  const auraRef = useRef(null);
  const burstRefs = useRef([]);
  const openProgress = useRef(0);
  const burstProgress = useRef(0);

  const burstDirections = useMemo(
    () =>
      Array.from({ length: 44 }, () => {
        const v = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(1),
          THREE.MathUtils.randFloatSpread(1),
          THREE.MathUtils.randFloatSpread(1),
        )
          .normalize()
          .multiplyScalar(THREE.MathUtils.randFloat(0.8, 2.8));
        return v;
      }),
    [],
  );

  useFrame((state, delta) => {
    const targetOpen = loginPhase === 'idle' ? 0 : 1;
    const targetBurst = loginPhase === 'success' ? 1 : 0;

    openProgress.current = THREE.MathUtils.damp(openProgress.current, targetOpen, 3.8, delta);
    burstProgress.current = THREE.MathUtils.damp(burstProgress.current, targetBurst, 2.8, delta);

    if (bookGroup.current) {
      const t = state.clock.elapsedTime;
      bookGroup.current.position.y = Math.sin(t * 1.25) * 0.16;
      bookGroup.current.rotation.y = Math.sin(t * 0.45) * 0.26 + openProgress.current * 0.08;
      bookGroup.current.rotation.x = Math.cos(t * 0.38) * 0.04;
    }

    if (frontCover.current) {
      frontCover.current.rotation.y = -openProgress.current * 2.1 - (cardHovered ? 0.07 : 0);
    }

    pageRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime;
      const wave = Math.sin(t * (1.6 + index * 0.16)) * 0.05;
      mesh.rotation.y = -openProgress.current * (0.38 + index * 0.09) + wave * openProgress.current;
      mesh.position.x = openProgress.current * (0.03 + index * 0.016);
    });

    if (auraRef.current) {
      const auraMaterial = auraRef.current.material;
      auraMaterial.emissiveIntensity = THREE.MathUtils.damp(
        auraMaterial.emissiveIntensity,
        cardHovered ? 1.15 : 0.35,
        4,
        delta,
      );
      auraRef.current.scale.setScalar(1 + openProgress.current * 0.28);
    }

    burstRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const direction = burstDirections[index];
      const speed = 2.2 + index * 0.03;
      mesh.position.set(
        direction.x * burstProgress.current * speed,
        direction.y * burstProgress.current * speed,
        direction.z * burstProgress.current * speed,
      );
      mesh.scale.setScalar(Math.max(0, (1 - burstProgress.current * 0.82) * 0.12));
      const burstMaterial = mesh.material;
      burstMaterial.opacity = Math.max(0, 0.9 - burstProgress.current);
    });
  });

  return (
    <group ref={bookGroup}>
      <mesh ref={auraRef} position={[0, 0, -0.18]}>
        <sphereGeometry args={[1.35, 28, 28]} />
        <meshStandardMaterial color="#189ab4" emissive="#189ab4" emissiveIntensity={0.4} transparent opacity={0.15} />
      </mesh>

      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow position={[-0.03, 0, -0.04]}>
          <boxGeometry args={[1.32, 1.82, 0.18]} />
          <meshStandardMaterial color="#05445e" metalness={0.2} roughness={0.38} />
        </mesh>

        <mesh castShadow position={[-0.66, 0, 0]}>
          <boxGeometry args={[0.12, 1.82, 0.23]} />
          <meshStandardMaterial color="#043648" metalness={0.3} roughness={0.32} />
        </mesh>

        <group ref={frontCover} position={[-0.66, 0, 0]}>
          <mesh castShadow position={[0.66, 0, 0.09]}>
            <boxGeometry args={[1.32, 1.82, 0.16]} />
            <meshStandardMaterial color="#189ab4" metalness={0.3} roughness={0.29} />
          </mesh>
          <mesh position={[0.76, 0, 0.18]}>
            <planeGeometry args={[1.0, 1.45]} />
            <meshStandardMaterial color="#75e6da" emissive="#75e6da" emissiveIntensity={0.3} transparent opacity={0.24} />
          </mesh>
        </group>

        {Array.from({ length: 7 }).map((_, index) => (
          <mesh
            key={`main-page-${index}`}
            ref={(mesh) => {
              pageRefs.current[index] = mesh;
            }}
            position={[-0.03, 0, 0.04 + index * 0.012]}
            castShadow
          >
            <boxGeometry args={[1.18, 1.68, 0.02]} />
            <meshStandardMaterial color="#f5f9ff" roughness={0.88} metalness={0.02} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0, 0.2]}>
        {burstDirections.map((_, index) => (
          <mesh
            key={`burst-${index}`}
            ref={(mesh) => {
              burstRefs.current[index] = mesh;
            }}
          >
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#75e6da" emissive="#75e6da" emissiveIntensity={1.1} transparent opacity={0} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SceneContent({ cardHovered, loginPhase }) {
  useFrame((state, delta) => {
    const target = new THREE.Vector3(state.pointer.x * 0.55, state.pointer.y * 0.32, 8.2);
    state.camera.position.lerp(target, 1 - Math.exp(-delta * 2.3));
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={['#022f40']} />
      <fog attach="fog" args={['#022f40', 7, 22]} />

      <ambientLight intensity={0.6} />
      <pointLight position={[3.6, 4.6, 5.2]} intensity={2.0} color="#189ab4" />
      <pointLight position={[-3.6, -2.4, 3.6]} intensity={1.2} color="#75e6da" />
      <spotLight position={[0, 5, 6]} angle={0.35} penumbra={0.8} intensity={1.4} color="#d4f1f4" />

      <Stars radius={40} depth={30} count={1400} factor={3.1} saturation={0} fade speed={0.45} />
      <Sparkles count={90} speed={0.2} size={2.4} scale={[18, 10, 12]} color="#75e6da" />
      <Sparkles count={18} speed={1} size={4.8} scale={[3.6, 2.6, 3.2]} color="#d4f1f4" />

      <FloatingBooks />
      <FloatingPages />
      <FloatingLibraryIcons />
      <FlyingBirds cardHovered={cardHovered} />
      <InteractiveBook cardHovered={cardHovered} loginPhase={loginPhase} />
    </>
  );
}

export default function Auth3DScene({ cardHovered, loginPhase }) {
  return (
    <Canvas dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 8.2], fov: 52 }}>
      <SceneContent cardHovered={cardHovered} loginPhase={loginPhase} />
    </Canvas>
  );
}
