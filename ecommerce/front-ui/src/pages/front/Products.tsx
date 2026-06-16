import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import http from '@/http'
import { Loading, ProductCard } from '@/components'
import { ProductData } from '@/library/interfaces'

export const Products = () => {
  const [params] = useSearchParams()
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const search = params.get('search') || ''

  useEffect(() => {
    http.get('/mix/brands').then(r => setBrands(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (selectedBrand) q.set('brandId', selectedBrand)
    http.get(`/products?${q}`)
      .then(r => setProducts(r.data?.products || r.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [search, selectedBrand])

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="section-title">{search ? `Results for "${search}"` : 'All Products'}</h4>
        <select
          className="form-select w-auto"
          value={selectedBrand}
          onChange={e => setSelectedBrand(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {loading ? <Loading /> : products.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="fas fa-box-open fa-3x mb-3" />
          <p>No products found.</p>
        </div>
      ) : (
        <div className="row g-3">
          {products.map(p => (
            <div key={p._id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
