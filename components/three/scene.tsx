"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { pointer, scroll } from "@/lib/motion-store";

const ACCENT = "#c6ff3d";
const MAX_DPR = 1.75;

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uDistort;
varying vec3 vPos;
varying float vNoise;
${NOISE}
void main(){
  float n = snoise(normal * 1.35 + vec3(uMouse * 0.35, uTime * 0.22));
  vNoise = n;
  vec3 p = position + normal * n * uDistort;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const CORE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uWire;
varying vec3 vPos;
varying float vNoise;
void main(){
  vec3 V = normalize(-vPos);
  // Flat facets from screen-space derivatives -> crystalline look.
  vec3 N = normalize(cross(dFdx(vPos), dFdy(vPos)));
  if (dot(N, V) < 0.0) N = -N;
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.2);
  float lit = clamp(dot(N, normalize(vec3(0.4, 0.7, 0.6))), 0.0, 1.0);
  vec3 base = vec3(0.02, 0.026, 0.05) + lit * vec3(0.05, 0.06, 0.12);
  vec3 col = base + uColor * (fres * 0.85 + max(vNoise, 0.0) * 0.12);
  if (uWire > 0.5) {
    gl_FragColor = vec4(uColor, 0.28 * uOpacity * (0.35 + fres));
  } else {
    gl_FragColor = vec4(col, uOpacity);
  }
  #include <colorspace_fragment>
}
`;

const POINTS_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
varying float vTwinkle;
varying float vAccent;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.2 + aSeed * 20.0) * 0.15;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed) / -mv.z;
  vTwinkle = 0.5 + 0.5 * sin(uTime * 1.4 + aSeed * 40.0);
  vAccent = step(0.84, fract(aSeed * 7.0));
}
`;

