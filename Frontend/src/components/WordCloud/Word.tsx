import { useRef, useState, useMemo } from "react";
import { Text, Billboard, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { WordCloudItem } from "../../types";

interface Props {
  item: WordCloudItem;
  position: [number, number, number];
  maxWeight: number;
}

const COLORS = [
  "#2563eb", "#4f46e5", "#7c3aed", "#9333ea",
  "#c026d3", "#db2777", "#be123c",
];

export default function Word({ item, position, maxWeight }: Props) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const normalized = item.weight / maxWeight;
  const fontSize = 0.15 + normalized * 0.55;

  const color = useMemo(() => {
    const idx = Math.min(Math.floor(normalized * COLORS.length), COLORS.length - 1);
    return COLORS[idx];
  }, [normalized]);

  // Gentle bob animation
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0] * 2) * 0.03;
  });

  return (
    <group ref={ref} position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={fontSize}
          color={hovered ? "#16a34a" : color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={hovered ? 0.005 : 0}
          outlineColor="#16a34a"
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          fillOpacity={0.8 + normalized * 0.2}
        >
          {item.word}
        </Text>

        {/* Tooltip on hover */}
        {hovered && (
          <Html
            position={[0, fontSize + 1.0, 0]}
            center
            distanceFactor={10}
            zIndexRange={[100, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div className="w-[100px] p-1.5 rounded-md glass-panel shadow-lg border border-white/20 backdrop-blur-md flex flex-col gap-1">
              <div className="flex justify-between items-center gap-1">
                <h3 className="text-[10px] font-bold text-[var(--text-primary)] capitalize leading-none truncate max-w-[60px]">
                  {item.word}
                </h3>
                <span className="text-[8px] font-mono text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-1 rounded-sm shrink-0">
                  {(normalized * 100).toFixed(0)}%
                </span>
              </div>

              <div className="w-full h-[2px] bg-[var(--text-secondary)]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${normalized * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-0.5 border-t border-[var(--text-secondary)]/10">
                <span className="text-[7px] text-[var(--text-secondary)] uppercase tracking-wider font-medium">Rel.</span>
                <span className="text-[7px] font-mono font-medium text-[var(--text-primary)]">
                  {item.weight.toFixed(3)}
                </span>
              </div>

              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--glass-panel)] border-b border-r border-[var(--glass-border)] rotate-45" />
            </div>
          </Html>
        )}
      </Billboard>
    </group>
  );
}
