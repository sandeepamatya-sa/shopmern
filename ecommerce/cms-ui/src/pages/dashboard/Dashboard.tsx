import { useEffect, useState } from 'react'
import http from '@/http'

interface Stats {
  products: number
  orders: number
  customers: number
  revenue: number
}

const StatCard = ({ icon, label, value, bg }: { icon: string; label: string; value: string | number; bg: string }) => (
  <div className="col-md-3 col-sm-6">
    <div className="card stat-card border-0 shadow-sm">
      <div className="card-body d-flex align-items-center gap-3 p-4">
        <div className="icon" style={{ background: bg + '20', color: bg }}>
          <i className={`fas ${icon}`} />
        </div>
        <div>
          <div className="fw-bold fs-4">{value}</div>
          <div className="text-muted small">{label}</div>
        </div>
      </div>
    </div>
  </div>
)

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, customers: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      http.get('/cms/products'),
      http.get('/cms/orders'),
      http.get('/cms/customers'),
    ])
      .then(([p, o, c]) => {
        const orders = o.data || []
        const revenue = orders.reduce((sum: number, ord: any) => sum + (ord.totalAmount || 0), 0)
        setStats({ products: p.data.length, orders: orders.length, customers: c.data.length, revenue })
        setRecentOrders(orders.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const orderStatusColor: Record<string, string> = {
    Processing: 'warning', Confirmed: 'info', Shipping: 'primary', Delivered: 'success', Cancelled: 'danger'
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>

  return (
    <>
      <h4 className="fw-bold mb-4">Dashboard</h4>

      <div className="row g-3 mb-4">
        <StatCard icon="fa-box" label="Total Products" value={stats.products} bg="#4f46e5" />
        <StatCard icon="fa-receipt" label="Total Orders" value={stats.orders} bg="#0ea5e9" />
        <StatCard icon="fa-users" label="Customers" value={stats.customers} bg="#10b981" />
        <StatCard icon="fa-money-bill-wave" label="Revenue (Rs.)" value={stats.revenue.toLocaleString()} bg="#f59e0b" />
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="fw-bold mb-0">Recent Orders</h6>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-4">No orders yet</td></tr>
              ) : recentOrders.map(o => (
                <tr key={o._id}>
                  <td><code className="small">{o._id.slice(-8)}</code></td>
                  <td>{o.userId?.name || '-'}</td>
                  <td>Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td><span className={`badge bg-${orderStatusColor[o.status] || 'secondary'}`}>{o.status}</span></td>
                  <td className="text-muted small">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
