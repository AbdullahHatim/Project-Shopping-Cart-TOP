import './App.css'
import styled from 'styled-components'
import { Link, Outlet } from 'react-router'
import Product from './components/product'
import { useState } from 'react'

function App () {
  const [count, setCount] = useState(0)

  const cartCount = count > 0 ? count > 99 ? '🤑' : count : '0'
  return (
    <Wrapper $count={count} data-test='hello'>
      <nav>
        <div className='nav'>
          <Link to='/' className='link'>Home</Link>
          <Link to='/shop' className='link'>Shop</Link>
          <Link to='/cart' className='link' data-count={cartCount}>Cart</Link>
        </div>
      </nav>
      <main>
        <Outlet context={[count, setCount]} />
      </main>
    </Wrapper>
  )
}

// ! Fix the dumbass scroll bar shifting the layout without black bars
// ! My idea is to limit the entire app to 100svh, then have a scroll bar within <main>
// ! I won't implement this now because i've wasted enough time
const Wrapper = styled.div`
background-color: var(--bg-1);
height: 100svh;
overflow-y: auto;
nav{
  display: flex;
  justify-content: center;
  height: 100px;
  width: 100%;
  box-shadow: 0px 1px 10px 1px var(--bg-2);
  /* border-bottom: 1px solid var(--border-color); */
}
.nav{
  height: 100%;
  width: 100%;
  font-size: 1.2em;
  font-weight: 900;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  max-width: var(--max-width);
   display: flex;
  justify-content: space-between;
  align-items: center;
}
.link{
  display: block;
  background-color: var(--bg-1);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
.link[data-count]{
  position: relative;
  &::after{
    content: attr(data-count);
    font-family:  monospace;
    position: absolute;
    left: calc( 50% + 2.5ch);
    background-color: red;
    border-radius: 50%;
    width: 30px;
    aspect-ratio: 1/1;
    color: white;
    scale: 0.75;
    text-align: center;
    display: ${props => props.$count > 0 ? 'flex' : 'none'};
    justify-content: center;
    align-items:center;
  }
}

.link:hover{
  background-color: var(--hover-1);
}
/* Main */
main{
  max-width: var(--max-width);
  margin: 0 auto;
  padding-top: 2em;
}

`

export default App
