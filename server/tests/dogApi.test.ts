import { describe, test, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express, { Request, Response} from 'express'
import dogRouter from '../routes/dogRoutes'
import * as dogService from '../services/dogService'

const app = express()
app.use(express.json())
app.use('/api/dogs', dogRouter)

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

vi.mock('../services/dogService')

describe('GET /api/dogs/random', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('Test 1 - returns a random dog image successfully', async () => {
    vi.mocked(dogService.getRandomDogImage).mockResolvedValue({
      imageUrl: 'https://images.dog.ceo/breeds/sheepdog-indian/Himalayan_Sheepdog.jpg',
      status: 'success',
    })

    const response = await request(app).get('/api/dogs/random')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.imageUrl).toBeDefined()
    expect(typeof response.body.data.imageUrl).toBe('string')
  })

  test('Test 2 - returns 404 for invalid route', async () => {
    const response = await request(app).get('/api/dogs/invalid')

    expect(response.status).toBe(404)
    expect(response.body.error).toBeDefined()
    expect(response.body.error).toBe('Route not found')
  })
})