import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Word from "./Word";
import type { WordCloudItem } from "../../types";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  words: WordCloudItem[];
}

/** Distribute points on a sphere using a fibonacci spiral, with slight radius jitter. */
function spherePositions(count: number, radius: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const jitteredRadius = radius * (0.8 + Math.random() * 0.4);

    positions.push([
      Math.cos(theta) * r * jitteredRadius,
      y * radius,
      Math.sin(theta) * r * jitteredRadius,
    ]);
  }
  return positions;
}

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
    }
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ words }: Props) {
  const { theme } = useTheme();

  const maxWeight = useMemo(
    () => Math.max(...words.map((w) => w.weight), 0.001),
    [words],
  );

  const positions = useMemo(
    () => spherePositions(words.length, 3.5),
    [words.length],
  );

  const fogColor = theme === "light" ? "#f5f5f7" : "#050505";

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.4} />
      <fog attach="fog" args={[fogColor, 0, 16]} />

      <RotatingGroup>
        {words.map((item, i) => (
          <Word
            key={item.word}
            item={item}
            position={positions[i]}
            maxWeight={maxWeight}
          />
        ))}
      </RotatingGroup>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4}
        maxDistance={20}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
}

export default function WordCloud({ words }: Props) {
  if (words.length === 0) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene words={words} />
    </Canvas>
  );
}
