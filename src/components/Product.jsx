import { useEffect, useMemo, useState } from 'react'

function useProduct (id) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://fakestoreapi.com/products/${id}`, { mode: 'cors', signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('server error')
        }
        return response.json()
      })
      .then((response) => setData(response))
      .catch((error) => setError(error))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  return { loading, error, data }
}

function Product ({ productId = 0, submitCallback = () => {}, type = 'shop' }) {
  const { loading, error, data } = useProduct(productId)
  const [count, setCount] = useState(1)

  if (loading) return <p data-testid='loading'>Loading...</p>
  if (error) return <p data-testid='error'>Error...</p>

  function handleChange (e) {
    setCount(e.target.value)
  }
  function handleBlur (e) {
    const value = e.target.value
    if (value < 1) setCount(1)
    else setCount(Math.floor(value))
  }

  function handleSubmit (e) {
    e.preventDefault()

    const submitter = e.nativeEvent.submitter.name
    if (submitter === 'add') {
      const count = e.target.elements.count.value * 1
      submitCallback(productId, count)
      return
    }

    if (submitter === 'remove') {
      submitCallback(productId, 0)
    }
  }

  const { image, title, price, description } = data

  const handleIncrease = () => {
    setCount((c) => c + 1)
  }
  const handleDecrease = () => {
    setCount((c) => c - 1)
  }
  return (
    <div>
      <img src={image} alt='product image' />
      <h5 data-testid='title'>{title}</h5>
      <p data-testid='description'>{description}</p>
      <p data-testid='price'>${(price * count).toFixed(2)}</p>
      <button data-testid='increase' onClick={handleIncrease} />

      <form onSubmit={handleSubmit}>
        <input
          data-testid='input'
          type='number'
          name='count'
          min={1}
          value={count}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button type='submit' data-testid='submit' name='add'>{type === 'cart' ? 'Update Cart' : 'Add to Cart'}</button>
        {type === 'cart' && <button type='submit' data-testid='remove' name='remove'>Remove</button>}
      </form>
      <button data-testid='decrease' onClick={handleDecrease} />
    </div>
  )
}

export default Product
