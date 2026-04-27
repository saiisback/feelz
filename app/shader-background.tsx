"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useEffect, useState } from "react";

const bgColors = { bgColor1: "#000000", bgColor2: "#000000" } as Record<
  string,
  string
>;

const SCHEMES = [
  { name: "focus", color1: "#0B5DBB", color2: "#00B7A7", color3: "#6BD4C7" },
  { name: "extrovert", color1: "#E73C7E", color2: "#FFBA3D", color3: "#FF7A33" },
  { name: "joy", color1: "#FFC107", color2: "#FF8A3D", color3: "#FF5A5A" },
  { name: "sleep", color1: "#4B2BBE", color2: "#FFBA3D", color3: "#8B5CF6" },
] as const;

const SCHEME_INTERVAL_MS = 6000;

export default function ShaderBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SCHEMES.length),
      SCHEME_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, []);

  const scheme = SCHEMES[index];

  return (
    <ShaderGradientCanvas
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
    >
      <ShaderGradient
        {...bgColors}
        animate="on"
        brightness={1.5}
        cAzimuthAngle={60}
        cDistance={7.1}
        cPolarAngle={90}
        cameraZoom={15.3}
        color1={scheme.color1}
        color2={scheme.color2}
        color3={scheme.color3}
        envPreset="dawn"
        grain="off"
        lightType="3d"
        positionX={0}
        positionY={-0.15}
        positionZ={0}
        range="disabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.1}
        rotationX={0}
        rotationY={0}
        rotationZ={0}
        shader="defaults"
        type="sphere"
        uAmplitude={1.4}
        uDensity={1.1}
        uFrequency={5.5}
        uSpeed={0.1}
        uStrength={0.4}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}
