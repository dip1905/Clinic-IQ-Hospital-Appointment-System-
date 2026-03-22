import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/Admin.css';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('all');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/appointments', { withCredentials: true });
      setAppointments(res.data);
    } catch { alert('Access denied'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    await axios.delete(`http://localhost:5000/api/admin/appointments/${id}`, { withCredentials: true });
    fetchAppointments();
  };

  const counts = {
    all:       appointments.length,
    booked:    appointments.filter(a => a.status === 'booked').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const filtered = appointments
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => {
      const q = search.toLowerCase();
      return (
        (a.patient?.name || '').toLowerCase().includes(q) ||
        (a.doctor?.name  || '').toLowerCase().includes(q)
      );
    });

  const badgeClass = (status) => `admin-badge ${status}`;

  return (
    <div className="admin-page">
      <div className="admin-page-title">Appointments</div>
      <div className="admin-page-sub">
        {counts.booked} booked · {counts.completed} completed · {counts.cancelled} cancelled
      </div>

      <div className="admin-card">
        <div className="admin-search-row">
          <div className="admin-filter-tabs">
            {['all','booked','completed','cancelled'].map(f => (
              <button
                key={f}
                className={`admin-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>
          <input
            className="admin-search"
            placeholder="Search patient or doctor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="admin-empty">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No appointments found</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date &amp; time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id}>
                    <td>{a.patient?.name || '—'}</td>
                    <td>{a.doctor?.name  || '—'}</td>
                    <td style={{color:'#666',whiteSpace:'nowrap'}}>
                      {new Date(a.date).toLocaleString()}
                    </td>
                    <td>
                      <span className={badgeClass(a.status)}>{a.status}</span>
                    </td>
                    <td>
                      <button className="btn-danger-sm" onClick={() => handleDelete(a._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAppointments;
