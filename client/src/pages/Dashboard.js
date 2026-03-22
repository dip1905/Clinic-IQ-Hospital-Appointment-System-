import React, { useEffect, useState, useCallback } from 'react';
import {
  getAppointmentsForDoctor,
  getAppointmentsForPatient,
  bookAppointment,
  cancelAppointment,
  getDoctors,
  markCompleted,
} from '../services/api';
import '../css/Dashboard.css';

const AVATARS = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#FAECE7', color: '#712B13' },
];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ name, index = 0, large = false }) {
  const style = AVATARS[index % AVATARS.length];
  return (
    <div
      className={large ? 'doctor-avatar-lg' : 'appt-avatar'}
      style={{ background: style.bg, color: style.color }}
    >
      {initials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{status}</span>;
}

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [doctor,       setDoctor]       = useState('');
  const [date,         setDate]         = useState('');
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [feedback,     setFeedback]     = useState(null);
  const [filter,       setFilter]       = useState('all');

  const name     = localStorage.getItem('name');
  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('role');

  const fetchDoctorAppointments = useCallback(async (uname) => {
    try {
      setLoading(true);
      const res = await getAppointmentsForDoctor(uname);
      setAppointments(res.data);
    } catch {
      setFeedback({ type: 'danger', msg: 'Failed to fetch appointments.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatientAppointments = useCallback(async (uname) => {
    try {
      setLoading(true);
      const res = await getAppointmentsForPatient(uname);
      setAppointments(res.data);
    } catch {
      setFeedback({ type: 'danger', msg: 'Failed to fetch your appointments.' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDoctorsList = useCallback(async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data);
    } catch {
      setFeedback({ type: 'danger', msg: 'Failed to fetch doctors list.' });
    }
  }, []);

  useEffect(() => {
    if (role === 'doctor') fetchDoctorAppointments(username);
    else if (role === 'patient') {
      fetchPatientAppointments(username);
      fetchDoctorsList();
    }
  }, [username, role, fetchDoctorAppointments, fetchPatientAppointments, fetchDoctorsList]);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await bookAppointment({ patient: username, doctor, date });
      setFeedback({ type: 'success', msg: 'Appointment booked successfully!' });
      fetchPatientAppointments(username);
      setDoctor('');
      setDate('');
    } catch (err) {
      setFeedback({ type: 'danger', msg: err.response?.data?.message || 'Booking failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    setFeedback(null);
    try {
      await cancelAppointment(id);
      setFeedback({ type: 'success', msg: 'Appointment cancelled.' });
      if (role === 'doctor') fetchDoctorAppointments(username);
      else fetchPatientAppointments(username);
    } catch (err) {
      setFeedback({ type: 'danger', msg: err.response?.data?.message || 'Cancellation failed.' });
    }
  };

  const handleComplete = async (id) => {
    setFeedback(null);
    try {
      await markCompleted(id);
      setFeedback({ type: 'success', msg: 'Marked as completed.' });
      fetchDoctorAppointments(username);
    } catch {
      setFeedback({ type: 'danger', msg: 'Failed to mark as completed.' });
    }
  };

  const counts = {
    total:     appointments.length,
    booked:    appointments.filter(a => a.status === 'booked').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const SkeletonRows = () => (
    <div className="skeleton-card">
      {[1,2,3].map(i => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0', borderBottom:'0.5px solid rgba(0,0,0,0.06)' }}>
          <div className="skeleton-line" style={{ width:34, height:34, borderRadius:'50%', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div className="skeleton-line" style={{ width:'50%', height:13 }} />
            <div className="skeleton-line" style={{ width:'30%', height:11, marginBottom:0 }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (role === 'doctor') {
    return (
      <div className="dashboard-page">
        <div className="doctor-layout">
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="doctor-profile-card">
              <Avatar name={name} large />
              <div className="doctor-profile-name">{name}</div>
              <div className="doctor-profile-spec">Doctor</div>
              <hr className="doctor-profile-divider" />
              <div className="doctor-profile-row"><span>Upcoming</span><span style={{color:'#0C447C'}}>{counts.booked}</span></div>
              <div className="doctor-profile-row"><span>Completed</span><span style={{color:'#27500A'}}>{counts.completed}</span></div>
              <div className="doctor-profile-row"><span>Cancelled</span><span style={{color:'#444441'}}>{counts.cancelled}</span></div>
            </div>
          </div>

          <div>
            {feedback && (
              <div className={`dashboard-alert ${feedback.type}`}>
                {feedback.msg}
                <button className="dashboard-alert-close" onClick={() => setFeedback(null)}>×</button>
              </div>
            )}

            <div className="appts-card">
              <div className="appts-header">
                <div className="appts-title">Patient appointments</div>
                <div className="filter-tabs">
                  {['all','booked','completed','cancelled'].map(f => (
                    <button
                      key={f}
                      className={`filter-tab doctor${filter === f ? ' active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? <SkeletonRows /> : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">No {filter === 'all' ? '' : filter} appointments</div>
                </div>
              ) : filtered.map((appt, i) => (
                <div key={appt._id} className="appt-row">
                  <div className="appt-left">
                    <Avatar name={appt.patient?.name || 'P'} index={i} />
                    <div>
                      <div className="appt-name">{appt.patient?.name || 'Unknown'}</div>
                      <div className="appt-meta">{new Date(appt.date).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="appt-right">
                    <StatusBadge status={appt.status} />
                    {appt.status === 'booked' && (
                      <>
                        <button className="btn-complete" onClick={() => handleComplete(appt._id)}>Complete</button>
                        <button className="btn-cancel"   onClick={() => handleCancel(appt._id)}>Cancel</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-greeting">Welcome back, {name}</div>

      {feedback && (
        <div className={`dashboard-alert ${feedback.type}`}>
          {feedback.msg}
          <button className="dashboard-alert-close" onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      <div className="book-card">
        <div className="book-card-title">Book an appointment</div>
        <form onSubmit={handleBook}>
          <div className="book-form-row">
            <div className="book-field">
              <label>Doctor</label>
              <select value={doctor} onChange={e => setDoctor(e.target.value)} required>
                <option value="">Select a doctor</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc.user?.username}>
                    {doc.user?.name}
                    {doc.specialization ? ` — ${doc.specialization}` : ''}
                    {doc.consultationFee ? ` (₹${doc.consultationFee})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="book-field">
              <label>Date &amp; time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-book" disabled={submitting}>
              {submitting ? <span className="spinner-border spinner-border-sm" /> : 'Book'}
            </button>
          </div>
        </form>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-n" style={{color:'#1966b7'}}>{counts.booked}</div>
          <div className="stat-card-l">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-n" style={{color:'#27500A'}}>{counts.completed}</div>
          <div className="stat-card-l">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-n" style={{color:'#444441'}}>{counts.cancelled}</div>
          <div className="stat-card-l">Cancelled</div>
        </div>
      </div>

      <div className="appts-card">
        <div className="appts-header">
          <div className="appts-title">My appointments</div>
          <div className="filter-tabs">
            {['all','booked','completed','cancelled'].map(f => (
              <button
                key={f}
                className={`filter-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <SkeletonRows /> : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No appointments yet. Book one above!</div>
          </div>
        ) : filtered.map((appt, i) => (
          <div key={appt._id} className="appt-row">
            <div className="appt-left">
              <Avatar name={appt.doctor?.name || 'D'} index={i} />
              <div>
                <div className="appt-name">{appt.doctor?.name || 'Unknown'}</div>
                <div className="appt-meta">{new Date(appt.date).toLocaleString()}</div>
              </div>
            </div>
            <div className="appt-right">
              <StatusBadge status={appt.status} />
              {appt.status === 'booked' && (
                <button className="btn-cancel" onClick={() => handleCancel(appt._id)}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
