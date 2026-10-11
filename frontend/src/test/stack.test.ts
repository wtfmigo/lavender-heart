import { expect, test } from 'vitest'
import { BoxGeometry } from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'

test('approved rendering and animation libraries import together', () => {
  expect(BoxGeometry).toBeDefined()
  expect(Canvas).toBeDefined()
  expect(OrbitControls).toBeDefined()
  expect(gsap).toBeDefined()
  expect(useGSAP).toBeDefined()
  expect(ScrollTrigger).toBeDefined()
  expect(motion).toBeDefined()
})
