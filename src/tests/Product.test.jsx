import { describe, it, expect, vi } from 'vitest'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Product from '../components/Product'
import mockProducts from '../mocks/mockProducts'

const mockProduct = mockProducts[0]

describe('Product Displays Correctly', () => {
  it('displays product info', () => {
    render(<Product data={mockProduct} />)

    const title = screen.getByTestId('title')
    const price = screen.getByTestId('price')
    const description = screen.getByTestId('description')
    const image = screen.getByRole('img')

    expect(title).toHaveTextContent(mockProduct.title)
    expect(price).toHaveTextContent(mockProduct.price)
    expect(description).toHaveTextContent(mockProduct.description)
    expect(image).toHaveAttribute('src', mockProduct.image)
  })
})

describe('Product Input field', () => {
  it('displays input field', async () => {
    const user = userEvent.setup()

    render(<Product data={mockProduct} />)

    const input = screen.getByTestId('input')

    await user.clear(input)
    await user.type(input, '12')

    expect(input).toHaveValue(12)
  })

  it('input field defaults to 1 when unfocused with empty or negative value', async () => {
    const user = userEvent.setup()

    render(<Product data={mockProduct} />)

    const input = screen.getByTestId('input')

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

    render(<Product data={mockProduct} />)

    const input = screen.getByTestId('input')
    const price = screen.getByTestId('price')

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
    render(<Product data={mockProduct} submitCallback={mock} />)

    const input = screen.getByTestId('input')
    const submit = screen.getByTestId('submit')

    await user.clear(input)
    await user.type(input, '-12')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 1)

    await user.clear(input)
    await user.type(input, '30.2')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 30)

    await user.clear(input)
    await user.type(input, '20e')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 1)

    await user.clear(input)
    await user.type(input, '2000')
    await user.click(submit)

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 2000)
  })

  it('+/- buttons modify value by 1/-1', async () => {
    const user = userEvent.setup()
    const mock = vi.fn()

    render(<Product data={mockProduct} submitCallback={mock} />)

    const input = screen.getByTestId('input')
    const submit = screen.getByTestId('submit')
    const increase = screen.getByTestId('increase')
    const decrease = screen.getByTestId('decrease')

    const increaseBy1 = async () => {
      await user.click(increase)
      await user.click(increase)
      await user.click(decrease)
      await user.click(submit)
    }

    await increaseBy1()
    expect(mock).toHaveBeenCalledWith(mockProduct.id, 2)

    await user.clear(input)
    await user.type(input, '-12')
    await increaseBy1()

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 2)

    await user.clear(input)
    await user.type(input, '30.2')
    await increaseBy1()

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 31)
  })
  it('increase works after typing (without blur)', async () => {
    const user = userEvent.setup()
    render(<Product data={mockProduct} />)

    const input = screen.getByTestId('input')
    const increase = screen.getByTestId('increase')

    await user.clear(input)
    await user.type(input, '5') // count is now "5" (string)
    await user.click(increase) // This will show "51" not 6!

    expect(input).toHaveValue(6) // FAILS - shows 51
  })
})

describe('type: cart', () => {
  it('remove button displays', () => {
    render(<Product data={mockProduct} type='cart' />)

    const title = screen.getByTestId('title')
    const remove = screen.getByTestId('remove')

    expect(title).toBeInTheDocument()
    expect(remove).toBeInTheDocument()
  })

  it('remove button Doesnt display on wrong type ', () => {
    render(<Product data={mockProduct} type='shop' />)

    const title = screen.getByTestId('title')
    expect(title).toBeInTheDocument()

    const remove = screen.queryByTestId('remove')
    expect(remove).toBeNull()
  })

  it('removes button sends product with 0 count', async () => {
    const user = userEvent.setup()
    const mock = vi.fn()

    render(<Product data={mockProduct} type='cart' submitCallback={mock} />)

    const remove = screen.getByTestId('remove')

    await user.click(remove)

    expect(mock).toHaveBeenCalledWith(mockProduct.id, 0)
  })
  it('displays Update Cart', () => {
    render(<Product data={mockProduct} type='cart' />)
    const submit = screen.getByTestId('submit')

    expect(submit).toHaveTextContent('Update Cart')
  })
  it('pre set count', () => {
    render(<Product data={mockProduct} type='cart' starterCount={10} />)
    const input = screen.getByTestId('input')

    expect(input).toHaveValue(10)
  })
})
