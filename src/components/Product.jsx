import { useEffect, useState } from 'react'
import styled from 'styled-components'

// ! the code is flawed: it requires setTimeout to prevent previous controller from affecting the next, consider asking
// ! on discord or use a library
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
      .then((response) => { setData(response); setError(null) })
      .catch((error) => { setError(error) })
      .finally(() => setLoading(false))

    return () => {
      controller.abort()
    }
  }, [id])

  return { loading, error, data }
}

function Product ({ productId = 0, submitCallback = () => {}, type = 'shop', starterCount = 1 }) {
  const { loading, error, data } = useProduct(productId)
  const [count, setCount] = useState(starterCount)

  if (loading) return <p data-testid='loading'>Loading...</p>
  if (error) return <p data-testid='error'>Error...{error.message}</p>

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

  const handleIncrease = (e) => {
    e.preventDefault()
    setCount((c) => c + 1)
  }
  const handleDecrease = (e) => {
    e.preventDefault()
    setCount((c) => c - 1)
  }
  return (
    <Wrapper>
      <div className='box-1'>
        <img src={image} alt='product image' />
        <div className='text'>
          <h3 data-testid='title'>{title}</h3>
          <p data-testid='description'>{description}</p>
        </div>
      </div>
      <div className='box-2'>
        <form onSubmit={handleSubmit}>
          <p data-testid='price'>${(price * count).toFixed(2)}</p>
          <div className='inputs'>

            <button data-testid='increase' className='helper' onClick={handleIncrease}>+</button>
            <input
              data-testid='input'
              type='number'
              name='count'
              min={1}
              value={count}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button data-testid='decrease' className='helper' onClick={handleDecrease}>-</button>
          </div>

          <div className='buttons'>
            <button type='submit' data-testid='submit' name='add'>{type === 'cart' ? 'Update Cart' : 'Add to Cart'}</button>
            {type === 'cart' && <button type='submit' data-testid='remove' name='remove'>Remove</button>}
          </div>
        </form>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
background-color: red;
border-radius: 1em;
  display: flex;
  height: 200px;
  padding: 1em;
  .box-1, .box-2{
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
  }
/* Box 1 */
  .box-1 img{
    height: 90%;

    object-fit: cover;
    align-self: center;
  }

  .box-1 .text{
    padding-top: 1em;
  }

  /* Box-2 */
  --height-1: 2em;
  .box-2{
    form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1em;
      padding: 0.5em;
    }
    
  }
  .inputs{
    display: flex;
    column-gap: 0.5em;
  }
  input{
      height: var(--height-1);
    }
  button.helper{
    height: var(--height-1);
    width: var(--height-1);
    border-radius: calc(var(--height-1) / 2)
  }
  button[type='submit']{
    background-color:blue;
  }
  .buttons{
    display:flex;
    flex-direction: row-reverse
  }
`

export default Product
