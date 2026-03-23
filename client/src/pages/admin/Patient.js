import React, { useEffect, useState } from 'react';
import {
  adminGetPatients,
  adminBlockUser,
  adminUnblockUser,
  adminDeleteUser,
} from '../../services/api';
import '../../css/Admin.css';

const COLORS = [
  { bg:'#E6F1FB', color:'#0C447C' },
  { bg:'#EEEDFE', color:'#3C3489' },
  { bg:'#E1F5EE', color:'#085041' },
  { bg:'#FAEEDA', color:'#633806' },
];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function Patient() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await adminGetPatients();
      setPatients(res.data);
    } catch (err) {
      alert('Access denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const blockUser = async (id) => {
    await adminBlockUser(id);
    fetchPatients();
  };

  const unblockUser = async (id) => {
    await adminUnblockUser(id);
    fetchPatients();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this patient? This cannot be undone.')) return;
    await adminDeleteUser(id);
    fetchPatients();
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-title">Patients</div>
      <div className="admin-page-sub">{patients.length} registered patients</div>

      <div className="admin-card">
        <div className="admin-search-row">
          <input
            className="admin-search"
            placeholder="Search by name or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="admin-empty">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No patients found</div>
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
                {filtered.map((user, i) => {
                  const c = COLORS[i % COLORS.length];
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="td-avatar">
                          <div className="td-avatar-circle" style={{background:c.bg, color:c.color}}>
                            {initials(user.name)}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td style={{color:'#666'}}>{user.username}</td>
                      <td style={{color:'#666'}}>{user.email}</td>
                      <td>
                        <span className={`admin-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div style={{display:'flex', gap:6}}>
                          {!user.isBlocked
                            ? <button className="btn-warn-sm" onClick={() => blockUser(user._id)}>Block</button>
                            : <button className="btn-info-sm" onClick={() => unblockUser(user._id)}>Unblock</button>
                          }
                          <button className="btn-danger-sm" onClick={() => deleteUser(user._id)}>Delete</button>
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

export default Patient;
