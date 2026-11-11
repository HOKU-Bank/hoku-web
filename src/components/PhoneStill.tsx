"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { PhoneMotion } from "./PhoneModel";

// A still render of the 3D model (public/models/phone-still.webp) at rotateX 5°,
// rotateY -20°, camera 8.6. Phones and tablets get this instead of WebGL: no
// three.js, no model download, and the live screen still sits on the display.
const IMG_W = 572;
const IMG_H = 1170;
const RENDER_CAMERA_Z = 8.6;
const PHONE_FRACTION = 0.8186; // phone height / canvas height at RENDER_CAMERA_Z
const BASE_X = 5;
const BASE_Y = -20;
// Maps the 300x640 screen onto the display in the image's own pixels.
const SCREEN_MATRIX =
  "matrix3d(1.54245, -0.113476, 0, -0.0001916, 0.063791, 1.72344, 0, 4.59e-05, 0, 0, 1, 0, 16.44, 51.98, 0, 1)";
// visible world height per unit of camera distance (fov 26°)
const VIEW = 2 * Math.tan((13 * Math.PI) / 180);

export function PhoneStill({
  motion: m,
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
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostH, setHostH] = useState(0);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setHostH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const phoneH = (hostH * PHONE_FRACTION * RENDER_CAMERA_Z) / cameraZ;
  const k = phoneH / IMG_H;

  const zero = useMotionValue(0);
  const one = useMotionValue(1);
  const rx = m.rotateX ?? zero;
  const ry = m.rotateY ?? zero;
  const rotateX = useTransform(rx, (a) => Math.max(-14, Math.min(14, a - BASE_X)));
  // A flat image cannot spin: turn the 3D yaw into a gentle sway instead.
  const rotateY = useTransform(ry, (a) => 14 * Math.sin(((a - BASE_Y) * Math.PI) / 180));
  const rotateZ = m.rotateZ ?? zero;
  const scale = m.scale ?? one;
  const y = useTransform(m.lift ?? zero, (l) => (-l / (VIEW * cameraZ)) * hostH);

  return (
    <div ref={hostRef} className={`isolate [perspective:1400px] ${className}`}>
      {hostH > 0 && (
        <motion.div
          style={{ rotateX, rotateY, rotateZ, scale, y, width: IMG_W * k, height: phoneH, marginLeft: (-IMG_W * k) / 2, marginTop: -phoneH / 2 }}
          className="absolute left-1/2 top-1/2"
        >
          <div className="phone-float h-full w-full">
          <div
            className="relative origin-top-left"
            style={{ width: IMG_W, height: IMG_H, transform: `scale(${k})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/models/phone-still.webp" alt="" width={IMG_W} height={IMG_H} className="absolute inset-0" draggable={false} />
            <div
              key={screenKey}
              className="pointer-events-none absolute left-0 top-0 h-[640px] w-[300px] origin-top-left"
              style={{ transform: SCREEN_MATRIX }}
            >
              {screen}
            </div>
          </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
