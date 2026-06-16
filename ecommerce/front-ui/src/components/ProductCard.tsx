import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/cart.slice'
import { toast } from 'react-toastify'
import { ProductData } from '@/library/interfaces'
import { RootState } from '@/store'

const BASE = 'http://localhost:5000/'

interface Props {
  product: ProductData
}

export const ProductCard = ({ product }: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((s: RootState) => s.user)
  const img = product.images?.[0] ? BASE + product.images[0] : product.image || 'https://placehold.co/300x220?text=No+Image'
  const price = product.discountedPrice > 0 ? product.discountedPrice : product.price
  const hasDiscount = product.discountedPrice > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!token) {
      toast.info('Please login to add items to cart')
      navigate('/auth/login')
      return
    }
    dispatch(addToCart({
      productId: product._id,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        images: product.images,
      },
      qty: 1,
    }))
    toast.success(product.name + ' added to cart!')
  }

  return (
    <div className="card product-card h-100 position-relative">
      <Link to={'/products/' + product._id}>
        <img src={img} className="card-img-top" alt={product.name}
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x220?text=No+Image' }} />
      </Link>
      {hasDiscount && (
        <span className="position-absolute top-0 end-0 badge badge-discount m-2">
          {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
        </span>
      )}
      <div className="card-body d-flex flex-column">
        <Link to={'/products/' + product._id} className="text-decoration-none text-dark">
          <h6 className="card-title mb-1 text-truncate">{product.name}</h6>
        </Link>
        <p className="text-muted small mb-2 text-truncate">{product.shortDescription}</p>
        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="price-current">Rs. {price.toLocaleString()}</span>
            {hasDiscount && <span className="price-original">Rs. {product.price.toLocaleString()}</span>}
          </div>
          <button className="btn btn-primary btn-sm w-100" onClick={handleAddToCart}>
            <i className="fas fa-cart-plus me-1" />Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
