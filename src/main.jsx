import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import routes from './routes.jsx'

async function enableMocking () {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./mocks/browser.js')
  return worker.start()
}

const router = createBrowserRouter(routes)

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
})
