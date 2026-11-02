// Vitrine 3D: MacBook + iPhone com os sites reais rolando nas telas.
// Rolando a página, o par atravessa a tela de um lado pro outro e a tela troca de projeto com uma varredura.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const section = document.getElementById('trabalhos');
const canvas = document.getElementById('work3d');
const panels = [...document.querySelectorAll('.wk')];
const bar = document.querySelector('.work__bar i');
const counter = document.querySelector('.work__count b');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const PROJECTS = ['rancho', 'mozzi', 'khalifa', 'jogos'];
const N = PROJECTS.length;

// ---------- renderer / cena
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;   // sombra macia de verdade

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
// estúdio fotográfico de verdade (HDRI CC0 da Poly Haven) pros reflexos do metal e do vidro
// e também o cenário: o estúdio branco desfocado atrás, como foto de produto com fundo fora de foco
new RGBELoader().load('assets/3d/photo_studio_01_1k.hdr', hdr => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = pmrem.fromEquirectangular(hdr).texture;
  scene.background = hdr;
  scene.backgroundBlurriness = .42;
  bgTheme();
});
function bgTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  scene.backgroundIntensity = dark ? .085 : .8;
  ground.material.opacity = dark ? .7 : .42;   // sombra preta, macia
}
addEventListener('themechange', bgTheme);

const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);

