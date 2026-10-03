import { useEffect, useRef, useState } from "react";

/**
 * Fluid cursor: real WebGL2 fluid simulation (velocity + pressure + vorticity + dye).
 * Mouse movement injects colored dye + velocity, so the trail swirls and curls
 * like smoke. A lagging ring and an exact dot sit on top.
 *
 * No dependencies. Falls back to ring + dot if WebGL2 is unavailable.
 */

const CONFIG = {
  SIM_RESOLUTION: 128, // velocity grid (higher = finer swirls, heavier)
  DYE_RESOLUTION: 1024, // color grid (higher = sharper, heavier)
  DENSITY_DISSIPATION: 3.5, // how fast color fades (higher = shorter trail)
  VELOCITY_DISSIPATION: 2, // how fast motion dies (lower = longer swirling)
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 20,
  CURL: 3, // swirliness / vortices
  SPLAT_RADIUS: 0.2, // trail thickness
  SPLAT_FORCE: 6000, // how hard the cursor pushes the fluid
  COLOR_UPDATE_SPEED: 10, // how fast the hue changes along the trail
  COLOR_INTENSITY: 0.15, // brightness of the dye
  IDLE_STOP_MS: 4000, // stop simulating after this much idle time (saves GPU)
};

const HOVER_SELECTOR = "a, button, [data-cursor], [role='button'], input, textarea, select, label";

