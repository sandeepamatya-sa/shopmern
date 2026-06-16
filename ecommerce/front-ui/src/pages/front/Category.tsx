import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import http from '@/http'
import { Loading, ProductCard } from '@/components'
import { ProductData } from '@/library/interfaces'

export const Category = () => {
  const { id } = useParams()
  const [products, setProducts] = useState<ProductData[]>([])
  const [catName, setCatName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      http.get(`/products/category/${id}`),
      http.get('/mix/categories'),
    ])
      .then(([p, c]) => {
        setProducts(p.data || [])
        const cat = c.data.find((x: any) => x._id === id)
        if (cat) setCatName(cat.name)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  return (
    <>
      <h4 className="section-title mb-4">{catName || 'Category'}</h4>
      {loading ? <Loading /> : products.length === 0 ? (
        <p className="text-muted">No products in this category.</p>
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
