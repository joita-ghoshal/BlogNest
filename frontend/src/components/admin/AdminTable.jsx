const AdminTable = ({ columns, data, onRowAction }) => {
  if (!data?.length) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row._id || i}
              className="transition-colors hover:bg-[var(--bg-secondary)]"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 sm:px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
