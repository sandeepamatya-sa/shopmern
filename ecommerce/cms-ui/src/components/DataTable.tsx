interface Column {
  label: string
  key?: string
  render?: (row: any, index?: number) => React.ReactNode
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
}

export const DataTable = ({ columns, data, loading }: Props) => {
  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" />
    </div>
  )

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col, i) => <th key={i}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center text-muted py-4">No data found</td></tr>
          ) : data.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col, ci) => (
                <td key={ci}>
                  {col.render ? col.render(row, ri) : col.key ? row[col.key] : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
