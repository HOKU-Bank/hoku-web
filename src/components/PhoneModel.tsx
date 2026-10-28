"use client";

import { Environment, Html, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

const MODEL = "/models/iphone17pro.glb";
// The model is 0.793 units tall; scale it to a comfortable world size.
const S = 4;
// Display area measured from the model's texture: 0.363 x 0.776 model units,
// centred on the front face which sits at -0.0216 on the mesh's Y axis.
const SCREEN_W = 0.363 * S;
const FRONT_Z = 0.0216 * S + 0.004;
// drei's <Html transform> maps 400px to `distanceFactor` world units.
const SCREEN_PX = 300;
const DISTANCE_FACTOR = (SCREEN_W * 400) / SCREEN_PX;

useGLTF.preload(MODEL);

export type PhoneMotion = {
  /** degrees */
  rotateX?: MotionValue<number>;
  /** degrees */
  rotateY?: MotionValue<number>;
  /** degrees */
  rotateZ?: MotionValue<number>;
  /** world units, positive moves the phone up */
  lift?: MotionValue<number>;
  scale?: MotionValue<number>;
};

function Iphone({ motion, screen, screenKey }: { motion: PhoneMotion; screen: ReactNode; screenKey?: string | number }) {
  const { scene } = useGLTF(MODEL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const group = useRef<THREE.Group>(null);
  const screenEl = useRef<HTMLDivElement>(null);
  const { camera } = useThree();
  // drei's <Html> can miss its first render when mounted in the same commit
  // as the scene; mount the screen a frame later.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats as THREE.MeshStandardMaterial[]) {
        // The body texture is fully opaque; blending only causes sorting glitches.
        if (m.map) {
          m.transparent = false;
          m.alphaTest = 0;
          m.depthWrite = true;
        }
        m.envMapIntensity = 1.1;
        m.needsUpdate = true;
      }
    });
  }, [model]);

  const normal = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const d = THREE.MathUtils.degToRad;
    const t = state.clock.elapsedTime;
    g.rotation.set(
      d(motion.rotateX?.get() ?? 0),
      d(motion.rotateY?.get() ?? 0),
      d(motion.rotateZ?.get() ?? 0),
      "YXZ",
    );
    g.position.y = (motion.lift?.get() ?? 0) + Math.sin(t * 0.9) * 0.06;
    g.scale.setScalar(motion.scale?.get() ?? 1);

    // Hide the live screen whenever its face points away from the camera.
    if (screenEl.current) {
      normal.set(0, 0, 1).applyQuaternion(g.quaternion);
      g.getWorldPosition(pos);
      toCam.copy(camera.position).sub(pos).normalize();
      const facing = normal.dot(toCam);
      screenEl.current.style.visibility = facing > 0.02 ? "visible" : "hidden";
    }
  });

  return (
    <group ref={group}>
      {/* mesh space: +Y is the back, -Z the camera end; turn it to face us upright */}
      <group rotation={[0, Math.PI, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={S}>
          <primitive object={model} />
        </group>
      </group>
      {ready && (
      <Html
        transform
        distanceFactor={DISTANCE_FACTOR}
        position={[0, 0, FRONT_Z]}
        zIndexRange={[20, 0]}
        pointerEvents="none"
      >
        <div ref={screenEl} key={screenKey} style={{ visibility: "hidden" }}>
          {screen}
        </div>
      </Html>
      )}
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group rotation={[-Math.PI / 3, 0, 0]}>
        <Lightformer form="rect" intensity={3} position={[0, 6, -4]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-6, 1, 0]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#b9b6f0" position={[0, 0, 8]} scale={4} />
      </group>
    </Environment>
  );
}

// A WebGL canvas holding the iPhone 17 Pro model with live React UI on its display.
export function PhoneModel({
  motion,
  screen,
  screenKey,
  className = "",
  cameraZ = 9,
}: {
  motion: PhoneMotion;
  screen: ReactNode;
  screenKey?: string | number;
  className?: string;
  cameraZ?: number;
}) {
  return (
    <div className={`isolate ${className}`}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, cameraZ], fov: 26 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 6]} intensity={1.4} />
        <directionalLight position={[-4, -2, -5]} intensity={0.6} color="#9aa6ff" />
        <Suspense fallback={null}>
          <Iphone motion={motion} screen={screen} screenKey={screenKey} />
          <Studio />
        </Suspense>
      </Canvas>
    </div>
  );
}
