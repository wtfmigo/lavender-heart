import { useHealth } from '@/controllers/hooks/useHealth'
import { apiBaseUrl } from '@/services/http/client'

export function SetupPage() {
  const health = useHealth()
  const apiStatus = !apiBaseUrl
    ? 'Not configured'
    : health.isPending
      ? 'Checking'
      : health.data?.status === 'ok'
        ? 'OK'
        : 'Unavailable'

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Lavender Heart</h1>
      <p>Technical Foundation Ready</p>
      <p>Frontend: OK</p>
      <p role="status">API: {apiStatus}</p>
    </main>
  )
}
