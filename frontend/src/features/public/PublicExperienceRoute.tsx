import { useEffect, useState } from 'react'
import { PublicExperiencePage } from '@/views/pages/PublicExperiencePage'
import { getExperience } from '@/services/api/experience'
import type { PublicExperience } from './experience'

export function Component() {
  const [data, setData] = useState<PublicExperience | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    getExperience(controller.signal)
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [])
  if (error)
    return (
      <main className="experience-unavailable">
        <h1>Lavender Heart</h1>
        <p>The birthday content could not be loaded.</p>
        <button onClick={() => location.reload()}>Try again</button>
      </main>
    )
  if (!data)
    return (
      <p className="route-loading" role="status">
        Lavender Heart
      </p>
    )
  return <PublicExperiencePage data={data} />
}
