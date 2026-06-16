import { Link } from 'react-router-dom'

interface Props {
  title: string
  createLink?: string
  createLabel?: string
  extra?: React.ReactNode
}

export const PageHeader = ({ title, createLink, createLabel = 'Add New', extra }: Props) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h4 className="fw-bold mb-0">{title}</h4>
    <div className="d-flex gap-2">
      {extra}
      {createLink && (
        <Link to={createLink} className="btn btn-primary btn-sm">
          <i className="fas fa-plus me-1" />{createLabel}
        </Link>
      )}
    </div>
  </div>
)
