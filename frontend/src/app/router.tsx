import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/features/public/PublicExperienceRoute'),
    hydrateFallbackElement: <p className="route-loading">Lavender Heart</p>,
  },
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
