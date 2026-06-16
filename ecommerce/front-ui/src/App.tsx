import { AppRouter } from '@/routes/AppRouter'
import { Bounce, ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        transition={Bounce}
      />
    </>
  )
}

export default App
