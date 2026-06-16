import { Link } from 'react-router-dom'

// ── Icon-only action button ───────────────────────────────────────────────────
interface ActionBtnProps {
  icon: string
  title: string
  variant: 'edit' | 'delete' | 'view' | 'activate' | 'deactivate' | 'approve' | 'hide'
  onClick?: () => void
  to?: string
}

const variantMap: Record<ActionBtnProps['variant'], { color: string; bg: string; hoverBg: string }> = {
  edit:       { color: '#4f46e5', bg: '#ede9fe', hoverBg: '#4f46e5' },
  delete:     { color: '#dc2626', bg: '#fee2e2', hoverBg: '#dc2626' },
  view:       { color: '#0284c7', bg: '#e0f2fe', hoverBg: '#0284c7' },
  activate:   { color: '#16a34a', bg: '#dcfce7', hoverBg: '#16a34a' },
  deactivate: { color: '#d97706', bg: '#fef3c7', hoverBg: '#d97706' },
  approve:    { color: '#16a34a', bg: '#dcfce7', hoverBg: '#16a34a' },
  hide:       { color: '#6b7280', bg: '#f3f4f6', hoverBg: '#6b7280' },
}

export const ActionBtn = ({ icon, title, variant, onClick, to }: ActionBtnProps) => {
  const { color, bg, hoverBg } = variantMap[variant]

  const style: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 8, border: 'none',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: bg, color, cursor: 'pointer', transition: 'all 0.15s',
    flexShrink: 0,
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement
    el.style.background = hoverBg
    el.style.color = 'white'
    el.style.transform = 'scale(1.1)'
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement
    el.style.background = bg
    el.style.color = color
    el.style.transform = 'scale(1)'
  }

  if (to) {
    return (
      <Link to={to} title={title} style={{ ...style, textDecoration: 'none' }}
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <i className={'fas ' + icon} style={{ fontSize: 13 }} />
      </Link>
    )
  }

  return (
    <button title={title} style={style} onClick={onClick}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <i className={'fas ' + icon} style={{ fontSize: 13 }} />
    </button>
  )
}

// ── Pre-composed groups ───────────────────────────────────────────────────────
interface EditDeleteProps {
  onEdit?: () => void
  onDelete?: () => void
  editTo?: string
}

export const EditDeleteActions = ({ onEdit, onDelete, editTo }: EditDeleteProps) => (
  <div className="d-flex gap-1 align-items-center">
    <ActionBtn icon="fa-pencil" title="Edit" variant="edit" onClick={onEdit} to={editTo} />
    <ActionBtn icon="fa-trash-alt" title="Delete" variant="delete" onClick={onDelete} />
  </div>
)

interface ToggleDeleteProps {
  isActive: boolean
  onToggle: () => void
  onDelete: () => void
}

export const ToggleDeleteActions = ({ isActive, onToggle, onDelete }: ToggleDeleteProps) => (
  <div className="d-flex gap-1 align-items-center">
    <ActionBtn
      icon={isActive ? 'fa-ban' : 'fa-check-circle'}
      title={isActive ? 'Deactivate' : 'Activate'}
      variant={isActive ? 'deactivate' : 'activate'}
      onClick={onToggle}
    />
    <ActionBtn icon="fa-trash-alt" title="Delete" variant="delete" onClick={onDelete} />
  </div>
)

interface ReviewActionsProps {
  isVisible: boolean
  onToggle: () => void
  onDelete: () => void
}

export const ReviewActions = ({ isVisible, onToggle, onDelete }: ReviewActionsProps) => (
  <div className="d-flex gap-1 align-items-center">
    <ActionBtn
      icon={isVisible ? 'fa-eye-slash' : 'fa-eye'}
      title={isVisible ? 'Hide review' : 'Show review'}
      variant={isVisible ? 'hide' : 'approve'}
      onClick={onToggle}
    />
    <ActionBtn icon="fa-trash-alt" title="Delete" variant="delete" onClick={onDelete} />
  </div>
)
