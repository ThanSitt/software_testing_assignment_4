import { describe, test, expect, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index'
import * as dogController from '../controllers/dogController'

vi.mock('../controllers/dogController')

describe('dogroutes get /api/dogs/random', () => {
  test('should return status 200 and success true with mocked data', async () => {
    const mockedResponse = {
      success: true,
      data: {
        imageUrl: 'https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg',
        status: 'success'
      }
    }

    vi.mocked(dogController.getDogImage).mockImplementation(async (_req, res) => {
      res.json(mockedResponse)
    })

    const response = await request(app).get('/api/dogs/random')
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.imageUrl).toContain('https://images.dog.ceo')
  })

  test('should return 500 and error message on failure', async () => {
    const mockedErrorResponse = {
      success: false,
      error: 'Failed to fetch dog image: Network error'
    }

    vi.mocked(dogController.getDogImage).mockImplementation(async (_req, res) => {
      res.status(500).json(mockedErrorResponse)
    })

    const response = await request(app).get('/api/dogs/random')
    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Failed to fetch dog image: Network error')
  })
})