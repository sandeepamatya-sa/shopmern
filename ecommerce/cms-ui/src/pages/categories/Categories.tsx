import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import http from '@/http'
import { DataTable, PageHeader, FormField, StatusBadge, ConfirmDelete, EditDeleteActions } from '@/components'

export const Categories = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    http.get('/cms/categories').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const formik = useFormik({
    initialValues: { name: '', status: true },
    enableReinitialize: true,
    validationSchema: Yup.object({ name: Yup.string().required('Required') }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (editing) { await http.put('/cms/categories/' + editing._id, values); toast.success('Category updated!') }
        else { await http.post('/cms/categories', values); toast.success('Category created!') }
        resetForm(); setShowForm(false); setEditing(null); load()
      } catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
      finally { setSubmitting(false) }
    },
  })

  const handleEdit = (row: any) => {
    setEditing(row); formik.setValues({ name: row.name, status: row.status }); setShowForm(true)
  }
  const handleDelete = async () => {
    try { await http.delete('/cms/categories/' + deleteId); toast.success('Deleted!'); setDeleteId(null); load() }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <>
      <PageHeader title="Categories" extra={
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); formik.resetForm(); setShowForm(true) }}>
          <i className="fas fa-plus me-1" />Add New
        </button>
      } />

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editing ? 'Edit Category' : 'New Category'}</h6>
            <form onSubmit={formik.handleSubmit} className="row g-3 align-items-end">
              <div className="col-md-4"><FormField formik={formik} name="name" label="Category Name" placeholder="e.g. Electronics" /></div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Status</label>
                <select className="form-select" value={String(formik.values.status)} onChange={e => formik.setFieldValue('status', e.target.value === 'true')}>
                  <option value="true">Active</option><option value="false">Inactive</option>
                </select>
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? <span className="spinner-border spinner-border-sm" /> : editing ? 'Update' : 'Create'}
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
            { label: '#', render: (_: any, i: number) => i + 1 },
            { label: 'Name', key: 'name' },
            { label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
            { label: 'Created', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
            { label: 'Actions', render: (row: any) => (
              <EditDeleteActions onEdit={() => handleEdit(row)} onDelete={() => setDeleteId(row._id)} />
            )},
          ]} />
        </div>
      </div>
      <ConfirmDelete show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} name="category" />
    </>
  )
}
