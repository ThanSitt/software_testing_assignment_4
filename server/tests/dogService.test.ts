import { describe, expect, vi, test } from 'vitest'
import { getRandomDogImage } from '../services/dogService.ts'

describe('getrandomdogimage', () => {
  test('should return imageurl and success status', async () => {
    const mockedData = {
      message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockedData
    })

    const result = await getRandomDogImage()
    expect(global.fetch).toHaveBeenCalledOnce()
    expect(result).toEqual({
      imageUrl: mockedData.message,
      status: 'success'
    })
  })

  test('should reject and throw error when api response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    })

    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    )
    expect(fetch).toHaveBeenCalledOnce()
  })
})

