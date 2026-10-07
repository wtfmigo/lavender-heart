import { Component as ReactComponent } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'

class WebGLBoundary extends ReactComponent<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <p>WebGL unavailable</p> : this.props.children
  }
}

export function Component() {
  return (
    <main className="p-6">
      <h1>WebGL smoke test</h1>
      <div style={{ width: 240, height: 180 }}>
        <WebGLBoundary>
          <Canvas
            frameloop="demand"
            fallback={<p>WebGL unavailable</p>}
            onCreated={({ gl }) => {
              gl.domElement.dataset.webgl = 'ready'
            }}
          >
            <mesh>
              <boxGeometry />
              <meshNormalMaterial />
            </mesh>
          </Canvas>
        </WebGLBoundary>
      </div>
    </main>
  )
}
