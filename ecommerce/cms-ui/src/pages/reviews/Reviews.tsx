import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import http from '@/http'
import { DataTable, PageHeader, StatusBadge, ConfirmDelete, ReviewActions } from '@/components'

const Stars = ({ n }: { n: number }) => (
  <span className="text-warning">{Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('')}</span>
)

export const Reviews = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = () => { setLoading(true); http.get('/cms/reviews').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const toggleStatus = async (id: string, status: boolean) => {
    try { await http.put('/cms/reviews/' + id, { status: !status }); toast.success('Status updated!'); load() }
    catch { toast.error('Error') }
  }
  const handleDelete = async () => {
    try { await http.delete('/cms/reviews/' + deleteId); toast.success('Review deleted!'); setDeleteId(null); load() }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <>
      <PageHeader title={'Reviews (' + data.length + ')'} />
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <DataTable loading={loading} data={data} columns={[
            { label: 'Product', render: (row: any) => <span className="fw-semibold small">{row.productId?.name || '-'}</span> },
            { label: 'Customer', render: (row: any) => row.userId?.name || '-' },
            { label: 'Rating', render: (row: any) => <Stars n={row.rating} /> },
            { label: 'Comment', render: (row: any) => (
              <span className="small text-truncate d-inline-block" style={{ maxWidth: 200 }} title={row.comment}>{row.comment}</span>
            )},
            { label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
            { label: 'Date', render: (row: any) => dayjs(row.createdAt).format('MMM D, YYYY') },
            { label: 'Actions', render: (row: any) => (
              <ReviewActions isVisible={row.status} onToggle={() => toggleStatus(row._id, row.status)} onDelete={() => setDeleteId(row._id)} />
            )},
          ]} />
        </div>
      </div>
      <ConfirmDelete show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} name="review" />
    </>
  )
}
