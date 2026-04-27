"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { EB_Garamond, Noto_Serif_Hebrew } from "next/font/google";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { LearnJourneyRow } from "@/lib/learn-journey-hub";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const notoHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  weight: ["700"],
  display: "swap",
});

const IRON_GALL = "#2c1e14";
const PARCHMENT_TINT = "#f4e4bc";
const SCROLL_COLOR = "#e8d9be";
const PARCHMENT_URL = "/parchment-aged-vellum.png";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const h = () => setReduced(q.matches);
    q.addEventListener("change", h);
    return () => q.removeEventListener("change", h);
  }, []);
  return reduced;
}

function hasHebrewScript(s: string): boolean {
  return /[\u0590-\u05FF]/.test(s);
}

/** Canvas label: tiled parchment + iron-gall text (Latin or Hebrew font). */
function useModuleLabelTexture(
  label: string,
  parchment: THREE.Texture,
): THREE.CanvasTexture {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }
    const img = parchment.image as HTMLImageElement | undefined;
    const tileW = 256;
    const tileH = 170;
    if (img?.naturalWidth) {
      for (let y = 0; y < canvas.height; y += tileH) {
        for (let x = 0; x < canvas.width; x += tileW) {
          ctx.drawImage(img, x, y, tileW, tileH);
        }
      }
    } else {
      ctx.fillStyle = PARCHMENT_TINT;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = "rgba(60, 48, 32, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const display =
      label.length > 20 ? label.toUpperCase().slice(0, 18) + "…" : label.toUpperCase();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = IRON_GALL;
    ctx.shadowColor = "rgba(44, 30, 20, 0.55)";
    ctx.shadowBlur = 3;
    const he = hasHebrewScript(display);
    const family = (he ? notoHebrew : ebGaramond).style.fontFamily.replace(
      /'/g,
      "",
    );
    ctx.font = he
      ? `700 78px ${family}, serif`
      : `700 86px ${family}, Garamond, Georgia, serif`;
    ctx.fillText(display, 512, 128);
    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }, [label, parchment]);
}

/** Irregular edge via alphaMap (no fragile shader patch). */
function useDeckleAlpha(): THREE.CanvasTexture {
  return useMemo(() => {
    const w = 256;
    const h = 64;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    const pad = 10;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const ang = t * Math.PI * 2;
      const j = pad + (Math.random() - 0.5) * 6;
      const x = w / 2 + Math.cos(ang) * (w / 2 - j);
      const y = h / 2 + Math.sin(ang) * (h / 2 - j);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
  }, []);
}

type ArtifactModuleProps = {
  label: string;
  position: [number, number, number];
  isCurrent: boolean;
  reduceMotion: boolean;
  parchment: THREE.Texture;
  deckleAlpha: THREE.CanvasTexture;
  onSelect?: () => void;
};

