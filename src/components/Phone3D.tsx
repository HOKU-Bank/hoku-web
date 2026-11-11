"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, type ComponentProps } from "react";
import { PhoneStill } from "./PhoneStill";

// three.js and the model load only on desktops; phones and tablets get a still.
const PhoneModel = dynamic(() => import("./PhoneModel").then((m) => m.PhoneModel), { ssr: false });

const LITE = "(max-width: 1023px), (pointer: coarse)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(LITE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function Phone3D(props: ComponentProps<typeof PhoneStill>) {
  // null on the server: render nothing until the device is known.
  const lite = useSyncExternalStore(subscribe, () => window.matchMedia(LITE).matches, () => null);
  if (lite === null) return <div className={props.className} />;
  return lite ? <PhoneStill {...props} /> : <PhoneModel {...props} />;
}
