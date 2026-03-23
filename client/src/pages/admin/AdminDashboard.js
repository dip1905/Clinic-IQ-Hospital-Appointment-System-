import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  adminGetPatients,
  adminGetDoctors,
  adminGetAppointments,
  adminApproveDoctor,
} from '../../services/api';
import '../../css/Admin.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,   setStats]   = useState({ patients: 0, doctors: 0, appointments: 0, pending: 0 });
  const [recent,  setRecent]  = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const [pRes, dRes, aRes] = await Promise.all([
        adminGetPatients(),
        adminGetDoctors(),
        adminGetAppointments(),
      ]);
      setStats({
        patients:     pRes.data.length,
        doctors:      dRes.data.filter(d => d.isApproved).length,
        appointments: aRes.data.length,
        pending:      dRes.data.filter(d => !d.isApproved && !d.isBlocked).length,
      });
      setPending(dRes.data.filter(d => !d.isApproved && !d.isBlocked).slice(0, 4));
      setRecent(aRes.data.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await adminApproveDoctor(id);
    fetchAll();
  };

  const badgeClass = (status) => {
    if (status === 'booked')    return 'admin-badge booked';
    if (status === 'completed') return 'admin-badge completed';
    if (status === 'cancelled') return 'admin-badge cancelled';
    return 'admin-badge';
  };

  return (
    <div className="admin-page">
      <div className="admin-page-title">Admin Dashboard</div>
      <div className="admin-page-sub">System overview</div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-n" style={{color:'#1966b7'}}>{loading ? '—' : stats.patients}</div>
          <div className="admin-stat-l">Total patients</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-n" style={{color:'#27500A'}}>{loading ? '—' : stats.doctors}</div>
          <div className="admin-stat-l">Active doctors</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-n" style={{color:'#633806'}}>{loading ? '—' : stats.appointments}</div>
          <div className="admin-stat-l">Total appointments</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-n" style={{color:'#A32D2D'}}>{loading ? '—' : stats.pending}</div>
          <div className="admin-stat-l">Pending approvals</div>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Pending doctor approvals</div>
            {stats.pending > 0 && <span className="admin-badge pending">{stats.pending} pending</span>}
          </div>
          {pending.length === 0 ? (
            <div className="admin-empty">No pending approvals</div>
          ) : pending.map(d => (
            <div key={d._id} className="pending-row">
              <div>
                <div className="pending-name">{d.name}</div>
                <div className="pending-sub">{d.username}</div>
              </div>
              <div className="pending-actions">
                <span className="admin-badge pending">Pending</span>
                <button className="btn-approve" onClick={() => handleApprove(d._id)}>Approve</button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Recent appointments</div>
          </div>
          {recent.length === 0 ? (
            <div className="admin-empty">No appointments yet</div>
          ) : recent.map(a => (
            <div key={a._id} className="pending-row">
              <div>
                <div className="pending-name">{a.patient?.name || '—'} &rarr; {a.doctor?.name || '—'}</div>
                <div className="pending-sub">{new Date(a.date).toLocaleDateString()}</div>
              </div>
              <span className={badgeClass(a.status)}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-three-col">
        <div className="admin-nav-card" style={{borderTop:'3px solid #1966b7',borderRadius:'0 0 12px 12px'}}>
          <h3>Patients</h3>
          <p>View, block, or remove patient accounts from the system.</p>
          <Link to="/admin/users/patients" className="admin-nav-btn blue">Manage patients</Link>
        </div>
        <div className="admin-nav-card" style={{borderTop:'3px solid #0f6e56',borderRadius:'0 0 12px 12px'}}>
          <h3>Doctors</h3>
          <p>Approve registrations, manage block status, remove doctors.</p>
          <Link to="/admin/users/doctors" className="admin-nav-btn green">Manage doctors</Link>
        </div>
        <div className="admin-nav-card" style={{borderTop:'3px solid #3c3489',borderRadius:'0 0 12px 12px'}}>
          <h3>Appointments</h3>
          <p>View and delete all appointments across the platform.</p>
          <Link to="/admin/appointments" className="admin-nav-btn purple">View appointments</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
