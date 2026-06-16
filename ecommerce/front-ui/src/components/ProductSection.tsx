import { ProductData } from '@/library/interfaces'
import { ProductCard } from './ProductCard'

interface Props {
  title: string
  data: ProductData[]
}

export const ProductSection = ({ title, data }: Props) => {
  if (!data.length) return null

  return (
    <div className="col-12 my-4">
      <h4 className="section-title mb-4">{title}</h4>
      <div className="row g-3">
        {data.map(p => (
          <div key={p._id} className="col-6 col-md-4 col-lg-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
