import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import http from '@/http'
import { DataTable, PageHeader, FormField, StatusBadge, ConfirmDelete, EditDeleteActions } from '@/components'

export const Staffs = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = () => { setLoading(true); http.get('/cms/staffs').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', phone: '', address: '', role: 'Staff', status: true },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email().required('Required'),
      password: editing ? Yup.string() : Yup.string().min(6).required('Required'),
      phone: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload: any = { ...values }
        if (editing && !values.password) delete payload.password
        if (editing) { await http.put('/cms/staffs/' + editing._id, payload); toast.success('Staff updated!') }
        else { await http.post('/cms/staffs', payload); toast.success('Staff created!') }
        resetForm(); setShowForm(false); setEditing(null); load()
      } catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
      finally { setSubmitting(false) }
    },
  })

  const handleEdit = (row: any) => {
    setEditing(row)
    formik.setValues({ name: row.name, email: row.email, password: '', phone: row.phone, address: row.address, role: row.role, status: row.status })
    setShowForm(true)
  }
  const handleDelete = async () => {
    try { await http.delete('/cms/staffs/' + deleteId); toast.success('Staff deleted!'); setDeleteId(null); load() }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <>
      <PageHeader title="Staff Management" extra={
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); formik.resetForm(); setShowForm(true) }}>
          <i className="fas fa-plus me-1" />Add Staff
        </button>
      } />

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editing ? 'Edit Staff' : 'New Staff'}</h6>
            <form onSubmit={formik.handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4"><FormField formik={formik} name="name" label="Full Name" /></div>
                <div className="col-md-4"><FormField formik={formik} name="email" label="Email" type="email" /></div>
                <div className="col-md-4"><FormField formik={formik} name="password" label={editing ? 'New Password (leave blank to keep)' : 'Password'} type="password" /></div>
                <div className="col-md-4"><FormField formik={formik} name="phone" label="Phone" /></div>
                <div className="col-md-4"><FormField formik={formik} name="address" label="Address" /></div>
                <div className="col-md-2">
                  <FormField formik={formik} name="role" label="Role" as="select"
                    options={[{ value: 'Staff', label: 'Staff' }, { value: 'Admin', label: 'Admin' }]} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Status</label>
                  <select className="form-select" value={String(formik.values.status)} onChange={e => formik.setFieldValue('status', e.target.value === 'true')}>
                    <option value="true">Active</option><option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setShowForm(false); setEditing(null); formik.resetForm() }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <DataTable loading={loading} data={data} columns={[
            { label: 'Name', render: (row: any) => <span className="fw-semibold">{row.name}</span> },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'Role', render: (row: any) => <span className={'badge ' + (row.role === 'Admin' ? 'bg-primary' : 'bg-secondary')}>{row.role}</span> },
            { label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
            { label: 'Actions', render: (row: any) => (
              <EditDeleteActions onEdit={() => handleEdit(row)} onDelete={() => setDeleteId(row._id)} />
            )},
          ]} />
        </div>
      </div>
      <ConfirmDelete show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} name="staff member" />
    </>
  )
}