const POINTS_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vTwinkle;
varying float vAccent;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 c = mix(vec3(0.78, 0.84, 1.0), uColor, vAccent);
  gl_FragColor = vec4(c, a * (0.2 + 0.55 * vTwinkle) * uOpacity);
  #include <colorspace_fragment>
}
`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const damp = THREE.MathUtils.damp;

// Deterministic PRNG so geometry generation stays pure.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Where the scene's focal object sits as the page scrolls (fractions of viewport). */
const WAYPOINTS = [
  { p: 0.0, x: 0.27, y: 0.0, s: 1.0, o: 1.0 }, // hero: right, behind the terminal
  { p: 0.16, x: 0.33, y: 0.1, s: 0.7, o: 0.42 }, // about: text is left, orb stays right
  { p: 0.42, x: -0.04, y: 0.0, s: 0.6, o: 0.2 }, // work: recedes behind the carousel
  { p: 0.7, x: 0.33, y: -0.08, s: 0.7, o: 0.34 }, // certifications
  { p: 1.0, x: 0.0, y: 0.0, s: 1.2, o: 0.32 }, // contact: swells back in
];

function sampleWaypoints(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    if (p <= b.p) {
      const t = THREE.MathUtils.smootherstep((p - a.p) / (b.p - a.p), 0, 1);
      return {
        x: THREE.MathUtils.lerp(a.x, b.x, t),
        y: THREE.MathUtils.lerp(a.y, b.y, t),
        s: THREE.MathUtils.lerp(a.s, b.s, t),
        o: THREE.MathUtils.lerp(a.o, b.o, t),
      };
    }
  }
  return WAYPOINTS[WAYPOINTS.length - 1];
}

function coreUniforms(wire: boolean) {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uDistort: { value: 0.2 },
    uColor: { value: new THREE.Color(ACCENT) },
    uOpacity: { value: 1 },
    uWire: { value: wire ? 1 : 0 },
  };
}

/* ------------------------------------------------------------------ */
/*  Scene pieces                                                       */
/* ------------------------------------------------------------------ */
const RINGS = [
  { r: 2.05, tilt: [1.2, 0.2, 0] as const, speed: 0.22 },
  { r: 2.55, tilt: [0.4, 0.9, 0.3] as const, speed: -0.15 },
  { r: 3.1, tilt: [1.9, -0.4, 0.6] as const, speed: 0.1 },
];

function Particles({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(7);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.pow(rand(), 0.7) * 14;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(phi) - 4;
      seed[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 38 },
      uColor: { value: new THREE.Color(ACCENT) },
      uOpacity: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    const m = material.current;
    const pts = points.current;
    if (!m || !pts) return;
    const t = state.clock.elapsedTime;
    m.uniforms.uTime.value = t;
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    // Full strength in the hero, quieter behind body copy afterwards.
    m.uniforms.uOpacity.value = 0.3 + 0.7 * Math.max(0, 1 - scroll.progress * 5);
    pts.rotation.y = t * 0.014 + scroll.progress * 0.9 + pointer.x * 0.04;
    pts.rotation.x = pointer.y * -0.03;
    pts.position.z = scroll.progress * 3;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={POINTS_VERT}
        fragmentShader={POINTS_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function World({ particleCount }: { particleCount: number }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Group | null)[]>([]);
  const ringMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const solid = useRef<THREE.ShaderMaterial>(null);
  const wire = useRef<THREE.ShaderMaterial>(null);

  const solidUniforms = useMemo(() => coreUniforms(false), []);
  const wireUniforms = useMemo(() => coreUniforms(true), []);
  const sim = useRef({
    x: 0,
    y: 0,
    s: 1,
    o: 1,
    mx: 0,
    my: 0,
    vel: 0,
    lastY: 0,
    init: false,
  });

  useFrame((state, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const st = sim.current;
    const wp = sampleWaypoints(scroll.progress);
    const { width, height } = state.viewport;

    const tx = wp.x * width;
    const ty = wp.y * height;
    if (!st.init) {
      // Start already in place so the first frame doesn't swoop in.
      st.x = tx;
      st.y = ty;
      st.s = wp.s;
      st.o = wp.o;
      st.lastY = scroll.y;
      st.init = true;
    }

    st.x = damp(st.x, tx, 3.2, dt);
    st.y = damp(st.y, ty, 3.2, dt);
    st.s = damp(st.s, wp.s, 3.2, dt);
    st.o = damp(st.o, wp.o, 3.2, dt);
    st.mx = damp(st.mx, pointer.x, 3.5, dt);
    st.my = damp(st.my, pointer.y, 3.5, dt);

    const v = (scroll.y - st.lastY) / Math.max(dt, 1e-3);
    st.lastY = scroll.y;
    st.vel = damp(st.vel, THREE.MathUtils.clamp(v / 2400, -1, 1), 5, dt);
    const energy = Math.abs(st.vel);

    g.position.set(st.x, st.y, 0);
    g.scale.setScalar(st.s * (1 + energy * 0.08));
    g.rotation.y = t * 0.12 + st.mx * 0.55 + scroll.progress * Math.PI * 2;
    g.rotation.x = -st.my * 0.35 + scroll.progress * 0.9 + st.vel * 0.25;

    for (const m of [solid.current, wire.current]) {
      if (!m) continue;
      m.uniforms.uTime.value = t;
      m.uniforms.uMouse.value.set(st.mx, st.my);
      m.uniforms.uDistort.value = 0.2 + energy * 0.22 + Math.abs(st.mx) * 0.04;
      m.uniforms.uOpacity.value = st.o;
    }

    RINGS.forEach((ring, i) => {
      const rg = rings.current[i];
      if (rg) {
        rg.rotation.z = t * ring.speed + scroll.progress * (i + 1) * 1.4;
        rg.rotation.x = ring.tilt[0] + st.my * 0.15 * (i + 1);
        rg.rotation.y = ring.tilt[1] + st.mx * 0.15 * (i + 1);
      }
      const rm = ringMats.current[i];
      if (rm) rm.opacity = 0.55 * st.o;
    });

    // Parallax camera drift.
    const cam = state.camera;
    cam.position.x = damp(cam.position.x, st.mx * 0.55, 2.2, dt);
    cam.position.y = damp(cam.position.y, st.my * 0.35, 2.2, dt);
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <Particles count={particleCount} />
      <group ref={group}>
        <mesh renderOrder={1}>
          <icosahedronGeometry args={[1.5, 2]} />
          <shaderMaterial
            ref={solid}
            vertexShader={CORE_VERT}
            fragmentShader={CORE_FRAG}
            uniforms={solidUniforms}
            transparent
          />
        </mesh>
        <mesh scale={1.004} renderOrder={2}>
          <icosahedronGeometry args={[1.5, 2]} />
          <shaderMaterial
            ref={wire}
            vertexShader={CORE_VERT}
            fragmentShader={CORE_FRAG}
            uniforms={wireUniforms}
            transparent
            wireframe
            depthWrite={false}
          />
        </mesh>
        {RINGS.map((ring, i) => (
          <group
            key={ring.r}
            ref={(el) => {
              rings.current[i] = el;
            }}
          >
            <mesh>
              <torusGeometry args={[ring.r, 0.005, 6, 180]} />
              <meshBasicMaterial
                ref={(el) => {
                  ringMats.current[i] = el;
                }}
                color={ACCENT}
                transparent
                opacity={0.5}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[ring.r, 0, 0]}>
              <octahedronGeometry args={[0.07, 0]} />
              <meshBasicMaterial color={ACCENT} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

/** Drops pixel ratio if the GPU can't hold ~48fps. Never raises it again (no flapping). */
function AdaptiveQuality() {
  const setDpr = useThree((s) => s.setDpr);
  const stats = useRef({
    frames: 0,
    time: 0,
    dpr: Math.min(
      typeof window === "undefined" ? 1 : window.devicePixelRatio,
      MAX_DPR
    ),
    windows: 0,
  });

  useFrame((_, delta) => {
    const s = stats.current;
    s.frames += 1;
    s.time += Math.min(delta, 0.25);
    if (s.frames < 90) return;

    const avg = s.time / s.frames;
    s.windows += 1;
    // Ignore the first window: it includes shader compilation.
    if (s.windows > 1 && avg > 1 / 48 && s.dpr > 1) {
      s.dpr = Math.max(1, s.dpr - 0.25);
      setDpr(s.dpr);
    }
    s.frames = 0;
    s.time = 0;
  });

  return null;
}

export function Scene({ onReady }: { onReady?: () => void }) {
  const lowEnd =
    typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;
  const particleCount = lowEnd ? 700 : 1500;

  return (
    <Canvas
      dpr={[1, MAX_DPR]}
      camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      flat
      resize={{ scroll: false, debounce: { scroll: 0, resize: 120 } }}
      style={{ pointerEvents: "none" }}
      onCreated={() => onReady?.()}
    >
      <World particleCount={particleCount} />
      <AdaptiveQuality />
    </Canvas>
  );
}
