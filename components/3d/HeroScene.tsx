"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import type { Mesh, Group } from "three"

function FloatingShape({
  position,
  color,
  speed,
  scale,
}: {
  position: [number, number, number]
  color: string
  speed: number
  scale: number
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed * 0.3
      meshRef.current.rotation.y += delta * speed * 0.5
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.4}
          metalness={0.8}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const groupRef = useRef<Group>(null)
  const count = 80
  const positions = useRef(
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 15,
    ])
  )

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {positions.current.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

export default function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#8b5cf6" />

      <FloatingShape position={[-2, 0.5, -1]} color="#6d28d9" speed={1.2} scale={0.8} />
      <FloatingShape position={[2.5, -0.3, -2]} color="#7c3aed" speed={0.8} scale={0.6} />
      <FloatingShape position={[0, 1, -3]} color="#a78bfa" speed={1.0} scale={0.4} />
      <FloatingShape position={[-1.5, -1, -1.5]} color="#4c1d95" speed={0.6} scale={0.3} />

      <ParticleField />
    </>
  )
}
