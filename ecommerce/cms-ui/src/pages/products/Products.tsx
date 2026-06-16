import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import http from '@/http'
import { DataTable, PageHeader, FormField, StatusBadge, ConfirmDelete, ActionBtn } from '@/components'

const BASE = 'http://localhost:5000/'

export const Products = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = () => { setLoading(true); http.get('/cms/products').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    try { await http.delete('/cms/products/' + deleteId); toast.success('Product deleted!'); setDeleteId(null); load() }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <>
      <PageHeader title="Products" createLink="/products/create" />
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <DataTable loading={loading} data={data} columns={[
            { label: 'Image', render: (row: any) => (
              <img src={row.images?.[0] ? BASE + row.images[0] : 'https://placehold.co/40?text=?'} className="rounded"
                style={{ width: 40, height: 40, objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40?text=?' }} alt="" />
            )},
            { label: 'Name', render: (row: any) => <span className="fw-semibold">{row.name}</span> },
            { label: 'Category', render: (row: any) => row.categoryId?.name || '-' },
            { label: 'Brand', render: (row: any) => row.brandId?.name || '-' },
            { label: 'Price', render: (row: any) => 'Rs. ' + row.price?.toLocaleString() },
            { label: 'Discount', render: (row: any) => row.discountedPrice > 0 ? 'Rs. ' + row.discountedPrice?.toLocaleString() : <span className="text-muted">—</span> },
            { label: 'Featured', render: (row: any) => <span className={'badge ' + (row.featured ? 'bg-warning text-dark' : 'bg-light text-muted')}>{row.featured ? '★ Yes' : 'No'}</span> },
            { label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
            { label: 'Actions', render: (row: any) => (
              <div className="d-flex gap-1 align-items-center">
                <ActionBtn icon="fa-pencil" title="Edit product" variant="edit" to={'/products/edit/' + row._id} />
                <ActionBtn icon="fa-trash-alt" title="Delete product" variant="delete" onClick={() => setDeleteId(row._id)} />
              </div>
            )},
          ]} />
        </div>
      </div>
      <ConfirmDelete show={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} name="product" />
    </>
  )
}

export const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  useEffect(() => {
    Promise.all([http.get('/cms/categories'), http.get('/cms/brands')])
      .then(([c, b]) => { setCategories(c.data); setBrands(b.data) })
      .catch(console.error)

    if (id) {
      http.get('/cms/products/' + id).then(r => {
        const p = r.data
        formik.setValues({
          name: p.name, description: p.description, shortDescription: p.shortDescription,
          price: p.price, discountedPrice: p.discountedPrice || 0,
          categoryId: p.categoryId?._id || p.categoryId,
          brandId: p.brandId?._id || p.brandId,
          featured: p.featured, status: p.status,
        })
        setExistingImages(p.images || [])
      }).catch(() => toast.error('Failed to load product'))
    }
  }, [id])

  const formik = useFormik({
    initialValues: { name: '', description: '', shortDescription: '', price: 0, discountedPrice: 0, categoryId: '', brandId: '', featured: false, status: true },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      shortDescription: Yup.string().required('Required'),
      price: Yup.number().min(1, 'Must be > 0').required('Required'),
      categoryId: Yup.string().required('Required'),
      brandId: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const fd = new FormData()
        Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)))
        const fileInput = document.getElementById('images') as HTMLInputElement
        if (fileInput?.files) Array.from(fileInput.files).forEach(f => fd.append('images', f))
        if (id) { await http.put('/cms/products/' + id, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Product updated!') }
        else { await http.post('/cms/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Product created!') }
        navigate('/products')
      } catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
      finally { setSubmitting(false) }
    },
  })

  return (
    <>
      <PageHeader title={id ? 'Edit Product' : 'Create Product'} />
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6"><FormField formik={formik} name="name" label="Product Name" placeholder="e.g. iPhone 15 Pro" /></div>
              <div className="col-md-3"><FormField formik={formik} name="categoryId" label="Category" as="select" options={categories.map(c => ({ value: c._id, label: c.name }))} /></div>
              <div className="col-md-3"><FormField formik={formik} name="brandId" label="Brand" as="select" options={brands.map(b => ({ value: b._id, label: b.name }))} /></div>
              <div className="col-12"><FormField formik={formik} name="shortDescription" label="Short Description" placeholder="One-line summary" /></div>
              <div className="col-12"><FormField formik={formik} name="description" label="Full Description" as="textarea" placeholder="Detailed product description..." /></div>
              <div className="col-md-3"><FormField formik={formik} name="price" label="Price (Rs.)" type="number" /></div>
              <div className="col-md-3"><FormField formik={formik} name="discountedPrice" label="Discounted Price (Rs.)" type="number" /></div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Featured</label>
                <select className="form-select" value={String(formik.values.featured)} onChange={e => formik.setFieldValue('featured', e.target.value === 'true')}>
                  <option value="false">No</option><option value="true">Yes</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Status</label>
                <select className="form-select" value={String(formik.values.status)} onChange={e => formik.setFieldValue('status', e.target.value === 'true')}>
                  <option value="true">Active</option><option value="false">Inactive</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Product Images</label>
                <input type="file" id="images" className="form-control" accept="image/*" multiple />
                {existingImages.length > 0 && (
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {existingImages.map((img, i) => (
                      <img key={i} src={BASE + img} className="rounded border" style={{ width: 70, height: 70, objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} alt="" />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {id ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/products')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
