'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { MathUtils, Quaternion, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

const FACE_COLORS = {
  px: '#e53935',
  nx: '#ff8f1f',
  py: '#f9fbff',
  ny: '#ffd54a',
  pz: '#2ecc71',
  nz: '#1e88ff',
}

const CUBELET_GEOMETRY = new RoundedBoxGeometry(0.9, 0.9, 0.9, 5, 0.09)
const STICKER_GEOMETRY = new RoundedBoxGeometry(0.73, 0.73, 0.048, 4, 0.045)

const SCRAMBLE = ['R', 'U', "R'", 'F', 'L', "D'", 'B', 'U', "L'", "F'"]

const MOVE_DEFS = {
  R: { axis: 'x', index: 1, dir: -1 },
  L: { axis: 'x', index: -1, dir: 1 },
  U: { axis: 'y', index: 1, dir: -1 },
  D: { axis: 'y', index: -1, dir: 1 },
  F: { axis: 'z', index: 1, dir: -1 },
  B: { axis: 'z', index: -1, dir: 1 },
}

const AXIS_VECTORS = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
}

function invertMove(move) {
  return move.endsWith("'") ? move.slice(0, -1) : `${move}'`
}

function parseMove(moveToken) {
  const prime = moveToken.endsWith("'")
  const face = prime ? moveToken.slice(0, -1) : moveToken
  const def = MOVE_DEFS[face]
  if (!def) return null
  return {
    axis: def.axis,
    index: def.index,
    dir: prime ? -def.dir : def.dir,
  }
}

function roundLayerValue(value) {
  return Math.round(value)
}

function applyMoveInstant(cubies, moveDef) {
  const axisVector = AXIS_VECTORS[moveDef.axis]
  const angle = moveDef.dir * (Math.PI / 2)
  const rotation = new Quaternion().setFromAxisAngle(axisVector, angle)

  cubies.forEach((cubie) => {
    const layerValue = moveDef.axis === 'x' ? cubie.pos.x : moveDef.axis === 'y' ? cubie.pos.y : cubie.pos.z
    if (roundLayerValue(layerValue) !== moveDef.index) return

    cubie.pos.applyAxisAngle(axisVector, angle)
    cubie.pos.set(roundLayerValue(cubie.pos.x), roundLayerValue(cubie.pos.y), roundLayerValue(cubie.pos.z))
    cubie.quat.premultiply(rotation).normalize()
  })
}

function buildCubies() {
  const items = []
  let id = 0

  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        items.push({
          id,
          pos: new Vector3(x, y, z),
          quat: new Quaternion(),
          stickers: {
            px: x === 1,
            nx: x === -1,
            py: y === 1,
            ny: y === -1,
            pz: z === 1,
            nz: z === -1,
          },
        })
        id += 1
      }
    }
  }

  SCRAMBLE.forEach((moveToken) => {
    const move = parseMove(moveToken)
    if (move) applyMoveInstant(items, move)
  })

  return items
}

