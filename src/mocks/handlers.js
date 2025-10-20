import { http, HttpResponse } from 'msw'
import mockProducts from './mockProducts'

export const handlers = [
  // Intercept the GET request to the fakestoreapi
  http.get('https://fakestoreapi.com/products/:productId', ({ params }) => {
    const { productId } = params

    console.log(`[MSW] Intercepted request for product ID: ${productId}`)
    return HttpResponse.json(mockProducts[0])
  })
]
