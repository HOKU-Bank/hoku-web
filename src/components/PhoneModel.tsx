"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useInView, type MotionValue } from "motion/react";
import { Suspense, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";

const MODEL = "/models/iphone17pro.glb";
// The model is 0.793 units tall; scale it to a comfortable world size.
const S = 4;
// Display area measured from the model's texture: 0.363 x 0.776 model units,
// centred on the front face which sits at -0.0216 on the mesh's Y axis.
const SCREEN_W = 0.363 * S;
const SCREEN_H = 0.776 * S;
const FRONT_Z = 0.0216 * S + 0.004;
// Size of the DOM screen we stretch onto the display.
const PX_W = 300;
const PX_H = 640;

/* Projective mapping of the PX_W x PX_H screen onto four on-screen points.
   A single matrix3d homography needs no CSS 3D context, so it lines up with
   the WebGL model in every browser. */
type M3 = number[];
const adj = (m: M3): M3 => [
  m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
  m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
  m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
];
const mul = (a: M3, b: M3): M3 => {
  const c: M3 = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) c[3 * i + j] = a[3 * i] * b[j] + a[3 * i + 1] * b[3 + j] + a[3 * i + 2] * b[6 + j];
  return c;
};
const mulv = (m: M3, v: number[]) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];
function basis(p: number[]): M3 {
  const m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1];
  const v = mulv(adj(m), [p[6], p[7], 1]);
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}
const SRC = basis([0, 0, PX_W, 0, 0, PX_H, PX_W, PX_H]);
const SRC_ADJ = adj(SRC);
function homography(dst: number[]) {
  const t = mul(basis(dst), SRC_ADJ);
  for (let i = 0; i < 9; i++) t[i] /= t[8];
  return `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`;
}

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

function Iphone({ motion, screenRef }: { motion: PhoneMotion; screenRef: RefObject<HTMLDivElement | null> }) {
  const { scene } = useGLTF(MODEL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats as THREE.MeshStandardMaterial[]) {
        if (m.map) {
          // The body texture is fully opaque; blending only causes sorting glitches.
          m.transparent = false;
          m.alphaTest = 0;
          m.depthWrite = true;
          // The export leaves the body fully metallic, so the frame mirrors the
          // studio lights as silver bands; keep it a satin anodised colour.
          m.metalness = 0.3;
          m.roughness = 0.68;
          m.envMapIntensity = 0.35;
        } else {
          m.envMapIntensity = 1.1;
        }
        // Transmission makes three.js render the whole scene a second time
        // every frame; the lens glass looks the same without it.
        const phys = m as THREE.MeshPhysicalMaterial;
        if (phys.transmission) {
          phys.transmission = 0;
          phys.transparent = true;
          phys.opacity = Math.min(phys.opacity ?? 1, 0.35);
        }
        m.needsUpdate = true;
      }
    });
  }, [model]);

  const corners = useMemo(
    () => [
      new THREE.Vector3(-SCREEN_W / 2, SCREEN_H / 2, FRONT_Z),
      new THREE.Vector3(SCREEN_W / 2, SCREEN_H / 2, FRONT_Z),
      new THREE.Vector3(-SCREEN_W / 2, -SCREEN_H / 2, FRONT_Z),
      new THREE.Vector3(SCREEN_W / 2, -SCREEN_H / 2, FRONT_Z),
    ],
    [],
  );
  const v = useMemo(() => new THREE.Vector3(), []);
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

    // Pin the live screen to the display: project its corners and stretch the
    // DOM screen onto them. Hide it whenever the display faces away.
    const el = screenRef.current;
    if (el) {
      g.updateMatrixWorld();
      normal.set(0, 0, 1).applyQuaternion(g.quaternion);
      g.getWorldPosition(pos);
      toCam.copy(camera.position).sub(pos).normalize();
      if (normal.dot(toCam) <= 0.02) {
        el.style.visibility = "hidden";
      } else {
        const dst: number[] = [];
        for (const c of corners) {
          v.copy(c).applyMatrix4(g.matrixWorld).project(camera);
          dst.push((v.x + 1) * 0.5 * size.width, (1 - v.y) * 0.5 * size.height);
        }
        el.style.transform = homography(dst);
        el.style.visibility = "visible";
      }
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
    </group>
  );
}

function Studio({ lite }: { lite: boolean }) {
  return (
    <Environment resolution={lite ? 128 : 256} frames={1}>
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
  const screenRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  // Only spend GPU time while the phone is (nearly) on screen.
  const visible = useInView(hostRef, { margin: "200px 0px" });
  // Phones: fewer pixels and a smaller light probe; the model looks the same
  // at arm's length but costs far less GPU time per frame.
  const [lite] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches,
  );
  return (
    <div ref={hostRef} className={`isolate overflow-hidden ${className}`}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={lite ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 0, cameraZ], fov: 26 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 6]} intensity={1.4} />
        <directionalLight position={[-4, -2, -5]} intensity={0.6} color="#9aa6ff" />
        <Suspense fallback={null}>
          <Iphone motion={motion} screenRef={screenRef} />
          <Studio lite={lite} />
        </Suspense>
      </Canvas>
      <div
        ref={screenRef}
        key={screenKey}
        className="pointer-events-none absolute left-0 top-0 h-[640px] w-[300px] origin-top-left will-change-transform"
        style={{ visibility: "hidden" }}
      >
        {screen}
      </div>
    </div>
  );
}
