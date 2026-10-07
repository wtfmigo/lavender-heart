import { createBrowserRouter } from 'react-router'
import { SetupPage } from '@/views/pages/SetupPage'

export const router = createBrowserRouter([
  { path: '/', Component: SetupPage },
  ...(import.meta.env.DEV
    ? [
        {
          path: '/__smoke/three',
          lazy: () => import('@/three/scenes/SmokeScene'),
          hydrateFallbackElement: <p>Loading WebGL smoke test</p>,
        },
      ]
    : []),
])