/* ---------------------------------- shaders --------------------------------- */

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG_HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`;

const FRAG = {
  clear: `
    uniform sampler2D uTexture;
    uniform float value;
    void main () { fragColor = value * texture(uTexture, vUv); }`,

  // premultiplied output: alpha follows brightness so the page shows through
  display: `
    uniform sampler2D uTexture;
    void main () {
      vec3 c = min(texture(uTexture, vUv).rgb, vec3(1.0));
      float a = max(c.r, max(c.g, c.b));
      fragColor = vec4(c, a);
    }`,

  splat: `
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
      vec2 p = vUv - point.xy;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      vec3 base = texture(uTarget, vUv).xyz;
      fragColor = vec4(base + splat, 1.0);
    }`,

  advection: `
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    void main () {
      vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
      vec4 result = texture(uSource, coord);
      float decay = 1.0 + dissipation * dt;
      fragColor = result / decay;
    }`,

  divergence: `
    uniform sampler2D uVelocity;
    void main () {
      float L = texture(uVelocity, vL).x;
      float R = texture(uVelocity, vR).x;
      float T = texture(uVelocity, vT).y;
      float B = texture(uVelocity, vB).y;
      vec2 C = texture(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; }
      if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; }
      if (vB.y < 0.0) { B = -C.y; }
      float div = 0.5 * (R - L + T - B);
      fragColor = vec4(div, 0.0, 0.0, 1.0);
    }`,

  curl: `
    uniform sampler2D uVelocity;
    void main () {
      float L = texture(uVelocity, vL).y;
      float R = texture(uVelocity, vR).y;
      float T = texture(uVelocity, vT).x;
      float B = texture(uVelocity, vB).x;
      float vorticity = R - L - T + B;
      fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }`,

  vorticity: `
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
      float L = texture(uCurl, vL).x;
      float R = texture(uCurl, vR).x;
      float T = texture(uCurl, vT).x;
      float B = texture(uCurl, vB).x;
      float C = texture(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 velocity = texture(uVelocity, vUv).xy;
      velocity += force * dt;
      velocity = min(max(velocity, -1000.0), 1000.0);
      fragColor = vec4(velocity, 0.0, 1.0);
    }`,

  pressure: `
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
      float L = texture(uPressure, vL).x;
      float R = texture(uPressure, vR).x;
      float T = texture(uPressure, vT).x;
      float B = texture(uPressure, vB).x;
      float divergence = texture(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      fragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }`,

  gradientSubtract: `
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture(uPressure, vL).x;
      float R = texture(uPressure, vR).x;
      float T = texture(uPressure, vT).x;
      float B = texture(uPressure, vB).x;
      vec2 velocity = texture(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      fragColor = vec4(velocity, 0.0, 1.0);
    }`,
};

/* --------------------------------- helpers ---------------------------------- */

type RGB = [number, number, number];

interface FBO {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
  tx: number;
  ty: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  w: number;
  h: number;
  tx: number;
  ty: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

function hsv(h: number, s: number, v: number): RGB {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}

const randomColor = (): RGB => {
  const c = hsv(Math.random(), 1, 1);
  return [c[0] * CONFIG.COLOR_INTENSITY, c[1] * CONFIG.COLOR_INTENSITY, c[2] * CONFIG.COLOR_INTENSITY];
};

/* ----------------------------- fluid simulation ----------------------------- */

function createFluid(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  }) as WebGL2RenderingContext | null;

  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
  gl.clearColor(0, 0, 0, 0);
  gl.disable(gl.BLEND);

  const makeProgram = (fragBody: string) => {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG_HEAD + fragBody));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p));
    const u: Record<string, WebGLUniformLocation | null> = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      if (info) u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return { p, u, use: () => gl.useProgram(p) };
  };

  const P = {
    clear: makeProgram(FRAG.clear),
    display: makeProgram(FRAG.display),
    splat: makeProgram(FRAG.splat),
    advection: makeProgram(FRAG.advection),
    divergence: makeProgram(FRAG.divergence),
    curl: makeProgram(FRAG.curl),
    vorticity: makeProgram(FRAG.vorticity),
    pressure: makeProgram(FRAG.pressure),
    gradient: makeProgram(FRAG.gradientSubtract),
  };

  // fullscreen quad
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const blit = (t: FBO | null) => {
    if (t) {
      gl.viewport(0, 0, t.w, t.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  const createFBO = (w: number, h: number, internal: number, format: number): FBO => {
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      tex,
      fbo,
      w,
      h,
      tx: 1 / w,
      ty: 1 / h,
      attach: (id: number) => {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        return id;
      },
    };
  };

  const createDouble = (w: number, h: number, internal: number, format: number): DoubleFBO => {
    const d: DoubleFBO = {
      w,
      h,
      tx: 1 / w,
      ty: 1 / h,
      read: createFBO(w, h, internal, format),
      write: createFBO(w, h, internal, format),
      swap: () => {
        const t = d.read;
        d.read = d.write;
        d.write = t;
      },
    };
    return d;
  };

  const free = (f: FBO | undefined) => {
    if (!f) return;
    gl.deleteTexture(f.tex);
    gl.deleteFramebuffer(f.fbo);
  };

  const getRes = (res: number) => {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(res);
    const max = Math.round(res * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
  };

  let dye!: DoubleFBO;
  let vel!: DoubleFBO;
  let pres!: DoubleFBO;
  let div!: FBO;
  let curl!: FBO;

  const initBuffers = () => {
    const sim = getRes(CONFIG.SIM_RESOLUTION);
    const dr = getRes(CONFIG.DYE_RESOLUTION);
    [dye?.read, dye?.write, vel?.read, vel?.write, pres?.read, pres?.write, div, curl].forEach(free);
    dye = createDouble(dr.w, dr.h, gl.RGBA16F, gl.RGBA);
    vel = createDouble(sim.w, sim.h, gl.RG16F, gl.RG);
    pres = createDouble(sim.w, sim.h, gl.R16F, gl.RED);
    div = createFBO(sim.w, sim.h, gl.R16F, gl.RED);
    curl = createFBO(sim.w, sim.h, gl.R16F, gl.RED);
  };

  const resize = () => {
    const s = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(canvas.clientWidth * s));
    const h = Math.max(1, Math.floor(canvas.clientHeight * s));
    if (canvas.width !== w || canvas.height !== h || !dye) {
      canvas.width = w;
      canvas.height = h;
      initBuffers();
    }
  };

  const splat = (x: number, y: number, dx: number, dy: number, color: RGB) => {
    const aspect = canvas.width / canvas.height;
    let radius = CONFIG.SPLAT_RADIUS / 100;
    if (aspect > 1) radius *= aspect;

    P.splat.use();
    gl.uniform1f(P.splat.u.aspectRatio, aspect);
    gl.uniform2f(P.splat.u.point, x, y);
    gl.uniform1f(P.splat.u.radius, radius);

    gl.uniform1i(P.splat.u.uTarget, vel.read.attach(0));
    gl.uniform3f(P.splat.u.color, dx, dy, 0);
    blit(vel.write);
    vel.swap();

    gl.uniform1i(P.splat.u.uTarget, dye.read.attach(0));
    gl.uniform3f(P.splat.u.color, color[0], color[1], color[2]);
    blit(dye.write);
    dye.swap();
  };

  const step = (dt: number) => {
    gl.disable(gl.BLEND);

    P.curl.use();
    gl.uniform2f(P.curl.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.curl.u.uVelocity, vel.read.attach(0));
    blit(curl);

    P.vorticity.use();
    gl.uniform2f(P.vorticity.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.vorticity.u.uVelocity, vel.read.attach(0));
    gl.uniform1i(P.vorticity.u.uCurl, curl.attach(1));
    gl.uniform1f(P.vorticity.u.curl, CONFIG.CURL);
    gl.uniform1f(P.vorticity.u.dt, dt);
    blit(vel.write);
    vel.swap();

    P.divergence.use();
    gl.uniform2f(P.divergence.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.divergence.u.uVelocity, vel.read.attach(0));
    blit(div);

    P.clear.use();
    gl.uniform1i(P.clear.u.uTexture, pres.read.attach(0));
    gl.uniform1f(P.clear.u.value, CONFIG.PRESSURE);
    blit(pres.write);
    pres.swap();

    P.pressure.use();
    gl.uniform2f(P.pressure.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.pressure.u.uDivergence, div.attach(0));
    for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(P.pressure.u.uPressure, pres.read.attach(1));
      blit(pres.write);
      pres.swap();
    }

    P.gradient.use();
    gl.uniform2f(P.gradient.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.gradient.u.uPressure, pres.read.attach(0));
    gl.uniform1i(P.gradient.u.uVelocity, vel.read.attach(1));
    blit(vel.write);
    vel.swap();

    P.advection.use();
    gl.uniform2f(P.advection.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.advection.u.uVelocity, vel.read.attach(0));
    gl.uniform1i(P.advection.u.uSource, vel.read.attach(0));
    gl.uniform1f(P.advection.u.dt, dt);
    gl.uniform1f(P.advection.u.dissipation, CONFIG.VELOCITY_DISSIPATION);
    blit(vel.write);
    vel.swap();

    gl.uniform1i(P.advection.u.uVelocity, vel.read.attach(0));
    gl.uniform1i(P.advection.u.uSource, dye.read.attach(1));
    gl.uniform1f(P.advection.u.dissipation, CONFIG.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  };

  const render = () => {
    gl.disable(gl.BLEND);
    P.display.use();
    gl.uniform1i(P.display.u.uTexture, dye.read.attach(0));
    blit(null);
  };

  /* pointer handling */
  const ptr = { x: 0, y: 0, px: 0, py: 0, moved: false, init: false };
  let color = randomColor();
  let colorTimer = 0;

  const move = (nx: number, ny: number) => {
    if (!ptr.init) {
      ptr.px = nx;
      ptr.py = ny;
      ptr.init = true;
    }
    ptr.x = nx;
    ptr.y = ny;
    ptr.moved = true;
  };

  const click = (nx: number, ny: number) => {
    const c = randomColor();
    splat(nx, ny, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), [c[0] * 10, c[1] * 10, c[2] * 10]);
  };

  const frame = (dt: number) => {
    colorTimer += dt * CONFIG.COLOR_UPDATE_SPEED;
    if (colorTimer >= 1) {
      colorTimer %= 1;
      color = randomColor();
    }

    if (ptr.moved) {
      ptr.moved = false;
      const aspect = canvas.width / canvas.height;
      let dx = ptr.x - ptr.px;
      let dy = ptr.y - ptr.py;
      const dist = Math.hypot(dx, dy);
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;

      // subdivide fast strokes so the ribbon stays continuous instead of dotted
      const steps = Math.min(10, Math.max(1, Math.ceil(dist / 0.015)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        splat(
          ptr.px + (ptr.x - ptr.px) * t,
          ptr.py + (ptr.y - ptr.py) * t,
          (dx * CONFIG.SPLAT_FORCE) / steps,
          (dy * CONFIG.SPLAT_FORCE) / steps,
          color
        );
      }
      ptr.px = ptr.x;
      ptr.py = ptr.y;
    }

    step(dt);
    render();
  };

  const dispose = () => {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  resize();
  return { resize, move, click, frame, dispose };
}

/* -------------------------------- component --------------------------------- */

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current!;
    const ringEl = ringRef.current!;
    const dotEl = dotRef.current!;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fluid = reduceMotion ? null : createFluid(canvas);

    document.documentElement.classList.add("custom-cursor");

    const mouse = { x: 0, y: 0 };
    const ring = { x: 0, y: 0, s: 1 };
    let inited = false;
    let visible = false;
    let hovering = false;
    let pressed = false;
    let lastActive = 0;

    const norm = (cx: number, cy: number): [number, number] => [
      cx / (canvas.clientWidth || window.innerWidth),
      1 - cy / (canvas.clientHeight || window.innerHeight),
    ];

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!inited) {
        inited = true;
        ring.x = e.clientX;
        ring.y = e.clientY;
      }
      visible = true;
      lastActive = performance.now();
      dotEl.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
      const [nx, ny] = norm(e.clientX, e.clientY);
      fluid?.move(nx, ny);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest?.(HOVER_SELECTOR);
      ringEl.style.borderColor = hovering ? "rgba(255,165,0,0.95)" : "rgba(255,255,255,0.35)";
      ringEl.style.backgroundColor = hovering ? "rgba(255,107,0,0.12)" : "rgba(255,255,255,0)";
    };

    const onDown = (e: MouseEvent) => {
      pressed = true;
      lastActive = performance.now();
      const [nx, ny] = norm(e.clientX, e.clientY);
      fluid?.click(nx, ny);
    };
    const onUp = () => (pressed = false);
    const onLeave = () => (visible = false);
    const onEnter = () => (visible = true);
    const onResize = () => fluid?.resize();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("resize", onResize);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    let raf = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - prev) / 1000, 0.016666);
      prev = now;
      if (!inited) return;

      // frame-rate independent easing for the ring
      const e = (f: number) => 1 - Math.pow(1 - f, Math.max(dt, 0.001) * 60);
      ring.x += (mouse.x - ring.x) * e(0.16);
      ring.y += (mouse.y - ring.y) * e(0.16);
      const sTarget = pressed ? 0.8 : hovering ? 1.7 : 1;
      ring.s += (sTarget - ring.s) * e(0.2);
      ringEl.style.transform = `translate3d(${ring.x}px,${ring.y}px,0) translate(-50%,-50%) scale(${ring.s})`;
      const o = visible ? "1" : "0";
      ringEl.style.opacity = o;
      dotEl.style.opacity = o;

      // run the fluid only while there is something to show
      if (fluid && now - lastActive < CONFIG.IDLE_STOP_MS) fluid.frame(dt);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      fluid?.dispose();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* fluid simulation */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[98] h-full w-full"
      />
      {/* lagging ring */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full"
        style={{
          width: 40,
          height: 40,
          border: "1.5px solid rgba(255,255,255,0.35)",
          backgroundColor: "rgba(255,255,255,0)",
          opacity: 0,
          willChange: "transform",
          transition: "border-color .25s ease, background-color .25s ease, opacity .3s ease",
        }}
      />
      {/* exact-position dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full"
        style={{
          width: 8,
          height: 8,
          background: "#fff",
          boxShadow: "0 0 10px rgba(255,255,255,0.6)",
          opacity: 0,
          willChange: "transform",
          transition: "opacity .3s ease",
        }}
      />
    </>
  );
}
