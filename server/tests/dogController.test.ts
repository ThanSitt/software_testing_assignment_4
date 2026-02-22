import { describe, test, expect, vi } from 'vitest'
import { getDogImage } from '../controllers/dogController'
import * as dogService from '../services/dogService'
import { Response, Request } from 'express'

vi.mock('../services/dogService')
describe('dogcontroller', () => {
  test('should return success true and data from service', async () => {
    const mockDogData = {
      imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    }

    vi.mocked(dogService.getRandomDogImage).mockResolvedValue(mockDogData)

    const res = {
      json: vi.fn(),
    } as unknown as Response

    await getDogImage({} as Request, res)
    expect(dogService.getRandomDogImage).toHaveBeenCalledOnce()
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockDogData
    })
  })
})