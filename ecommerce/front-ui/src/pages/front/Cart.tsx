import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '@/store'
import { removeFromCart, updateQty, clearCart } from '@/store/cart.slice'
import { toast } from 'react-toastify'
import http from '@/http'

const BASE = 'http://localhost:5000/'

export const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((s: RootState) => s.cart)
  const { user, token } = useSelector((s: RootState) => s.user)

  const total = items.reduce((sum, item) => {
    const price = item.product.discountedPrice > 0 ? item.product.discountedPrice : item.product.price
    return sum + price * item.qty
  }, 0)

  const shipping = total > 0 && total < 2000 ? 150 : 0
  const grandTotal = total + shipping

  const handleCheckout = async () => {
    if (!token) {
      toast.info('Please login to proceed to checkout')
      navigate('/auth/login')
      return
    }
    try {
      const res = await http.post('/api/checkout', { cart: items })
      const { orderId } = res.data
      const payRes = await http.post('/api/payment/initiate', { orderId })
      const pd = payRes.data.paymentData

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
      Object.entries(pd).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'; input.name = k; input.value = String(v)
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
      dispatch(clearCart())
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed. Please try again.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-shopping-cart fa-4x text-muted mb-4" />
        <h4>Your cart is empty</h4>
        <p className="text-muted">Looks like you haven't added anything yet</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <>
      <h4 className="section-title mb-4">
        Shopping Cart <span className="text-muted fs-6 fw-normal">({items.length} item{items.length > 1 ? 's' : ''})</span>
      </h4>

      <div className="row g-4">
        <div className="col-lg-8">
          {items.map(item => {
            const price = item.product.discountedPrice > 0 ? item.product.discountedPrice : item.product.price
            const img = item.product.images?.[0] ? BASE + item.product.images[0] : 'https://placehold.co/80x80?text=?'
            return (
              <div key={item.productId} className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex gap-3 align-items-center">
                    <img src={img} alt={item.product.name} className="rounded"
                      style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=?' }} />
                    <div className="flex-grow-1">
                      <Link to={'/products/' + item.productId} className="fw-semibold text-decoration-none text-dark">
                        {item.product.name}
                      </Link>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <span className="price-current">Rs. {price.toLocaleString()}</span>
                        {item.product.discountedPrice > 0 && (
                          <span className="price-original">Rs. {item.product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      <div className="input-group" style={{ width: 120 }}>
                        <button className="btn btn-outline-secondary btn-sm" type="button"
                          onClick={() => dispatch(updateQty({ productId: item.productId, qty: Math.max(1, item.qty - 1) }))}>−</button>
                        <input className="form-control form-control-sm text-center" value={item.qty} readOnly />
                        <button className="btn btn-outline-secondary btn-sm" type="button"
                          onClick={() => dispatch(updateQty({ productId: item.productId, qty: item.qty + 1 }))}>+</button>
                      </div>
                      <span className="fw-bold text-nowrap">Rs. {(price * item.qty).toLocaleString()}</span>
                      <button className="btn btn-sm text-danger border-0" title="Remove"
                        onClick={() => dispatch(removeFromCart(item.productId))}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <button className="btn btn-outline-danger btn-sm" onClick={() => { dispatch(clearCart()); toast.info('Cart cleared') }}>
            <i className="fas fa-trash me-1" />Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: 80 }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({items.reduce((a, i) => a + i.qty, 0)} items)</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className={`d-flex justify-content-between mb-2 ${shipping === 0 ? 'text-success' : ''}`}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : 'Rs. ' + shipping}</span>
              </div>
              {shipping > 0 && (
                <div className="alert alert-info py-2 px-3 mb-2" style={{ fontSize: 12 }}>
                  Add Rs. {(2000 - total).toLocaleString()} more for free shipping!
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Total</span>
                <span className="price-current">Rs. {grandTotal.toLocaleString()}</span>
              </div>

              {!token && (
                <div className="alert alert-warning py-2 px-3 mb-3 text-center" style={{ fontSize: 13 }}>
                  <i className="fas fa-info-circle me-1" />Login required to checkout
                </div>
              )}

              <button className="btn btn-primary w-100 btn-lg" onClick={handleCheckout}>
                <i className="fas fa-lock me-2" />
                {token ? 'Proceed to Checkout' : 'Login & Checkout'}
              </button>
              <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
                <i className="fas fa-arrow-left me-1" />Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
