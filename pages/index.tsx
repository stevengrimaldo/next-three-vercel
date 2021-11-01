// @ts-nocheck
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from '@react-three/fiber'
import { DoubleSide, TextureLoader, Uniform, Vector2, Vector4 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import gsap from 'gsap'
import DatGui, { DatNumber } from 'react-dat-gui'
import { FRAGMENT_SHADER, VERTEX_SHADER } from '@libs/shaders'
import 'node_modules/react-dat-gui/dist/index.css'

const wave = '/images/wave.jpg'
const waveHover = '/images/hover.jpg'
const displacement = '/images/displacement/4.jpg'

extend({ EffectComposer, RenderPass })

gsap.registerPlugin()

const pageWidth = 940
const padding = 20
const j = 136
const TEXTURE_PATH = wave
const TEXTURE_PATH2 = waveHover
const TEXTURE_PATH3 = displacement
const PLANE_ASPECT_RATIO = 9 / 16

const getDimensions = (depth, camera) => {
  // compensate for cameras not positioned at z = 0
  const cameraOffset = camera.position.z
  if (depth < cameraOffset) depth -= cameraOffset
  else depth += cameraOffset

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180

  // Math.abs to ensure the result is always positive
  const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(depth)
  const visibleWidth = visibleHeight * camera.aspect

  return {
    visibleHeight,
    visibleWidth,
  }
}

const Geometry = () => {
  const { camera, size } = useThree()
  const { visibleHeight, visibleWidth } = getDimensions(0, camera)
  const { height, width } = size

  let e: number
  let t: number

  if (
    (t =
      (e = width <= pageWidth + 2 * padding ? width - 2 * padding : pageWidth) *
      PLANE_ASPECT_RATIO) >
    height - j
  ) {
    const s = height - j

    e *= s / t
    t = s
  }

  const h = visibleHeight / height
  const p = t * h

  const d = visibleWidth / width
  const m = e * d

  return (
    <planeBufferGeometry
      args={[m, p, Math.round(e / 10), Math.round(t / 10)]}
      attach="geometry"
    />
  )
}

const Material = ({ config, uv }) => {
  const [tex, tex2, tex3] = useLoader(TextureLoader, [
    TEXTURE_PATH,
    TEXTURE_PATH2,
    TEXTURE_PATH3,
  ])
  const [texture, texture2, texture3] = useMemo(
    () => [tex, tex2, tex3],
    [tex, tex2, tex3]
  )
  const { camera, size } = useThree()

  const { height, width } = size

  let e: number
  let t: number

  if (
    (t =
      (e = width <= pageWidth + 2 * padding ? width - 2 * padding : pageWidth) *
      PLANE_ASPECT_RATIO) >
    height - j
  ) {
    const s = height - j

    e *= s / t
    t = s
  }

  const v = 300 / e

  const materialRef = useRef<{ uniforms: any }>()
  const targetZ = useRef(camera.position.z - camera.position.z / v)
  const time = useRef(new Uniform(0))
  const amplitude = useRef(config.amplitude)
  const speed = useRef(config.speed)
  const radius = useRef(config.radius)
  const effect = useRef(config.effect)

  const uniforms = useMemo(() => {
    const { visibleWidth } = getDimensions(0, camera)
    const planeWidth = visibleWidth / 2
    const planeHeight = planeWidth * PLANE_ASPECT_RATIO

    const ratio = new Vector2(
      Math.min(planeWidth / planeHeight / 2, 1),
      Math.min(planeHeight / planeWidth / 0.5, 1)
    )

    return {
      amplitude: {
        value: amplitude.current,
      },
      corners: {
        value: new Vector4(0, 0, 0, 0),
      },
      effectFactor: {
        value: effect.current,
      },
      hover: {
        value: 0.0,
      },
      hoverRadius: {
        value: radius.current,
      },
      intersect: {
        value: uv.current,
      },
      ratio: {
        value: ratio,
      },
      speed: {
        value: speed.current,
      },
      startZ: {
        value: 0,
      },
      targetZ: {
        value: targetZ.current,
      },
      time: time.current,
      u_disp: {
        value: texture3,
      },
      u_texture: {
        value: texture,
      },
      u_texture2: {
        value: texture2,
      },
    }
  }, [camera, targetZ, texture, texture2, texture3, uv])

  useFrame(({ gl, scene, camera: { position } }) => {
    time.current.value = time.current.value + 0.05

    materialRef.current.uniforms.targetZ.value = position.z - position.z / v
    materialRef.current.uniforms.amplitude.value = config.amplitude
    materialRef.current.uniforms.effectFactor.value = config.effect
    materialRef.current.uniforms.hoverRadius.value = config.radius
    materialRef.current.uniforms.speed.value = config.speed

    gl.render(scene, camera)
  }, 1)

  return (
    <shaderMaterial
      attach="material"
      side={DoubleSide}
      uniforms={uniforms}
      vertexShader={VERTEX_SHADER}
      fragmentShader={FRAGMENT_SHADER}
      ref={materialRef}
    />
  )
}

const Plane = ({ config }) => {
  const intersection = useRef(null)
  const uv = useRef(new Vector2(0, 0))
  const mouse = useRef({
    x: 0,
    y: 0,
  })

  const { size } = useThree()
  const { height, width } = size

  const onHover = ({ clientX, clientY, object, uv: uvu }: any) => {
    mouse.current.x = (clientX / width) * 2 - 1
    mouse.current.y = (-clientY / height) * 2 + 1

    // manually set our cursor style to reflect the hover state
    document.body.style.cursor = 'pointer'

    const intersectedPlane = object

    if (intersection.current === intersectedPlane) {
      // active intersection
      uv.current.x = uvu.x
      uv.current.y = uvu.y

      const { x = 0, y = 0 } = mouse.current

      gsap.to(intersectedPlane.position, {
        duration: 0.35,
        x: 2 * x,
        y: 2 * y,
      })
    } else if (intersection.current !== intersectedPlane) {
      // first intersection
      intersection.current = intersectedPlane

      gsap
        .timeline()
        .to(
          intersectedPlane.material.uniforms.hover,
          { duration: 0.35, value: 1.0 },
          0
        )
        .to(intersectedPlane.scale, { duration: 0.25, x: 1.05, y: 1.05 }, 0)
    }
  }

  const unHover = () => {
    // no intersection
    document.body.style.cursor = 'auto'

    if (intersection.current) {
      gsap
        .timeline()
        .to(intersection.current.position, { duration: 0.35, x: 0, y: 0 }, 0)
        .to(intersection.current.scale, { duration: 0.35, x: 1, y: 1 }, 0)
        .to(
          intersection.current.material.uniforms.hover,
          { duration: 0.35, value: 0.0 },
          0
        )

      intersection.current = null
    }
  }

  return (
    <mesh
      frustumCulled
      key={[width, height]}
      onPointerMove={onHover}
      onPointerOut={unHover}
    >
      <Geometry />
      <Material config={config} uv={uv} />
    </mesh>
  )
}

const Effects = () => {
  const composer = useRef<any>()
  const { gl, scene, camera, size } = useThree()

  useFrame(() => composer.current.render(), 1)

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  )

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />
    </effectComposer>
  )
}

const Scene = ({ config }) => (
  <Suspense fallback={null}>
    <Plane config={config} />
    <Effects />
  </Suspense>
)

const Art = ({ config }) => (
  <Canvas camera={{ fov: 50, position: [0, 0, 50] }}>
    <Scene config={config} />
  </Canvas>
)

const Gui = ({ data, onUpdate }) => (
  <DatGui data={data} onUpdate={onUpdate}>
    <DatNumber path="amplitude" label="Amplitude" min={0} max={10} step={0.1} />
    <DatNumber
      path="effect"
      label="Image Effect Factor"
      min={-1}
      max={1}
      step={0.1}
    />
    <DatNumber path="radius" label="Radius" min={0} max={1} step={0.1} />
    <DatNumber path="speed" label="Speed" min={0} max={2} step={0.1} />
  </DatGui>
)

const Home = () => {
  const [data, setData] = useState({
    amplitude: 4.0,
    effect: 0.2,
    radius: 0.4,
    speed: 0.4,
  })

  const onUpdate = (config) => {
    setData((prev) => ({ ...prev, ...config }))
  }

  return (
    <>
      <Art config={data} />
      <Gui data={data} onUpdate={onUpdate} />
    </>
  )
}

export default Home
