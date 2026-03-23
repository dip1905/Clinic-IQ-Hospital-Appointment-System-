import React, { useEffect, useState } from 'react';
import {
  adminGetDoctors,
  adminApproveDoctor,
  adminBlockUser,
  adminUnblockUser,
  adminDeleteUser,
} from '../../services/api';
import '../../css/Admin.css';

const COLORS = [
  { bg:'#E1F5EE', color:'#085041' },
  { bg:'#EEEDFE', color:'#3C3489' },
  { bg:'#FAEEDA', color:'#633806' },
  { bg:'#E6F1FB', color:'#0C447C' },
];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await adminGetDoctors();
      setDoctors(res.data);
    } catch (err) {
      alert('Access denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const approveDoctor = async (id) => {
    await adminApproveDoctor(id);
    fetchDoctors();
  };

  const blockUser = async (id) => {
    await adminBlockUser(id);
    fetchDoctors();
  };

  const unblockUser = async (id) => {
    await adminUnblockUser(id);
    fetchDoctors();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    await adminDeleteUser(id);
    fetchDoctors();
  };

  const getStatus = (d) => {
    if (d.isBlocked)   return 'blocked';
    if (!d.isApproved) return 'pending';
    return 'active';
  };

  const counts = {
    all:     doctors.length,
    active:  doctors.filter(d => !d.isBlocked && d.isApproved).length,
    pending: doctors.filter(d => !d.isApproved && !d.isBlocked).length,
    blocked: doctors.filter(d => d.isBlocked).length,
  };

  const filtered = doctors
    .filter(d => filter === 'all' || getStatus(d) === filter)
    .filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.username.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="admin-page">
      <div className="admin-page-title">Doctors</div>
      <div className="admin-page-sub">
        {counts.active} active · {counts.pending} pending · {counts.blocked} blocked
      </div>

      <div className="admin-card">
        <div className="admin-search-row">
          <div className="admin-filter-tabs">
            {['all','active','pending','blocked'].map(f => (
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
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="admin-empty">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No doctors found</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, i) => {
                  const c = COLORS[i % COLORS.length];
                  const status = getStatus(doc);
                  return (
                    <tr key={doc._id}>
                      <td>
                        <div className="td-avatar">
                          <div className="td-avatar-circle" style={{background:c.bg, color:c.color}}>
                            {initials(doc.name)}
                          </div>
                          {doc.name}
                        </div>
                      </td>
                      <td style={{color:'#666'}}>{doc.username}</td>
                      <td style={{color:'#666'}}>{doc.email}</td>
                      <td>
                        <span className={`admin-badge ${status}`}>
                          {status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Blocked'}
                        </span>
                      </td>
                      <td>
                        <div style={{display:'flex', gap:6}}>
                          {!doc.isApproved && !doc.isBlocked && (
                            <button className="btn-approve" onClick={() => approveDoctor(doc._id)}>Approve</button>
                          )}
                          {!doc.isBlocked
                            ? <button className="btn-warn-sm" onClick={() => blockUser(doc._id)}>Block</button>
                            : <button className="btn-info-sm" onClick={() => unblockUser(doc._id)}>Unblock</button>
                          }
                          <button className="btn-danger-sm" onClick={() => deleteUser(doc._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctor;