// luz de estúdio: principal macia em cima/esquerda + dois recortes por trás pra desenhar as bordas
const key = new THREE.DirectionalLight(0xffffff, 2);
key.position.set(-3.5, 6, 4.5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.radius = 7; key.shadow.blurSamples = 20;
key.shadow.bias = -.0004;
Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 20 });
scene.add(key);
const rimL = new THREE.DirectionalLight(0xfff1dd, 2.6); rimL.position.set(-6, 3, -5); scene.add(rimL);
const rimR = new THREE.DirectionalLight(0xdff0ff, 2.4); rimR.position.set(6, 2.5, -4); scene.add(rimR);
const fill = new THREE.DirectionalLight(0xffffff, .5); fill.position.set(4, 1, 6); scene.add(fill);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: .22 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// tela: mostra o print do site rolando; troca de projeto com uma varredura diagonal de luz
function screenMaterial() {
  return new THREE.ShaderMaterial({
    toneMapped: false,
    uniforms: { flipV: { value: 0 }, flipU: { value: 0 }, a: { value: null }, b: { value: null }, fa: { value: 1 }, fb: { value: 1 }, sa: { value: 0 }, sb: { value: 0 }, mixv: { value: 0 }, glow: { value: 0 } },
    vertexShader: 'uniform float flipV, flipU; varying vec2 vUv; void main(){ vUv = vec2(flipU > .5 ? 1. - uv.x : uv.x, flipV > .5 ? 1. - uv.y : uv.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `
      uniform sampler2D a, b; uniform float fa, fb, sa, sb, mixv, glow; varying vec2 vUv;
      vec3 samp(sampler2D t, float f, float s) { return texture2D(t, vec2(vUv.x, 1. - (s + (1. - vUv.y) * f))).rgb; }
      void main() {
        vec3 A = samp(a, fa, sa), B = samp(b, fb, sb);
        float e = vUv.x * .75 + (1. - vUv.y) * .25;
        float th = mixv * 1.16;
        float k = 1. - smoothstep(th - .08, th, e);
        float edge = exp(-pow((e - th + .04) / .018, 2.)) * step(.001, mixv) * step(mixv, .999);
        vec3 col = mix(A, B, k) + vec3(.55, 1., .7) * edge * .6;
        // reflexo do vidro: faixa diagonal suave
        gl_FragColor = vec4(col * glow, 1.);
        #include <colorspace_fragment>
      }`,
  });
}

// ---------- modelos reais (glTF, CC BY 4.0):
// "macbook pro M3 16 inch 2024" por jackbaeten e "Apple iPhone 15 Pro Max Black" por polyman, ambos do Sketchfab
const mac = new THREE.Group(), phone = new THREE.Group();
const macScreen = { material: screenMaterial() }, phoneScreen = { material: screenMaterial() };
const SCREEN = { mac: [1, 2234 / 3456], phone: [1, 2796 / 1290] };   // proporção das telas reais
const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/');
const gltf = new GLTFLoader().setDRACOLoader(draco);

// deixa o modelo em pé, centrado, com a base no chão e no tamanho certo
function fit(root, size, axis) {
  root.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(root);
  const v = box.getSize(new THREE.Vector3());
  root.scale.multiplyScalar(size / v[axis]);
  root.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(root);
  const c = box.getCenter(new THREE.Vector3());
  root.position.x -= c.x; root.position.z -= c.z; root.position.y -= box.min.y;
}
function prep(scene3d, screenTest, screenMat) {
  let screen = null;
  scene3d.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true;
    if (o.material) o.material.envMapIntensity = 1;
    if (screenTest(o)) { screen = o; o.material = screenMat; o.castShadow = false; }
  });
  return screen;
}
gltf.load('assets/3d/macbook.glb', g => {
  const m = g.scene;
  const scr = prep(m, o => o.name === 'Object_123', macScreen.material);
  macScreen.mesh = scr;
  const bb = new THREE.Box3().setFromBufferAttribute(scr.geometry.attributes.position).getSize(new THREE.Vector3());
  // normal da tela no espaço local = eixo mais fino do retângulo da tela
  macScreen.normal = bb.x < bb.y && bb.x < bb.z ? new THREE.Vector3(1, 0, 0) : bb.y < bb.z ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
  m.rotation.set(...MAC_ROT);
  fit(m, 3.1, 'x');
  mac.add(m);
  console.log('[3d] mac ok', !!scr);
});
gltf.load('assets/3d/iphone.glb', g => {
  const m = g.scene;
  const scr = prep(m, o => o.material && o.material.name === 'pIJKfZsazmcpEiU', phoneScreen.material);
  phoneScreen.mesh = scr;
  m.rotation.set(...PHONE_ROT);
  fit(m, 1.63, 'y');
  // gira em torno do próprio centro (não da base)
  const pivot = new THREE.Group(); const b = new THREE.Box3().setFromObject(m); m.position.y -= (b.max.y - b.min.y) / 2;
  pivot.add(m); phone.add(pivot);
  console.log('[3d] phone ok', !!scr);
});
const MAC_ROT = [0, 0, 0], PHONE_ROT = [0, Math.PI, 0];
mac.position.z = -.2;
// sombra de contato preta (foto de produto): mancha macia colada no chão embaixo de cada aparelho
const blobTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.5, 'rgba(0,0,0,.75)'); gr.addColorStop(.8, 'rgba(0,0,0,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
})();
const blob = (w, d, o) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: o, toneMapped: false }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = -1; return m;
};
const macBlob = blob(4.5, 3.3, .7); macBlob.position.set(0, .003, .05); mac.add(macBlob);
const phoneBlob = blob(1.5, .7, .75); phoneBlob.position.y = .004;
const TINT = ['#7fae5a', '#d4a85c', '#d99033', '#7d6bff'].map(c => new THREE.Color(c));   // cor de cada site
const spill = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, toneMapped: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(0, .004, .5); return m;
})();
mac.add(spill);
const screenLight = new THREE.PointLight(0xffffff, 0, 4.5, 2); screenLight.position.set(0, .95, .05); mac.add(screenLight);

const rig = new THREE.Group(); rig.add(mac, phone, phoneBlob); scene.add(rig);

// ---------- texturas dos sites
const loader = new THREE.TextureLoader();
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const tex = { desk: [], mob: [] };
function load(src) {
  const t = loader.load(src, () => { t.userData.ready = true; });
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}
PROJECTS.forEach(p => { tex.desk.push(load(`assets/work/${p}-desk.jpg`)); tex.mob.push(load(`assets/work/${p}-mob.jpg`)); });
// fração da altura do print que cabe na tela (e quanto dá pra rolar)
const frac = (t, sw, sh) => t.image ? (sh / sw) * (t.image.width / t.image.height) : 1;
const scrollMax = f => Math.max(0, Math.min(1 - f, f * .55));

// ---------- layout (desktop: par de um lado e texto do outro; celular: par em cima, texto embaixo)
// desfoque de movimento: rastro na direção em que o par anda + desfoque de zoom no mergulho da câmera
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const motion = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, dir: { value: new THREE.Vector2() }, zoom: { value: 0 }, center: { value: new THREE.Vector2(.5, .5) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform vec2 dir, center; uniform float zoom; varying vec2 vUv;
    void main() {
      vec2 v = dir + (vUv - center) * zoom;
      vec4 acc = vec4(0.); float wsum = 0.;
      // ruído por pixel desloca as amostras e esconde os degraus do rastro
      float j = fract(sin(dot(vUv * 913.7, vec2(12.9898, 78.233))) * 43758.5453) / 19.;
      for (int i = 0; i < 20; i++) {
        float t = float(i) / 19. - .5 + j;
        float w = 1. - abs(t) * 1.2;
        acc += texture2D(tDiffuse, vUv - v * t) * w; wsum += w;
      }
      gl_FragColor = acc / wsum;
    }`,
});
composer.addPass(motion);
composer.addPass(new OutputPass());
const prevNdc = new THREE.Vector3(), mv = new THREE.Vector2();
let prevDive = 0;
let W = 1, H = 1, mobile = false;
const basePos = new THREE.Vector3(), baseLook = new THREE.Vector3();
function resize() {
  W = canvas.clientWidth; H = canvas.clientHeight;
  mobile = W / H < .9;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.6 : 2));
  renderer.setSize(W, H, false);
  composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(W, H);
  camera.aspect = W / H;
  camera.fov = mobile ? 34 : 28;
  basePos.set(0, mobile ? 3.2 : 2.5, mobile ? 11.5 : 9.4); baseLook.set(0, mobile ? .5 : .78, 0);
  camera.position.copy(basePos); camera.lookAt(baseLook);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

