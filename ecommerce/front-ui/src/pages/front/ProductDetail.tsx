import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/cart.slice'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import http from '@/http'
import { Loading } from '@/components'
import { ProductData, ReviewData } from '@/library/interfaces'
import { RootState } from '@/store'
import dayjs from 'dayjs'

const BASE = 'http://localhost:5000/'

const StarPicker = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <div className="d-flex gap-1 mb-2">
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} style={{ fontSize: 26, cursor: 'pointer', color: n <= value ? '#f59e0b' : '#d1d5db' }}
        onClick={() => onChange(n)}>★</span>
    ))}
  </div>
)

export const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, user } = useSelector((s: RootState) => s.user)
  const [product, setProduct] = useState<ProductData | null>(null)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [mainImg, setMainImg] = useState('')
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadProduct = () => {
    setLoading(true)
    setError(false)
    http.get('/products/' + id)
      .then(r => {
        setProduct(r.data.product || r.data)
        setReviews(r.data.reviews || [])
        const imgs = r.data.product?.images || r.data.images || []
        setMainImg(imgs[0] ? BASE + imgs[0] : '')
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProduct() }, [id])

  const reviewFormik = useFormik({
    initialValues: { rating: 0, comment: '' },
    validationSchema: Yup.object({
      rating: Yup.number().min(1, 'Please select a rating').required('Required'),
      comment: Yup.string().min(10, 'At least 10 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await http.post('/profile/reviews', { ...values, productId: id })
        toast.success('Review submitted! It will appear after approval.')
        resetForm()
        loadProduct()
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to submit review')
      } finally { setSubmitting(false) }
    },
  })

  if (loading) return <Loading />

  if (error || !product) return (
    <div className="text-center py-5">
      <div style={{ fontSize: 60 }}>😕</div>
      <h4 className="mt-3">Product not found</h4>
      <p className="text-muted">This product may have been removed or doesn't exist.</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  )

  const price = product.discountedPrice > 0 ? product.discountedPrice : product.price
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length)
    : 0

  const handleAddToCart = () => {
    if (!token) {
      toast.info('Please login to add items to cart')
      navigate('/auth/login')
      return
    }
    dispatch(addToCart({
      productId: product._id,
      product: { _id: product._id, name: product.name, price: product.price, discountedPrice: product.discountedPrice, images: product.images },
      qty,
    }))
    toast.success(product.name + ' added to cart!')
  }

  const handleBuyNow = () => {
    if (!token) {
      toast.info('Please login to purchase')
      navigate('/auth/login')
      return
    }
    dispatch(addToCart({
      productId: product._id,
      product: { _id: product._id, name: product.name, price: product.price, discountedPrice: product.discountedPrice, images: product.images },
      qty,
    }))
    navigate('/cart')
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>{product.name}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Images */}
        <div className="col-md-5">
          <img
            src={mainImg || 'https://placehold.co/500x400?text=No+Image'}
            className="img-fluid rounded shadow-sm w-100 mb-3"
            style={{ maxHeight: 400, objectFit: 'cover' }}
            alt={product.name}
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/500x400?text=No+Image' }}
          />
          <div className="d-flex gap-2 flex-wrap">
            {product.images?.map((img, i) => (
              <img key={i} src={BASE + img}
                className="rounded border"
                style={{ width: 70, height: 70, objectFit: 'cover', cursor: 'pointer',
                  outline: mainImg === BASE + img ? '2px solid var(--primary)' : 'none' }}
                onClick={() => setMainImg(BASE + img)}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                alt="" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="col-md-7">
          <h2 className="fw-bold">{product.name}</h2>

          {/* Average rating display */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="text-warning">
              {[1,2,3,4,5].map(n => (
                <span key={n}>{n <= Math.round(avgRating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-muted small">
              {avgRating > 0 ? avgRating.toFixed(1) + ' / 5' : 'No ratings yet'}
              {reviews.length > 0 && <> &middot; {reviews.length} review{reviews.length > 1 ? 's' : ''}</>}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="price-current fs-4">Rs. {price.toLocaleString()}</span>
            {product.discountedPrice > 0 && (
              <>
                <span className="price-original fs-5">Rs. {product.price.toLocaleString()}</span>
                <span className="badge badge-discount">{Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF</span>
              </>
            )}
          </div>

          <p className="text-muted mb-4">{product.shortDescription}</p>

          <div className="mb-3 d-flex align-items-center gap-3">
            <label className="fw-semibold">Qty:</label>
            <div className="input-group" style={{ width: 130 }}>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <input className="form-control text-center" value={qty} readOnly />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap mb-4">
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
              <i className="fas fa-cart-plus me-2" />Add to Cart
            </button>
            <button className="btn btn-success btn-lg" onClick={handleBuyNow}>
              <i className="fas fa-bolt me-2" />Buy Now
            </button>
          </div>

          <div className="mt-2">
            <h5 className="fw-bold">Description</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          <div className="mt-3 d-flex gap-4 text-muted small">
            <span><i className="fas fa-tag me-1" />Category: {(product.categoryId as any)?.name || '-'}</span>
            <span><i className="fas fa-copyright me-1" />Brand: {(product.brandId as any)?.name || '-'}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h4 className="section-title mb-4">Customer Reviews</h4>

        {reviews.length === 0 ? (
          <div className="text-muted mb-4">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="mb-4">
            {reviews.map(r => (
              <div key={r._id} className="card mb-3 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 36, height: 36, fontSize: 14, flexShrink: 0 }}>
                        {(r.userId?.name || 'U')[0].toUpperCase()}
                      </span>
                      <div>
                        <div className="fw-semibold">{r.userId?.name || 'User'}</div>
                        <div className="text-warning" style={{ fontSize: 14 }}>
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="text-muted small">{dayjs(r.createdAt).format('MMM D, YYYY')}</span>
                  </div>
                  <p className="mb-0 mt-2">{r.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review */}
        {token ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Write a Review</h5>
              <form onSubmit={reviewFormik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Rating *</label>
                  <StarPicker
                    value={reviewFormik.values.rating}
                    onChange={n => reviewFormik.setFieldValue('rating', n)}
                  />
                  {reviewFormik.touched.rating && reviewFormik.errors.rating && (
                    <div className="text-danger small">{reviewFormik.errors.rating}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Comment *</label>
                  <textarea
                    className={'form-control' + (reviewFormik.touched.comment && reviewFormik.errors.comment ? ' is-invalid' : '')}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    {...reviewFormik.getFieldProps('comment')}
                  />
                  {reviewFormik.touched.comment && reviewFormik.errors.comment && (
                    <div className="invalid-feedback">{reviewFormik.errors.comment}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={reviewFormik.isSubmitting}>
                  {reviewFormik.isSubmitting
                    ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</>
                    : <><i className="fas fa-paper-plane me-2" />Submit Review</>}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-4">
              <i className="fas fa-lock fa-2x text-muted mb-2" />
              <p className="mb-2 text-muted">Login to write a review</p>
              <Link to="/auth/login" className="btn btn-primary btn-sm">
                <i className="fas fa-sign-in-alt me-1" />Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
