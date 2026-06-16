import { AppRouter } from '@/routes/AppRouter'
import { Bounce, ToastContainer } from 'react-toastify'

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={4000} theme="colored" transition={Bounce} />
    </>
  )
}
