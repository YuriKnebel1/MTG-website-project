/**
 * @jest-environment node
 */
import { GET } from '../../src/app/api/health/route'

// Mock Prisma
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    user: {
      count: jest.fn().mockResolvedValue(1),
    },
  },
}))

describe('/api/health', () => {
  it('returns health status', async () => {
    const response = await GET()
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
  })
})
