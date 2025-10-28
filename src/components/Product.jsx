import { useState } from 'react'
import styled from 'styled-components'
import Loading from './Loading'

function Product ({ data, submitCallback = () => {}, type = 'shop', starterCount = 1 }) {
  const [count, setCount] = useState(starterCount)

  if (!data) {
    // This case will be handled by the parent component's loading state,
    // but as a fallback, we can render a loading indicator or null.
    return <div data-testid='loading'><Loading /></div>
  }

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
      submitCallback(data.id, count)
      return
    }

    if (submitter === 'remove') {
      submitCallback(data.id, 0)
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
          <h3 data-testid='title' className='title'>{title}</h3>
          <p data-testid='description' className='desc'>{description}</p>
        </div>
      </div>
      <div className='box-2'>
        <form onSubmit={handleSubmit}>
          <p data-testid='price'>${(price * count).toFixed(2)}</p>
          <div className='inputs'>

            <button data-testid='decrease' className='helper' onClick={handleDecrease}>-</button>
            <input
              data-testid='input'
              type='number'
              name='count'
              min={1}
              value={count}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button data-testid='increase' className='helper' onClick={handleIncrease}>+</button>
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
background-color: white;
border: 2px solid var(--bg-2, grey);
box-shadow: 4px 4px 10px 1px var(--bg-2);
box-sizing: border-box;
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
    margin-right: 1em;
    aspect-ratio: 1/1;
    object-fit: contain;
    align-self: center;
  }

  .box-1 .text{
    padding-top: 1em;
  }

  .box-1 .desc{
    overflow-y: auto;
    height: 60%;
  }
  .box-1 .title{
    overflow-y: hidden;
    height: 20%;
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
      background-color: transparent;
      color: black;
      border: 2px solid var(--bg-2);
   }
   button:hover{
    cursor: pointer;
   }
  button.helper{
    height: var(--height-1);
    width: var(--height-1);
    border-radius: calc(var(--height-1) / 2);
    border: none;
  }
  button[type='submit']{
    /* background-color: ; */
    padding: 0.2em;
  }
  .buttons{
    display:flex;
    flex-direction: row-reverse
  }
`

export default Product