function ArtifactModule({
  label,
  position,
  isCurrent,
  reduceMotion,
  parchment,
  deckleAlpha,
  onSelect,
}: ArtifactModuleProps) {
  const root = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const texture = useModuleLabelTexture(label, parchment);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    if (reduceMotion) {
      root.current.rotation.x = THREE.MathUtils.degToRad(-8);
      root.current.rotation.z = 0;
      return;
    }
    const breathe = Math.sin(t * 0.5) * 0.02;
    root.current.rotation.x = breathe + THREE.MathUtils.degToRad(-8);
    // Gentle left–right sway when this is the focused (enlarged) current stop
    root.current.rotation.z = isCurrent ? Math.sin(t * 0.62) * 0.038 : 0;
  });

  const scale = 1 + (hover ? 0.1 : 0) + (isCurrent ? 0.05 : 0);

  return (
    <group position={position} scale={scale}>
      <group ref={root} position={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          rotation={[THREE.MathUtils.degToRad(5), 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            if (onSelect && e.pointerType !== "touch") {
              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHover(false);
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={[4, 1.8, 24, 12]} />
          <meshStandardMaterial
            map={texture}
            alphaMap={deckleAlpha}
            transparent
            alphaTest={0.15}
            color="#ffffff"
            side={THREE.DoubleSide}
            roughness={0.72}
            metalness={0.02}
            emissive={isCurrent ? "#c9b896" : "#000000"}
            emissiveIntensity={isCurrent ? 0.18 : 0}
          />
        </mesh>

        <mesh position={[0, -0.92, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 0.45]} />
          <meshStandardMaterial
            color="#2a2218"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function moduleWorldPosition(
  i: number,
): [number, number, number] {
  const z = i * -7 + 10;
  const x = Math.sin(i * 0.9) * 4;
  return [x, 1, z];
}

/** Bronze yad aimed at current module. */
function ProgressYad({
  currentStopIndex,
  reduceMotion,
}: {
  currentStopIndex: number;
  reduceMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const aim = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3(1e5, 0, 0));
  const next = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const [px, , pz] = moduleWorldPosition(currentStopIndex);
    aim.current.set(px - 0.15, 0.75, pz + 0.05);
    const bob = Math.sin(t * 1.1) * 0.04;
    next.current.set(px + 1.05, 1.42 + bob, pz + 0.38);
    if (pos.current.x > 1e4) pos.current.copy(next.current);
    pos.current.lerp(next.current, reduceMotion ? 1 : 0.12);
    group.current.position.copy(pos.current);
    group.current.lookAt(aim.current);
    group.current.rotateX(THREE.MathUtils.degToRad(12));
  });

  return (
    <group ref={group}>
      <mesh castShadow rotation={[0.4, 0.08, -0.12]} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.024, 0.018, 0.48, 5]} />
        <meshStandardMaterial
          color="#4a3a2e"
          metalness={0.88}
          roughness={0.4}
        />
      </mesh>
      <mesh
        castShadow
        position={[-0.02, -0.25, 0.03]}
        rotation={[0.5, -0.22, 0.18]}
      >
        <coneGeometry args={[0.03, 0.11, 4]} />
        <meshStandardMaterial
          color="#5c4a3a"
          metalness={0.84}
          roughness={0.42}
        />
      </mesh>
    </group>
  );
}

type SceneInnerProps = {
  rows: readonly LearnJourneyRow[];
  currentStopIndex: number;
  onSelectSign: (i: number) => void;
  reduceMotion: boolean;
};

function PolishedParchmentSceneInner({
  rows,
  currentStopIndex,
  onSelectSign,
  reduceMotion,
}: SceneInnerProps) {
  const spotRef = useRef<THREE.SpotLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  const parchment = useLoader(THREE.TextureLoader, PARCHMENT_URL);
  const deckleAlpha = useDeckleAlpha();

  useLayoutEffect(() => {
    parchment.colorSpace = THREE.SRGBColorSpace;
    parchment.wrapS = parchment.wrapT = THREE.RepeatWrapping;
    parchment.repeat.set(3.5, 3.5);
    parchment.anisotropy = 4;
    parchment.needsUpdate = true;
  }, [parchment]);

  const floorTex = useMemo(() => {
    const t = parchment.clone();
    t.repeat.set(6, 6);
    t.needsUpdate = true;
    return t;
  }, [parchment]);

  useEffect(() => {
    return () => floorTex.dispose();
  }, [floorTex]);

  useLayoutEffect(() => {
    const L = spotRef.current;
    if (!L) return;
    L.target.position.set(0, 0, 12);
    scene.add(L.target);
    L.shadow.mapSize.set(2048, 2048);
    L.shadow.bias = -0.00008;
    L.shadow.radius = 10;
    return () => {
      scene.remove(L.target);
    };
  }, [scene]);

  useLayoutEffect(() => {
    const D = dirRef.current;
    if (!D) return;
    D.shadow.mapSize.set(2048, 2048);
    D.shadow.camera.near = 0.5;
    D.shadow.camera.far = 80;
    D.shadow.camera.left = -30;
    D.shadow.camera.right = 30;
    D.shadow.camera.top = 30;
    D.shadow.camera.bottom = -30;
    D.shadow.camera.updateProjectionMatrix();
    D.shadow.bias = -0.00005;
    D.shadow.radius = 6;
  }, []);

  return (
    <>
      <color attach="background" args={["#c9b896"]} />
      <ambientLight intensity={0.38} />
      <hemisphereLight
        color="#fff5e6"
        groundColor="#4a3d30"
        intensity={0.55}
      />

      <spotLight
        ref={spotRef}
        position={[10, 18, 16]}
        angle={0.5}
        penumbra={0.55}
        intensity={650}
        color="#fff4d6"
        castShadow
      />

      <directionalLight
        ref={dirRef}
        position={[-12, 22, 8]}
        intensity={1.35}
        color="#ffd9a8"
        castShadow
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          map={floorTex}
          color="#ffffff"
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {rows.map((row, i) => {
        const isCurrent = i === currentStopIndex;
        const [x, y, z] = moduleWorldPosition(i);
        return (
          <ArtifactModule
            key={row.cover.key}
            label={row.cover.label}
            position={[x, y, z]}
            isCurrent={isCurrent}
            reduceMotion={reduceMotion}
            parchment={parchment}
            deckleAlpha={deckleAlpha}
            onSelect={() => onSelectSign(i)}
          />
        );
      })}

      <ProgressYad
        currentStopIndex={currentStopIndex}
        reduceMotion={reduceMotion}
      />

      {/* Subtle depth: lighter than floor so cards stay readable */}
      <fog attach="fog" args={["#d4c4a8", 40, 95]} />
    </>
  );
}

function PolishedParchmentScene(props: SceneInnerProps) {
  return (
    <Suspense fallback={null}>
      <PolishedParchmentSceneInner {...props} />
    </Suspense>
  );
}

function CameraFollowWinding({
  currentStopIndex,
  n,
}: {
  currentStopIndex: number;
  n: number;
}) {
  const { camera } = useThree();
  const eye = useRef(new THREE.Vector3(0, 6, 18));
  const look = useRef(new THREE.Vector3());

  useFrame(() => {
    if (n < 1) return;
    const [x, , z] = moduleWorldPosition(currentStopIndex);
    look.current.set(x, 1.15, z);
    eye.current.lerp(new THREE.Vector3(x, 5.8, z + 7.5), 0.07);
    camera.position.copy(eye.current);
    camera.lookAt(look.current);
  });

  return null;
}

function InitialCameraRig() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 44;
      camera.near = 0.1;
      camera.far = 200;
      camera.position.set(0, 6, 18);
      camera.lookAt(0, 1, 10);
      camera.updateProjectionMatrix();
    }
  }, [camera]);
  return null;
}