// ---------- scroll
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
let pTarget = 0, p = 0, enterTarget = 0, enter = 0, mx = 0, my = 0, smx = 0, smy = 0;
function readScroll() {
  const r = section.getBoundingClientRect();
  enterTarget = clamp((innerHeight - r.top) / innerHeight);
  pTarget = clamp(-r.top / (r.height - innerHeight));
}
addEventListener('scroll', readScroll, { passive: true }); readScroll();
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const hit = (e, obj) => {
  if (!obj) return null;
  const r = canvas.getBoundingClientRect();
  ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObject(obj, true)[0] || null;
};
const spin = { x: 0, y: 0, vx: 0, vy: 0, drag: false, lx: 0, ly: 0 };
canvas.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse' || !hit(e, phone)) return;
  spin.drag = true; spin.lx = e.clientX; spin.ly = e.clientY; canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', e => {
  if (!spin.drag) { canvas.style.cursor = ''; return; }
  spin.vy = (e.clientX - spin.lx) * .012; spin.vx = (e.clientY - spin.ly) * .008;
  spin.y += spin.vy; spin.x = Math.max(-.9, Math.min(.9, spin.x + spin.vx));
  spin.lx = e.clientX; spin.ly = e.clientY;
});
const release = () => { spin.drag = false; };
canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
// roda do mouse em cima da tela do Mac rola o site lá dentro; no fim do site, a página volta a rolar
let extra = 0, extraK = 0, holdScroll = 0, smaxNow = 0, transNow = 0;
canvas.addEventListener('wheel', e => {
  if (transNow > .02 || !hit(e, macScreen.mesh)) return;
  const next = Math.max(-holdScroll, Math.min(smaxNow - holdScroll, extra + e.deltaY * .00045));
  if (next === extra) return;
  e.preventDefault(); extra = next;
}, { passive: false });

