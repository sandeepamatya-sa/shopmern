import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import http from '@/http'

export const PaymentSuccess = () => {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')

  useEffect(() => {
    const data = params.get('data')
    if (!data) return setStatus('failed')

    http.get(`/api/payment/verify?data=${data}`)
      .then(r => setStatus(r.data.success ? 'success' : 'failed'))
      .catch(() => setStatus('failed'))
  }, [])

  return (
    <div className="text-center py-5">
      {status === 'verifying' && (
        <>
          <div className="spinner-border text-primary mb-3" />
          <h5>Verifying payment...</h5>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="text-success mb-3" style={{ fontSize: 64 }}>✅</div>
          <h3 className="fw-bold text-success">Payment Successful!</h3>
          <p className="text-muted">Your order has been confirmed. Thank you for shopping with us!</p>
          <Link to="/orders" className="btn btn-primary me-2">View Orders</Link>
          <Link to="/" className="btn btn-outline-primary">Continue Shopping</Link>
        </>
      )}
      {status === 'failed' && (
        <>
          <div className="text-danger mb-3" style={{ fontSize: 64 }}>❌</div>
          <h3 className="fw-bold text-danger">Payment Failed</h3>
          <p className="text-muted">Something went wrong with your payment. Please try again.</p>
          <Link to="/cart" className="btn btn-primary">Back to Cart</Link>
        </>
      )}
    </div>
  )
}

export const PaymentFailure = () => (
  <div className="text-center py-5">
    <div className="text-danger mb-3" style={{ fontSize: 64 }}>❌</div>
    <h3 className="fw-bold text-danger">Payment Cancelled</h3>
    <p className="text-muted">Your payment was cancelled or failed. Your cart is still saved.</p>
    <Link to="/cart" className="btn btn-primary me-2">Back to Cart</Link>
    <Link to="/" className="btn btn-outline-primary">Home</Link>
  </div>
)
