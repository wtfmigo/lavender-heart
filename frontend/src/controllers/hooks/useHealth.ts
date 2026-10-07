import { useQuery } from '@tanstack/react-query'
import { getHealth } from '@/services/api/health'
import { apiBaseUrl } from '@/services/http/client'

export function useHealth() {
  return useQuery({
    queryKey: ['technical-health'],
    queryFn: getHealth,
    enabled: Boolean(apiBaseUrl),
    retry: false,
  })
}