let active = -1;
function setPanel(k, side) {
  if (k !== active) {
    panels.forEach((el, i) => el.classList.toggle('is-on', i === k));
    if (counter) counter.textContent = String(k + 1).padStart(2, '0');
    active = k;
  }
  section.dataset.side = side > 0 ? 'left' : 'right';
}

// ---------- loop (só desenha com a seção na tela)
let visible = false, t0 = performance.now();
new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(frame); }, { rootMargin: '200px' }).observe(section);

function frame(now) {
  if (!visible) return;
  requestAnimationFrame(frame);
  const time = (now - t0) / 1000;
  // suavização independente do fps (em máquina lenta chega no mesmo lugar)
  const dt = Math.min(.1, (now - (frame.last || now)) / 1000); frame.last = now;
  const k1 = reduce ? 1 : 1 - Math.exp(-dt * 5.5);
  p += (pTarget - p) * k1; enter += (enterTarget - enter) * k1;
  smx += (mx - smx) * k1 * .6; smy += (my - smy) * k1 * .6;

  // em que projeto estamos e quanto falta pra trocar
  const s = clamp(p, 0, .9999) * N, k = Math.floor(s), u = s - k;
  const hold = clamp(u / .6), trans = k < N - 1 ? ease(smooth(.6, 1, u)) : 0;
  const sideOf = i => (i % 2 === 0 ? 1 : -1);
  const side = sideOf(k) + (sideOf(k + 1) - sideOf(k)) * trans;
  const mid = Math.sin(Math.PI * trans);
  setPanel(trans > .5 ? k + 1 : k, k < N - 1 && trans > .5 ? sideOf(k + 1) : sideOf(k));
  if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;

  if (k !== extraK) { extraK = k; extra = 0; }
  transNow = trans;
  // luz principal acompanha o mouse: o reflexo corre pelo metal e pelo vidro
  key.position.set(-1.6 + smx * 5, 9 - smy * 2, 2.2);   // mais de cima: a sombra cai embaixo dos aparelhos

  // entrada: o par sobe e o MacBook abre a tampa conforme a seção chega
  const en = ease(clamp(enter * 1.15));
  mac.rotation.x = (1 - en) * .5;

  // posição do par: atravessa a tela, gira pra encarar o texto, dá uma leve subida no meio
  const sc = mobile ? .62 : 1;
  rig.scale.setScalar(sc);
  // no celular o par fica centrado (o iPhone de um lado compensa o Mac do outro)
  rig.position.set(side * (mobile ? .2 : 1.55), (mobile ? .75 : 0) + mid * .18 + (1 - en) * -.6, 0);
  rig.rotation.set(smy * .06, -side * .5 + mid * .25 * Math.sign(sideOf(k + 1) - sideOf(k) || 1) + smx * .16, 0);
  ground.position.y = rig.position.y - .001;

  // iPhone na troca: afunda pra fora de quadro enquanto a câmera mergulha, atravessa por baixo
  // e sobe girando do outro lado. Só anda em x quando já está todo abaixo da base do Mac.
  const sink = Math.sin(Math.PI * trans);
  const cross = Math.cos(Math.PI * smooth(.25, .75, trans));
  if (!spin.drag) { spin.vy *= .9; spin.y += (0 - spin.y) * .08 + spin.vy * .2; spin.x += (0 - spin.x) * .1; }
  phone.position.set(-sideOf(k) * 1.45 * cross, .86 + Math.sin(time * 1.3) * .03 + (1 - en) * 1.2 - 2.6 * sink, 1.45);
  phone.rotation.set(-.04 + Math.sin(time * .9) * .02 + spin.x, side * .62 + sink * Math.PI * 2 * -Math.sign(sideOf(k + 1) - sideOf(k) || 1) + spin.y, Math.sin(time * 1.1) * .015 + (1 - en) * .3);

  // sombra do iPhone acompanha ele no chão e some quando ele afunda pra trocar de lado
  phoneBlob.position.x = phone.position.x; phoneBlob.position.z = phone.position.z;
  phoneBlob.rotation.z = phone.rotation.y;
  phoneBlob.material.opacity = .75 * Math.max(0, 1 - sink * 3) * en;
  macBlob.material.opacity = .7 * en;

  // câmera de cinema: na troca ela mergulha até a tela do Mac (o site vira tela cheia) e volta
  const dive = k < N - 1 ? ease(clamp((1 - Math.abs(trans - .5) * 2.2) * 1.3)) : 0;
  section.style.setProperty('--dive', dive.toFixed(3));
  if (dive > 0 && macScreen.mesh) {
    rig.updateMatrixWorld(true);
    // centro real do retângulo da tela (a origem do mesh fica na dobradiça)
    const g = macScreen.mesh.geometry; if (!g.boundingBox) g.computeBoundingBox();
    const c = g.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(macScreen.mesh.matrixWorld);
    const n = macScreen.normal.clone().applyQuaternion(macScreen.mesh.getWorldQuaternion(new THREE.Quaternion())).normalize();
    if (n.z < 0) n.negate();
    const fit = 2.72 * rig.scale.x / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(camera.aspect, 1.6));
    camera.position.lerpVectors(basePos, c.clone().addScaledVector(n, fit), dive);
    camera.lookAt(baseLook.clone().lerp(c, dive));
  } else { camera.position.copy(basePos); camera.lookAt(baseLook); }

  // cor do site no chão e no teclado (mistura na troca)
  const tint = TINT[k].clone().lerp(TINT[Math.min(k + 1, N - 1)], trans);
  const glowNow = smooth(.55, .95, enter);
  spill.material.color.copy(tint); spill.visible = false;
  screenLight.color.copy(tint); screenLight.intensity = 2.2 * glowNow;

  // telas: rolam o site do projeto atual e varrem pro próximo
  const glow = smooth(.55, .95, enter);
  [[macScreen, tex.desk, ...SCREEN.mac], [phoneScreen, tex.mob, ...SCREEN.phone]].forEach(([mesh, list, sw, sh]) => {
    const U = mesh.material.uniforms, A = list[k], B = list[Math.min(k + 1, N - 1)];
    U.a.value = A; U.b.value = B;
    U.fa.value = frac(A, sw, sh); U.fb.value = frac(B, sw, sh);
    const sm = scrollMax(U.fa.value), base = sm * ease(hold);
    if (mesh === macScreen) { smaxNow = sm; holdScroll = base; }
    U.sa.value = clamp(base + (mesh === macScreen ? extra : extra * 1.6), 0, sm); U.sb.value = 0;
    U.mixv.value = trans; U.glow.value = glow;
  });

  // velocidade do par na tela (por segundo) e do mergulho viram o tamanho do rastro
  const ndc = rig.localToWorld(new THREE.Vector3(0, .7, 0)).project(camera);
  const sdt = Math.max(dt, 1 / 240);
  mv.lerp(new THREE.Vector2((ndc.x - prevNdc.x) / 2, (ndc.y - prevNdc.y) / 2).divideScalar(sdt).multiplyScalar(.045), .35);
  prevNdc.copy(ndc);
  const dz = (dive - prevDive) / sdt; prevDive = dive;
  if (mv.length() > .035) mv.setLength(.035);
  motion.uniforms.dir.value.copy(mv);
  motion.uniforms.zoom.value = reduce ? 0 : Math.max(-.08, Math.min(.08, dz * .04));
  motion.enabled = !reduce && (mv.length() > .0015 || Math.abs(motion.uniforms.zoom.value) > .004);
  if (reduce) motion.uniforms.dir.value.set(0, 0);
  composer.render();
}
