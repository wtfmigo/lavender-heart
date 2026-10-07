import { http } from '@/services/http/client'

export async function getHealth() {
  const response = await http.get<{ status: string }>('health')
  return response.data
}
