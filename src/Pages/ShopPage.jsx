import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router'
import styled from 'styled-components'
import Product from '../components/Product'
import Loading from '../components/Loading'

function useAllProducts () {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('https://fakestoreapi.com/products', { mode: 'cors', signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Server error')
        }
        return response.json()
      })
      .then((response) => {
        setData(response)
        setError(null)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [])

  return { loading, error, data }
}

function ShopPage () {
  const { cart, setCart } = useOutletContext()
  const { loading, error, data: products } = useAllProducts()

  function handleProductSubmit (productId, count) {
    // This logic will depend on how your cart is structured.
    // For now, let's just log it.
    console.log(`Product ID: ${productId}, Count: ${count}`)
  }

  if (loading) return <Loading />
  if (error) return <p>A network error has occurred: {error.message}</p>

  return (
    <Wrapper>
      {products.map((product) => (
        <Product
          key={product.id}
          data={product}
          submitCallback={handleProductSubmit}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  padding-bottom: 2em;
`

export default ShopPage
