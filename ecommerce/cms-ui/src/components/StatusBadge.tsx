export const StatusBadge = ({ status }: { status: boolean | string }) => {
  if (typeof status === 'boolean') {
    return <span className={`badge ${status ? 'bg-success' : 'bg-danger'}`}>{status ? 'Active' : 'Inactive'}</span>
  }
  const colors: Record<string, string> = {
    Processing: 'bg-warning text-dark',
    Confirmed: 'bg-info',
    Shipping: 'bg-primary',
    Delivered: 'bg-success',
    Cancelled: 'bg-danger',
    PENDING: 'bg-warning text-dark',
    SUCCESS: 'bg-success',
    FAILED: 'bg-danger',
  }
  return <span className={`badge ${colors[status] || 'bg-secondary'}`}>{status}</span>
}

interface ConfirmDeleteProps {
  show: boolean
  onConfirm: () => void
  onCancel: () => void
  name?: string
}

export const ConfirmDelete = ({ show, onConfirm, onCancel, name }: ConfirmDeleteProps) => {
  if (!show) return null
  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-body text-center py-4">
            <div className="text-danger mb-3" style={{ fontSize: 40 }}>⚠️</div>
            <h6 className="fw-bold">Delete {name || 'this item'}?</h6>
            <p className="text-muted small mb-4">This action cannot be undone.</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary btn-sm" onClick={onCancel}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
