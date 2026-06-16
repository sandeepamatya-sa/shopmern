import { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import http from '@/http'
import { Loading, ProductSection } from '@/components'
import { ProductData } from '@/library/interfaces'
import { Link } from 'react-router-dom'

const BASE = 'http://localhost:5000/'

const normalize = (arr: any[]): ProductData[] =>
  arr.map(p => ({ ...p, image: p.image || (p.images?.[0] ? BASE + p.images[0] : '') }))

export const Home = () => {
  const [featured, setFeatured] = useState<ProductData[]>([])
  const [latest, setLatest] = useState<ProductData[]>([])
  const [topSelling, setTopSelling] = useState<ProductData[]>([])
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      http.get('/products/featured'),
      http.get('/products/latest'),
      http.get('/products/top-selling'),
      http.get('/mix/categories'),
    ])
      .then(([f, l, t, c]) => {
        setFeatured(normalize(f.data?.featured || f.data || []))
        setLatest(normalize(l.data?.latest || l.data || []))
        setTopSelling(normalize(t.data?.topSelling || t.data || []))
        setCategories(c.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <>
      {/* Hero Carousel */}
      <Carousel className="mb-4 rounded overflow-hidden shadow">
        {[
          { bg: '#1a1a2e', title: 'New Arrivals', sub: 'Discover the latest trends', btn: 'Shop Now' },
          { bg: '#16213e', title: 'Top Deals', sub: 'Up to 50% off on selected items', btn: 'View Deals' },
          { bg: '#0f3460', title: 'Free Shipping', sub: 'On orders above Rs. 2000', btn: 'Start Shopping' },
        ].map((slide, i) => (
          <Carousel.Item key={i}>
            <div
              className="d-flex flex-column align-items-center justify-content-center text-white text-center py-5"
              style={{ background: slide.bg, minHeight: 320 }}
            >
              <h1 className="display-4 fw-bold">{slide.title}</h1>
              <p className="lead">{slide.sub}</p>
              <Link to="/products" className="btn btn-primary btn-lg mt-2">{slide.btn}</Link>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="mb-4">
          <h5 className="fw-bold mb-3">Browse by Category</h5>
          <div className="d-flex flex-wrap gap-2">
            {categories.map(c => (
              <Link key={c._id} to={`/category/${c._id}`} className="btn btn-outline-primary btn-sm rounded-pill">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ProductSection data={featured} title="Featured Products" />
      <hr />
      <ProductSection data={topSelling} title="Top Selling Products" />
      <hr />
      <ProductSection data={latest} title="Latest Products" />

      {/* CTA Banner */}
      <div className="rounded-3 text-center py-5 my-4 text-white" style={{ background: 'linear-gradient(135deg, #e44d26, #c43d1c)' }}>
        <h2 className="fw-bold">Ready to Shop?</h2>
        <p className="lead">Browse thousands of products at unbeatable prices</p>
        <Link to="/products" className="btn btn-light btn-lg">View All Products</Link>
      </div>
    </>
  )
}
