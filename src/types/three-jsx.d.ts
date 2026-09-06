declare module '@react-three/fiber' {
  import * as React from 'react';
  export const useFrame: (callback: (state: any, delta: number) => void, renderPriority?: number) => void;
  export const Canvas: React.ComponentType<any>;
  export type ThreeElements = Record<string, any>;
  export type RootState = any;
}

declare namespace JSX {
  interface IntrinsicElements {
    ambientLight: any;
    directionalLight: any;
    pointLight: any;
    spotLight: any;
    mesh: any;
    group: any;
    sphereGeometry: any;
    capsuleGeometry: any;
    meshStandardMaterial: any;
    boxGeometry: any;
    planeGeometry: any;
    cylinderGeometry: any;
    torusGeometry: any;
    bufferGeometry: any;
    perspectiveCamera: any;
    color: any;
    fog: any;
    primitive: any;
    instancedMesh: any;
    [elemName: string]: any;
  }
}
