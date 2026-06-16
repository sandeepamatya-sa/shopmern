import { FormikProps } from 'formik'

interface FieldProps {
  formik: FormikProps<any>
  name: string
  label: string
  type?: string
  as?: 'input' | 'textarea' | 'select'
  options?: { value: string; label: string }[]
  placeholder?: string
  accept?: string
  multiple?: boolean
  onChange?: (e: React.ChangeEvent<any>) => void
}

export const FormField = ({
  formik, name, label, type = 'text',
  as = 'input', options, placeholder, accept, multiple, onChange
}: FieldProps) => {
  const error = formik.touched[name] && formik.errors[name]
  const cls = `form-control ${error ? 'is-invalid' : ''}`
  const props = {
    id: name, name,
    className: cls,
    placeholder,
    onBlur: formik.handleBlur,
    onChange: onChange || formik.handleChange,
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">{label}</label>
      {as === 'select' ? (
        <select {...props} value={formik.values[name]}>
          <option value="">-- Select --</option>
          {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : as === 'textarea' ? (
        <textarea {...props} rows={4} value={formik.values[name]} />
      ) : type === 'file' ? (
        <input {...props} type="file" accept={accept} multiple={multiple} value={undefined} />
      ) : (
        <input {...props} type={type} value={formik.values[name]} />
      )}
      {error && <div className="invalid-feedback">{String(formik.errors[name])}</div>}
    </div>
  )
}
