import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import http from '@/http'

export const Register = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', phone: '', address: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(2).required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'At least 6 characters').required('Required'),
      phone: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await http.post('/auth/register', values)
        toast.success('Registration successful! Please login.')
        navigate('/auth/login')
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Registration failed')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const field = (name: keyof typeof formik.values, label: string, type = 'text', placeholder = '') => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        className={`form-control ${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback">{formik.errors[name]}</div>
      )}
    </div>
  )

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card border-0 shadow-sm p-4 mt-4">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Create Account 🎉</h3>
            <p className="text-muted">Join ShopMERN today</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {field('name', 'Full Name', 'text', 'John Doe')}
            {field('email', 'Email', 'email', 'you@example.com')}
            {field('password', 'Password', 'password', '••••••••')}
            {field('phone', 'Phone', 'tel', '+977-98XXXXXXXX')}
            {field('address', 'Address', 'text', 'Kathmandu, Nepal')}

            <button type="submit" className="btn btn-primary w-100 py-2 mt-2" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 text-muted">
            Already have an account? <Link to="/auth/login" className="text-primary fw-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
