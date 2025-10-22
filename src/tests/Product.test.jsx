import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Product from '../components/Product'
import mockProducts from '../mocks/mockProducts'

const productId = 1
const mockProduct = mockProducts[0]

// beforeEach(() => {
//   // Mock the fetch API before each test
//   global.fetch = vi.fn(() =>
//     Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve(mockProduct)
//     })
//   )
// })

describe('Product Displays Correctly', () => {
  it('shows loading', () => {
    render(<Product />)

    const loading = screen.getByTestId('loading')
    expect(loading).toBeInTheDocument()
  })
  it('shows error on failed fetch', async () => {
    // Override the mock from `beforeEach` to simulate a failed fetch
    vi.spyOn(global, 'fetch').mockImplementationOnce(() => {
      return Promise.reject(new Error(''))
    })
    render(<Product productId={productId} />)

    const error = await screen.findByTestId('error')
    expect(error).toBeInTheDocument()
  })

  it('displays product info', async () => {
    render(<Product productId={productId} />)

    const title = await screen.findByTestId('title')
    const price = await screen.findByTestId('price')
    const description = await screen.findByTestId('description')
    const image = await screen.findByRole('img')

    expect(title).toHaveTextContent(mockProduct.title)
    expect(price).toHaveTextContent(mockProduct.price)
    expect(description).toHaveTextContent(mockProduct.description)
    expect(image).toHaveAttribute('src', mockProduct.image)
  })
})

describe('Product Input field', () => {
  it('displays input field', async () => {
    const user = userEvent.setup()

    render(<Product productId={productId} />)

    const input = await screen.findByTestId('input')

    await user.clear(input)
    await user.type(input, '12')

    expect(input).toHaveValue(12)
  })

  it('input field defaults to 1 when unfocused with empty or negative value', async () => {
    const user = userEvent.setup()

    render(<Product productId={productId} />)

    const input = await screen.findByTestId('input')

    await user.clear(input)
    await user.click(document.body)

    expect(input).not.toHaveFocus()
    expect(input).toHaveValue(1)

    await user.clear(input)
    await user.type(input, '-12')
    await user.click(document.body)

    expect(input).not.toHaveFocus()
    expect(input).toHaveValue(1)
  })

  it('price multiplies with input field after blur', async () => {
    const user = userEvent.setup()

    render(<Product productId={productId} />)

    const input = await screen.findByTestId('input')
    const price = await screen.findByTestId('price')

    await user.clear(input)
    await user.type(input, '12')
    await user.click(document.body)

    const calculatedPrice = (mockProduct.price * 12).toFixed(2)
    const productPrice = price.textContent.replace('$', '') * 1
    expect(productPrice).toBeCloseTo(calculatedPrice)
  })

  it('Submits positive integer with product id', async () => {
    const user = userEvent.setup()

    const mock = vi.fn()
    render(<Product productId={productId} submitCallback={mock} />)

    const input = await screen.findByTestId('input')
    const submit = await screen.findByTestId('submit')

    await user.clear(input)
    await user.type(input, '-12')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(productId, 1)

    await user.clear(input)
    await user.type(input, '30.2')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(productId, 30)

    await user.clear(input)
    await user.type(input, '20e')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(productId, 1)

    await user.clear(input)
    await user.type(input, '2000')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(productId, 2000)
  })

  it('+/- buttons modify value by 1/-1', async () => {
    const user = userEvent.setup()
    const mock = vi.fn()

    render(<Product productId={productId} submitCallback={mock} />)

    const input = await screen.findByTestId('input')
    const submit = await screen.findByTestId('submit')
    const increase = await screen.findByTestId('increase')
    const decrease = await screen.findByTestId('decrease')

    const increaseBy1 = async () => {
      await user.click(increase)
      await user.click(increase)
      await user.click(decrease)
      await user.click(submit)
    }

    await increaseBy1()
    expect(mock).toHaveBeenCalledWith(productId, 2)

    await user.clear(input)
    await user.type(input, '-12')
    await increaseBy1()

    expect(mock).toHaveBeenCalledWith(productId, 2)

    await user.clear(input)
    await user.type(input, '30.2')
    await increaseBy1()

    expect(mock).toHaveBeenCalledWith(productId, 31)
  })
  it('increase works after typing (without blur)', async () => {
    const user = userEvent.setup()
    render(<Product productId={productId} />)

    const input = await screen.findByTestId('input')
    const increase = await screen.findByTestId('increase')

    await user.clear(input)
    await user.type(input, '5') // count is now "5" (string)
    await user.click(increase) // This will show "51" not 6!

    expect(input).toHaveValue(6) // FAILS - shows 51
  })
})

describe('type: cart', () => {
  it('remove button displays', async () => {
    render(<Product productId={productId} type='cart' />)

    const title = await screen.findByTestId('title')
    const remove = await screen.findByTestId('remove')

    expect(title).toBeInTheDocument()
    expect(remove).toBeInTheDocument()
  })

  it('remove button Doesnt display on wrong type ', async () => {
    render(<Product productId={productId} type='shop' />)

    const title = await screen.findByTestId('title')
    expect(title).toBeInTheDocument()

    const remove = screen.queryByTestId('remove')
    expect(remove).toBeNull()
  })

  it('removes button sends product with 0 count', async () => {
    const user = userEvent.setup()
    const mock = vi.fn()

    render(<Product productId={productId} type='cart' submitCallback={mock} />)

    const remove = await screen.findByTestId('remove')

    await user.click(remove)

    expect(mock).toHaveBeenCalledWith(productId, 0)
  })
  it('displays Update Cart', async () => {
    render(<Product productId={productId} type='cart' />)
    const submit = await screen.findByTestId('submit')

    expect(submit).toHaveTextContent('Update Cart')
  })
  it('pre set count', async () => {
    render(<Product productId={productId} type='cart' starterCount={10} />)
    const input = await screen.findByTestId('input')

    expect(input).toHaveValue(10)
  })
})
