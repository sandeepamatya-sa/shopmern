import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import http from '@/http'
import { DataTable, PageHeader, StatusBadge, ConfirmDelete, ToggleDeleteActions } from '@/components'
import dayjs from 'dayjs'

export const Customers = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = () => { setLoading(true); http.get('/cms/customers').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const toggleStatus = async (id: string, status: boolean) => {
    try { await http.put('/cms/customers/' + id, { status: !status }); toast.success('Status updated!'); load() }
    catch { toast.error('Error updating status') }
  }
  const handleDelete = async () => {
    try { await http.delete('/cms/customers/' + deleteId); toast.success('Customer deleted!'); setDeleteId(null); load() }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  const filtered = data.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <PageHeader title={'Customers (' + data.length + ')'} />
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-2">
          <input className="form-control" placeholder="🔍  Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <DataTable loading={loading} data={filtered} columns={[
            { label: '#', render: (_: any, i: number) => i + 1 },
            { label: 'Name', render: (row: any) => <span className="fw-semibold">{row.name}</span> },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
            { label: 'Joined', render: (row: any) => dayjs(row.createdAt).format('MMM D, YYYY') },
            { label: 'Actions', render: (row: any) => (
              <ToggleDeleteActions isActive={row.status} onToggle={() => toggleStatus(row._id, row.status)} onDelete={() => setDeleteId(row._id)} />
            )},
          ]} />
        </div>
      </div>
      <ConfirmDelete show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} name="customer" />
    </>
  )
}