function Cubelet({ stickers }, ref) {
  const stickerOffset = 0.462

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <primitive object={CUBELET_GEOMETRY} attach="geometry" />
        <meshPhysicalMaterial
          color="#121721"
          roughness={0.28}
          metalness={0.12}
          clearcoat={0.56}
          clearcoatRoughness={0.22}
          reflectivity={0.62}
        />
      </mesh>

      {stickers.px && (
        <mesh position={[stickerOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <primitive object={STICKER_GEOMETRY} attach="geometry" />
          <meshPhysicalMaterial color={FACE_COLORS.px} roughness={0.2} metalness={0.08} clearcoat={0.72} clearcoatRoughness={0.18} />
        </mesh>
      )}
      {stickers.nx && (
        <mesh position={[-stickerOffset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <primitive object={STICKER_GEOMETRY} attach="geometry" />
          <meshPhysicalMaterial color={FACE_COLORS.nx} roughness={0.2} metalness={0.08} clearcoat={0.72} clearcoatRoughness={0.18} />
        </mesh>
      )}
      {stickers.py && (
        <mesh position={[0, stickerOffset, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <primitive object={STICKER_GEOMETRY} attach="geometry" />
          <meshPhysicalMaterial color={FACE_COLORS.py} roughness={0.16} metalness={0.08} clearcoat={0.76} clearcoatRoughness={0.14} />
        </mesh>
      )}
      {stickers.ny && (
        <mesh position={[0, -stickerOffset, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={STICKER_GEOMETRY} attach="geometry" />
          <meshPhysicalMaterial color={FACE_COLORS.ny} roughness={0.18} metalness={0.08} clearcoat={0.74} clearcoatRoughness={0.15} />
        </mesh>
      )}
      {stickers.pz && (
        <mesh position={[0, 0, stickerOffset]}>
          <primitive object={STICKER_GEOMETRY} attach="geometry" />
          <meshPhysicalMaterial color={FACE_COLORS.pz} roughness={0.2} metalness={0.08} clearcoat={0.72} clearcoatRoughness={0.18} />
        </mesh>
      )}
      {stickers.nz && (
        <mesh position={[0, 0, -stickerOffset]} rotation={[0, Math.PI, 0]}>
          <primitive object={STICKER_GEOMETRY} attach="geometry" />
          <meshPhysicalMaterial color={FACE_COLORS.nz} roughness={0.2} metalness={0.08} clearcoat={0.72} clearcoatRoughness={0.18} />
        </mesh>
      )}
    </group>
  )
}

const ForwardCubelet = Object.assign((props) => Cubelet(props, props.innerRef), {})

function CubeRig({ onComplete }) {
  const cubiesRef = useRef(buildCubies())
  const cubeRefs = useRef([])
  const rootRef = useRef(null)
  const sweepRef = useRef(null)

  const solveMoves = useMemo(
    () => [...SCRAMBLE].reverse().map((moveToken) => parseMove(invertMove(moveToken))).filter(Boolean),
    []
  )

  const phaseRef = useRef('arrival')
  const phaseTimerRef = useRef(0)
  const moveIndexRef = useRef(0)
  const activeMoveRef = useRef(null)
  const pauseTimerRef = useRef(0)
  const finishedRef = useRef(false)
  const idleYawRef = useRef(0)

  useEffect(() => {
    cubeRefs.current = cubeRefs.current.slice(0, cubiesRef.current.length)
  }, [])

  useFrame((_, delta) => {
    const turnDuration = 0.12
    const betweenMoves = 0.03
    const groupPause = 0.06
    const arrivalDuration = 0.6
    const heroDuration = 0.4

    phaseTimerRef.current += delta

    if (phaseRef.current === 'arrival' && phaseTimerRef.current >= arrivalDuration) {
      phaseRef.current = 'solve'
      phaseTimerRef.current = 0
      pauseTimerRef.current = betweenMoves
    }

    if (phaseRef.current === 'solve') {
      if (!activeMoveRef.current) {
        if (moveIndexRef.current >= solveMoves.length) {
          phaseRef.current = 'hero'
          phaseTimerRef.current = 0
        } else {
          pauseTimerRef.current += delta
          const pauseTarget = moveIndexRef.current > 0 && moveIndexRef.current % 3 === 0 ? groupPause : betweenMoves
          if (pauseTimerRef.current >= pauseTarget) {
            activeMoveRef.current = {
              move: solveMoves[moveIndexRef.current],
              progress: 0,
            }
            pauseTimerRef.current = 0
          }
        }
      }

      if (activeMoveRef.current) {
        activeMoveRef.current.progress += delta / turnDuration

        if (activeMoveRef.current.progress >= 1) {
          applyMoveInstant(cubiesRef.current, activeMoveRef.current.move)
          activeMoveRef.current = null
          moveIndexRef.current += 1
        }
      }
    }

    if (phaseRef.current === 'hero' && phaseTimerRef.current >= heroDuration && !finishedRef.current) {
      finishedRef.current = true
      onComplete?.()
    }

    const activeMove = activeMoveRef.current

    cubiesRef.current.forEach((cubie, index) => {
      const mesh = cubeRefs.current[index]
      if (!mesh) return

      let renderPos = cubie.pos.clone()
      let renderQuat = cubie.quat.clone()

      if (activeMove) {
        const { move, progress } = activeMove
        const layerValue = move.axis === 'x' ? cubie.pos.x : move.axis === 'y' ? cubie.pos.y : cubie.pos.z
        if (roundLayerValue(layerValue) === move.index) {
          const eased = MathUtils.smoothstep(Math.min(progress, 1), 0, 1)
          const angle = move.dir * (Math.PI / 2) * eased
          const rot = new Quaternion().setFromAxisAngle(AXIS_VECTORS[move.axis], angle)
          renderPos = cubie.pos.clone().applyAxisAngle(AXIS_VECTORS[move.axis], angle)
          renderQuat = cubie.quat.clone().premultiply(rot).normalize()
        }
      }

      mesh.position.copy(renderPos)
      mesh.quaternion.copy(renderQuat)
    })

    if (rootRef.current) {
      const t = phaseTimerRef.current
      const floatY = Math.sin((performance.now() * 0.001) * 1.7) * 0.06
      rootRef.current.position.y = floatY

      if (phaseRef.current === 'hero') {
        rootRef.current.rotation.x = MathUtils.lerp(rootRef.current.rotation.x, 0, 0.08)
        rootRef.current.rotation.y = MathUtils.lerp(rootRef.current.rotation.y, 0, 0.1)
        rootRef.current.rotation.z = MathUtils.lerp(rootRef.current.rotation.z, 0, 0.08)
      } else {
        idleYawRef.current += delta * 0.28
        rootRef.current.rotation.x = 0.31 + Math.sin(t * 2.1) * 0.03
        rootRef.current.rotation.y = idleYawRef.current
        rootRef.current.rotation.z = Math.sin(t * 1.4) * 0.02
      }
    }

    if (sweepRef.current) {
      if (phaseRef.current === 'hero') {
        const p = MathUtils.clamp((phaseTimerRef.current - 0.08) / 0.62, 0, 1)
        sweepRef.current.intensity = 0.45 + Math.sin(p * Math.PI) * 1.1
        sweepRef.current.position.x = MathUtils.lerp(-3.4, 3.4, p)
      } else {
        sweepRef.current.intensity = 0.42
        sweepRef.current.position.x = -3.2
      }
    }
  })

  return (
    <group ref={rootRef}>
      {cubiesRef.current.map((cubie, index) => (
        <ForwardCubelet
          key={cubie.id}
          innerRef={(node) => {
            cubeRefs.current[index] = node
          }}
          stickers={cubie.stickers}
        />
      ))}

      <pointLight ref={sweepRef} position={[-3.2, 1.1, 2.6]} intensity={0.42} color="#8fd3ff" distance={11} />
    </group>
  )
}

export default function RubiksCubeIntro({ onComplete, onError }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.68, 7.35], fov: 31 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        if (!gl) {
          onError?.()
        }

        gl.toneMappingExposure = 1.05
      }}
    >
      <color attach="background" args={['#04070f']} />
      <fog attach="fog" args={['#04070f', 8, 18]} />

      <ambientLight intensity={0.22} color="#9bb4dc" />
      <hemisphereLight intensity={0.28} color="#b8cfff" groundColor="#111726" />

      <spotLight
        position={[4.2, 6.1, 5.2]}
        intensity={1.05}
        angle={0.46}
        penumbra={0.66}
        color="#f4f8ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00008}
      />

      <pointLight position={[-4.8, 1.4, -3.8]} intensity={0.35} color="#88a9dd" />
      <pointLight position={[3.8, 1.7, -4.8]} intensity={0.34} color="#6ba7ff" />
      <pointLight position={[0, 2.4, 4.8]} intensity={0.26} color="#7fe0ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <circleGeometry args={[3.8, 64]} />
        <shadowMaterial opacity={0.16} />
      </mesh>

      <ContactShadows position={[0, -1.47, 0]} opacity={0.28} width={8} height={8} blur={2.1} far={4.2} />

      <CubeRig onComplete={onComplete} />
    </Canvas>
  )
}
