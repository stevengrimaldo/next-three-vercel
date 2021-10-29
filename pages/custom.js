import React, { Component } from 'react';
import {
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Raycaster,
  ShaderMaterial,
  Scene,
  TextureLoader,
  Uniform,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import gsap from 'gsap';
import {
  FRAGMENT_SHADER,
  VERTEX_SHADER,
} from '@libs/shaders';

const wave = '/images/wave.jpg';
const hover = '/images/hover.jpg';
const displacement = '/images/displacement/4.jpg';

gsap.registerPlugin();

const TEXTURE_PATH = wave;
const TEXTURE_PATH2 = hover;
const TEXTURE_PATH3 = displacement;
const FOV = 50;
const CAMERA_DISTANCE = 50;
const PLANE_ASPECT_RATIO = 9 / 16;
const pageWidth = 940;
const padding = 20;
const j = 136;
let INTERSECTED;

const getVisibleDimensionsAtZDepth = (depth, camera) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(depth);
  const visibleWidth = visibleHeight * camera.aspect;

  return {
    visibleHeight,
    visibleWidth,
  };
};

class Custom extends Component {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
    this.createPlane = this.createPlane.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.updateIntersected = this.updateIntersected.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.uv = new Vector2(0, 0);
    this.time = new Uniform(0);
    this.mouse = {};
    this.intersects = [];
    this.mount = null;
    this.gui = null;
  }

  componentDidMount() {
    const { innerWidth, innerHeight } = window;

    this.aspect = innerWidth / innerHeight;
    this.camera = new PerspectiveCamera(FOV, this.aspect, 0.1, 1000);
    this.camera.position.z = CAMERA_DISTANCE;

    this.scene = new Scene();

    this.raycaster = new Raycaster();

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
    });

    this.mount.appendChild(this.renderer.domElement);

    this.renderer.setClearColor('#ffffff', 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setAnimationLoop(this.animate);

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(innerWidth, innerHeight);
    this.renderpass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderpass);

    this.plane = this.createPlane();

    this.scene.add(this.plane);
    this.gui = this.initGUI(this.plane);

    window.addEventListener('mousemove', this.handleMousemove);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    if (this.renderer && this.renderer.domElement) {
      this.mount.removeChild(this.renderer.domElement);
    }

    document.body.style.cursor = 'auto';
  }

  initGUI(plane) {
    const gui = new dat.GUI();

    gui.add(plane.material.uniforms.hoverRadius, 'value', 0, 1).name('radius');
    gui
      .add(plane.material.uniforms.amplitude, 'value', 1, 10)
      .name('amplitude');
    gui.add(plane.material.uniforms.speed, 'value', 0, 2).name('speed');

    return gui;
  }

  animate() {
    this.time.value = this.time.value + 0.05;
    this.composer.render();
  }

  handleResize(e) {
    const { innerWidth, innerHeight } = window;

    this.composer.setSize(innerWidth, innerHeight);
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.gui.destroy();
    this.gui = this.initGUI(this.plane);
    this.composer.render();
  }

  createPlane() {
    const texture = new TextureLoader().load(TEXTURE_PATH);
    const texture2 = new TextureLoader().load(TEXTURE_PATH2);
    const texture3 = new TextureLoader().load(TEXTURE_PATH3);

    const { visibleHeight, visibleWidth } = getVisibleDimensionsAtZDepth(
      0,
      this.camera
    );

    const planeWidth = visibleWidth / 2;
    const planeHeight = planeWidth * PLANE_ASPECT_RATIO;

    const ratio = new Vector2(
      Math.min(planeWidth / planeHeight / 2, 1),
      Math.min(planeHeight / planeWidth / 0.5, 1)
    );

    const { innerHeight: height, innerWidth: width } = window;

    let e;
    let t;

    if (
      (t =
        (e =
          window.innerWidth <= pageWidth + 2 * padding
            ? window.innerWidth - 2 * padding
            : pageWidth) * PLANE_ASPECT_RATIO) >
      window.innerHeight - j
    ) {
      let s = window.innerHeight - j;
      (e *= s / t), (t = s);
    }

    const v = 300 / e;
    const f = this.camera.position.z - this.camera.position.z / v;

    const h = visibleHeight / window.innerHeight;
    const p = t * h;
    const d = visibleWidth / window.innerWidth;
    const m = e * d;

    const planeMaterial = new ShaderMaterial({
      fragmentShader: FRAGMENT_SHADER,
      side: DoubleSide,
      uniforms: {
        amplitude: {
          type: 'f',
          value: 4.0,
        },
        corners: {
          type: 'v4',
          value: new Vector4(0, 0, 0, 0),
        },
        effectFactor: {
          type: 'f',
          value: 0.2,
        },
        hover: { type: 'f', value: 0 },
        hoverRadius: { type: 'f', value: 0.4 },
        intersect: {
          type: 'v2',
          value: this.uv,
        },
        ratio: {
          type: 'v2',
          value: ratio,
        },
        speed: {
          type: 'f',
          value: 0.4,
        },
        startZ: {
          type: 'f',
          value: 0,
        },
        targetZ: {
          type: 'f',
          value: f,
        },
        time: this.time,
        u_disp: { type: 't', value: texture3 },
        u_texture: { type: 't', value: texture },
        u_texture2: { type: 't', value: texture2 },
      },
      vertexShader: VERTEX_SHADER,
    });

    const planeGeometry = new PlaneBufferGeometry(
      m,
      p,
      Math.round(e / 10),
      Math.round(t / 10)
    );

    const mesh = new Mesh(planeGeometry, planeMaterial);

    mesh.frustumCulled = true;

    return mesh;
  }

  handleMousemove(e) {
    // code to get normalized device coordinates
    const { clientX, clientY } = e;

    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (-clientY / window.innerHeight) * 2 + 1;

    this.updateIntersected();
  }

  updateIntersected() {
    // raycaster code from the THREE.js docs
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects.length = 0;
    const n = this.raycaster.intersectObject(
      this.plane,
      false,
      this.intersects
    );

    if (n.length > 0) {
      // manually set our cursor style to reflect the hover state
      document.body.style.cursor = 'pointer';

      const intersectedPlane = this.intersects[0].object;

      if (INTERSECTED === intersectedPlane) {
        this.uv.x = this.intersects[0].uv.x;
        this.uv.y = this.intersects[0].uv.y;

        const { x = 0, y = 0 } = this.mouse;

        gsap.to(intersectedPlane.position, {
          duration: 0.35,
          x: 2 * x,
          y: 2 * y,
        });
      } else if (INTERSECTED !== intersectedPlane) {
        INTERSECTED = intersectedPlane;

        gsap
          .timeline()
          .to(
            intersectedPlane.material.uniforms.hover,
            { duration: 0.35, value: 1 },
            0
          )
          .to(intersectedPlane.scale, { duration: 0.25, x: 1.05, y: 1.05 }, 0);
      }
    } else {
      // no intersections
      document.body.style.cursor = 'auto';

      if (INTERSECTED) {
        gsap
          .timeline()
          .to(INTERSECTED.position, { duration: 0.35, x: 0, y: 0 }, 0)
          .to(INTERSECTED.scale, { duration: 0.35, x: 1, y: 1 }, 0)
          .to(
            INTERSECTED.material.uniforms.hover,
            { duration: 0.35, value: 0 },
            0
          );

        INTERSECTED = null;
      }
    }
  }

  render() {
    return <div ref={e => (this.mount = e)} />;
  }
}

export default Custom;
