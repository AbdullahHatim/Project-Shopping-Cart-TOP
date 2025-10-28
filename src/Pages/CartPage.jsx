import { useOutletContext } from 'react-router'
import styled from 'styled-components'
import Product from '../components/Product'

function CartPage () {
  const [products, setProducts] = useOutletContext()

  function handleProductSubmit (id, count) {
    setProducts((prev) => {
      const existingProductIndex = prev.findIndex((product) => product.id === id)

      // add a confirmation
      if (count === 0 && window.confirm(`Are you sure you want to remove\n ${prev[existingProductIndex].title}?`)) {
        return prev.filter((product) => product.id !== id)
      }

      if (existingProductIndex !== -1) {
        const updatedProducts = [...prev]
        updatedProducts[existingProductIndex].count = count
        return updatedProducts
      }
    })
  }

  return (
    <Wrapper>
      {!products.length && <p>Your cart is empty</p>}
      {products.map((product) => (
        <Product
          key={product.id}
          data={product}
          starterCount={product.count}
          type='cart'
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

export default CartPage
