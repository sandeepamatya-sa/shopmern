import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import http from '@/http'
import { RootState } from '@/store'
import { setUser } from '@/store/user.slice'
import dayjs from 'dayjs'
import { OrderData } from '@/library/interfaces'

const BASE = 'http://localhost:5000/'

// ── Change Name ────────────────────────────────────────────────────────────────
export const EditName = () => {
  const dispatch = useDispatch()
  const { user, token } = useSelector((s: RootState) => s.user)

  const formik = useFormik({
    initialValues: { name: user?.name || '', phone: '', address: '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'At least 2 characters').required('Required'),
      phone: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await http.put('/profile', values)
        dispatch(setUser({ token: token!, user: { ...user!, name: res.data.name } }))
        toast.success('Profile updated successfully!')
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Update failed')
      } finally { setSubmitting(false) }
    },
  })

  useEffect(() => {
    http.get('/profile').then(r => {
      formik.setValues({ name: r.data.name, phone: r.data.phone, address: r.data.address })
    }).catch(() => {})
  }, [])

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm p-4">
          <div className="mb-4">
            <Link to="/" className="text-muted small"><i className="fas fa-arrow-left me-1" />Back to Home</Link>
            <h5 className="fw-bold mt-2 mb-0"><i className="fas fa-user-edit me-2 text-primary" />Change Name & Info</h5>
          </div>
          <form onSubmit={formik.handleSubmit}>
            {(['name', 'phone', 'address'] as const).map(f => (
              <div className="mb-3" key={f}>
                <label className="form-label fw-semibold text-capitalize">{f}</label>
                <input
                  className={'form-control' + (formik.touched[f] && formik.errors[f] ? ' is-invalid' : '')}
                  {...formik.getFieldProps(f)}
                />
                {formik.touched[f] && formik.errors[f] && <div className="invalid-feedback">{formik.errors[f]}</div>}
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Change Password ────────────────────────────────────────────────────────────
export const ChangePassword = () => {
  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Required'),
      newPassword: Yup.string().min(6, 'At least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await http.put('/profile/change-password', {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
        toast.success('Password changed successfully!')
        resetForm()
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to change password')
      } finally { setSubmitting(false) }
    },
  })

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm p-4">
          <div className="mb-4">
            <Link to="/" className="text-muted small"><i className="fas fa-arrow-left me-1" />Back to Home</Link>
            <h5 className="fw-bold mt-2 mb-0"><i className="fas fa-lock me-2 text-warning" />Change Password</h5>
          </div>
          <form onSubmit={formik.handleSubmit}>
            {[
              { name: 'oldPassword', label: 'Current Password' },
              { name: 'newPassword', label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm New Password' },
            ].map(({ name, label }) => (
              <div className="mb-3" key={name}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type="password"
                  className={'form-control' + (formik.touched[name as keyof typeof formik.values] && formik.errors[name as keyof typeof formik.errors] ? ' is-invalid' : '')}
                  {...formik.getFieldProps(name)}
                />
                {formik.touched[name as keyof typeof formik.values] && formik.errors[name as keyof typeof formik.errors] && (
                  <div className="invalid-feedback">{formik.errors[name as keyof typeof formik.errors]}</div>
                )}
              </div>
            ))}
            <button type="submit" className="btn btn-warning" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Profile (redirect to edit-name) ──────────────────────────────────────────
export const Profile = () => <EditName />

// ── Order History ─────────────────────────────────────────────────────────────
export const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    http.get('/profile/orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    Processing: 'warning text-dark', Confirmed: 'info', Shipping: 'primary',
    Delivered: 'success', Cancelled: 'danger',
  }

  if (loading) return <div className="text-center py-4"><div className="spinner-border text-primary" /></div>

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm"><i className="fas fa-arrow-left" /></Link>
        <h4 className="section-title mb-0">My Orders</h4>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-3x text-muted mb-3" />
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.map(o => (
          <div key={o._id} className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="text-muted small">Order ID</span>
                  <p className="mb-0 fw-semibold font-monospace small">{o._id}</p>
                </div>
                <div className="text-end">
                  <span className={'badge bg-' + (statusColor[o.status] || 'secondary')}>{o.status}</span>
                  <p className="text-muted small mb-0 mt-1">{dayjs(o.createdAt).format('MMM D, YYYY')}</p>
                </div>
              </div>
              <div className="d-flex gap-3 flex-wrap mb-2">
                {o.cart?.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-2">
                    {item.productId?.images?.[0] && (
                      <img src={BASE + item.productId.images[0]} className="rounded"
                        style={{ width: 40, height: 40, objectFit: 'cover' }} alt=""
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                    <span className="small">{item.productId?.name} × {item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="fw-bold">Total: Rs. {o.totalAmount?.toLocaleString()}</div>
            </div>
          </div>
        ))
      )}
    </>
  )
}
