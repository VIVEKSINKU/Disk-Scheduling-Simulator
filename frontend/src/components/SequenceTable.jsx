export default function SequenceTable({ sequence }) {
  return (
    <div className="table-card glass-card animate-in">
      <h2>
        <span className="dot" />
        Request Sequence
      </h2>
      <div className="sequence-table-wrapper">
        <table className="sequence-table" id="sequence-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Cylinder</th>
              <th>Seek Distance</th>
            </tr>
          </thead>
          <tbody>
            {sequence.map((cyl, i) => {
              const seek = i === 0 ? '—' : Math.abs(cyl - sequence[i - 1]);
              return (
                <tr key={i}>
                  <td>
                    <span className="step-badge">{i}</span>
                  </td>
                  <td>{cyl}</td>
                  <td>{seek}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
