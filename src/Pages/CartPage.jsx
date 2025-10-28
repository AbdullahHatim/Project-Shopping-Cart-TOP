import { useOutletContext } from 'react-router'

function CartPage () {
  const [count, setCount] = useOutletContext()

  return (
    <h1>Hello From Cart</h1>
  )
}

export default CartPage
