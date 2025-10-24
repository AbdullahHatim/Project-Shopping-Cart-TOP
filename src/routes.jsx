import App from './App'
import ErrorPage from './Pages/ErrorPage'
import HomePage from './Pages/HomePage'
import ShopPage from './Pages/ShopPage'
import CartPage from './Pages/CartPage'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '*',
        element: <ErrorPage />
      },
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'shop',
        element: <ShopPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      }
    ]
  }
]

export default routes
