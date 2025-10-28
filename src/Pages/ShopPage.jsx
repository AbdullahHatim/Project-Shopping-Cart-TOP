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
  const [_, setProducts] = useOutletContext()
  const { loading, error, data: products } = useAllProducts()

  function handleProductSubmit (id, count) {
    setProducts((prev) => {
      // if the same prdouct id exists add the count, otherwise add the product
      const existingProductIndex = prev.findIndex(product => product.id === id)
      if (existingProductIndex !== -1) {
        const updatedProducts = [...prev]
        updatedProducts[existingProductIndex].count += count
        return updatedProducts
      } else {
        const newProduct = products.find(product => product.id === id)
        return [...prev, { ...newProduct, count }]
      }
    })
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
