import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import http from '@/http'
import { DataTable, PageHeader, StatusBadge } from '@/components'

const BASE = 'http://localhost:5000/'
const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled']

export const Orders = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  const load = () => {
    setLoading(true)
    http.get('/cms/orders').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await http.put(`/cms/orders/${id}/status`, { status })
      toast.success('Order status updated!')
      load()
      if (selected?._id === id) setSelected((prev: any) => ({ ...prev, status }))
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <>
      <PageHeader title="Orders" />

      <div className="row g-4">
        <div className={selected ? 'col-md-7' : 'col-12'}>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <DataTable
                loading={loading}
                data={data}
                columns={[
                  { label: 'Order ID', render: (row: any) => <code className="small">{row._id.slice(-8)}</code> },
                  { label: 'Customer', render: (row: any) => row.userId?.name || '-' },
                  { label: 'Items', render: (row: any) => row.cart?.length || 0 },
                  { label: 'Total', render: (row: any) => `Rs. ${row.totalAmount?.toLocaleString()}` },
                  { label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
                  { label: 'Date', render: (row: any) => dayjs(row.createdAt).format('MMM D, YYYY') },
                  {
                    label: 'Actions', render: (row: any) => (
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setSelected(row)}>
                          <i className="fas fa-eye" />
                        </button>
                        <select className="form-select form-select-sm" style={{ width: 130 }}
                          value={row.status}
                          onChange={e => updateStatus(row._id, e.target.value)}>
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Order Detail Panel */}
        {selected && (
          <div className="col-md-5">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Order Details</h6>
                <button className="btn-close btn-sm" onClick={() => setSelected(null)} />
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <p className="mb-1"><strong>Order ID:</strong> <code>{selected._id}</code></p>
                  <p className="mb-1"><strong>Customer:</strong> {selected.userId?.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {selected.userId?.email}</p>
                  <p className="mb-1"><strong>Date:</strong> {dayjs(selected.createdAt).format('MMM D, YYYY h:mm A')}</p>
                  <p className="mb-1"><strong>Status:</strong> <StatusBadge status={selected.status} /></p>
                </div>
                <hr />
                <h6 className="fw-semibold mb-3">Items</h6>
                {selected.cart?.map((item: any, i: number) => (
                  <div key={i} className="d-flex gap-3 align-items-center mb-2">
                    {item.productId?.images?.[0] && (
                      <img src={BASE + item.productId.images[0]} className="rounded" style={{ width: 50, height: 50, objectFit: 'cover' }} alt="" />
                    )}
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{item.productId?.name || 'Product'}</div>
                      <div className="text-muted small">Qty: {item.qty} × Rs. {item.productId?.price?.toLocaleString()}</div>
                    </div>
                    <span className="fw-bold small">Rs. {((item.productId?.price || 0) * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>Rs. {selected.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
