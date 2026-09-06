import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DancingTeddyBear: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 4) * 0.15;
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.1;
    }

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 3) * 0.15;
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 4) * 0.6;
      leftArmRef.current.rotation.z = 0.2 + Math.sin(t * 2) * 0.1;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.6;
      rightArmRef.current.rotation.z = -0.2 - Math.sin(t * 2) * 0.1;
    }

    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t * 4 + Math.PI / 2) * 0.2;
    }

    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = Math.sin(t * 4 - Math.PI / 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Torso / Body */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color="#9a3412" roughness={0.7} />
      </mesh>

      {/* Belly Patch */}
      <mesh position={[0, 0.45, 0.48]} scale={[1, 1.1, 0.4]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.35, 0]}>
        {/* Main Head */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.42, 0.4, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
        <mesh position={[0.42, 0.4, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>

        {/* Inner Ears */}
        <mesh position={[-0.42, 0.4, 0.08]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        <mesh position={[0.42, 0.4, 0.08]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>

        {/* Snout */}
        <mesh position={[0, -0.08, 0.4]} scale={[1, 0.7, 0.6]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.52]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.18, 0.1, 0.44]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        <mesh position={[0.18, 0.1, 0.44]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
      </group>

      {/* Left Arm Pivot Group */}
      <group ref={leftArmRef} position={[-0.65, 0.75, 0]}>
        <mesh position={[-0.1, -0.25, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.13, 0.4, 16, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm Pivot Group */}
      <group ref={rightArmRef} position={[0.65, 0.75, 0]}>
        <mesh position={[0.1, -0.25, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.13, 0.4, 16, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
      </group>

      {/* Left Leg Pivot Group */}
      <group ref={leftLegRef} position={[-0.32, -0.15, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.15, 0.3, 16, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Leg Pivot Group */}
      <group ref={rightLegRef} position={[0.32, -0.15, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.15, 0.3, 16, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};