function WebGlContextWatch({ onLost }: { onLost: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const dom = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      onLost();
    };
    dom.addEventListener("webglcontextlost", lost, false);
    return () => {
      dom.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, onLost]);
  return null;
}

type SifriaProps = {
  rows: readonly LearnJourneyRow[];
  currentStopIndex: number;
  onSelectSign: (i: number) => void;
  onWebGlUnavailable?: () => void;
  className?: string;
};

export function SifriaLearnJourney3D({
  rows,
  currentStopIndex,
  onSelectSign,
  onWebGlUnavailable,
  className = "",
}: SifriaProps) {
  const onCtxLost = useCallback(() => {
    onWebGlUnavailable?.();
  }, [onWebGlUnavailable]);
  const reduceMotionA11y = usePrefersReducedMotion();

  if (rows.length === 0) {
    return null;
  }

  const grainSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" result="t"/><feColorMatrix type="saturate" values="0" in="t"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.55"/></svg>`,
  );

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div
        className="relative h-[min(50vh,500px)] w-full min-h-[260px] overflow-hidden"
        style={{
          clipPath:
            "polygon(0% 4px,3px 0%,calc(100% - 2px) 0%,100% 5px,100% calc(100% - 3px),calc(100% - 4px) 100%,2px 100%,0% calc(100% - 4px))",
        }}
      >
        <Canvas
          shadows="soft"
          dpr={[1, 1.5]}
          camera={{ fov: 44, position: [0, 6, 18] }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "default",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0xc9b896, 1);
            gl.domElement.style.background = "#c9b896";
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <InitialCameraRig />
          <WebGlContextWatch onLost={onCtxLost} />
          <CameraFollowWinding
            currentStopIndex={currentStopIndex}
            n={rows.length}
          />
          <PolishedParchmentScene
            rows={rows}
            currentStopIndex={currentStopIndex}
            onSelectSign={onSelectSign}
            reduceMotion={reduceMotionA11y}
          />
        </Canvas>
        <div
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light"
          style={{
            opacity: reduceMotionA11y ? 0.03 : 0.05,
            backgroundImage: `url("data:image/svg+xml,${grainSvg}")`,
            backgroundSize: "180px 180px",
          }}
          aria-hidden
        />
      </div>
      <p className="sr-only">
        Three-dimensional parchment path with textured scroll, labeled modules in
        iron-gall ink (including Hebrew where used), warm spotlight and shadows,
        and a bronze pointer at your current stop. Select a module to open it.
        {reduceMotionA11y ? " Motion and grain are reduced." : ""}
      </p>
    </div>
  );
}
