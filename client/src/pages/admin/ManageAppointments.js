import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = () => {
    axios
      .get('https://cliniciq-hospital-appointment-system.onrender.com/api/admin/appointments', { withCredentials: true })
      .then(res => setAppointments(res.data))
      .catch(() => alert('Access denied'));
  };

  useEffect(fetchAppointments, []);

  const handleDelete = async (id) => {
    await axios.delete(
      `https://cliniciq-hospital-appointment-system.onrender.com/api/admin/appointments/${id}`,
      { withCredentials: true }
    );
    fetchAppointments();
  };

  return (
    <div className="container">
      <h3>All Appointments</h3>

      {appointments.map(a => (
        <div key={a._id} className="appointment-card">
          <p><strong>Patient:</strong> {a.patient}</p>
          <p><strong>Doctor:</strong> {a.doctor}</p>
          <p><strong>Status:</strong> {a.status}</p>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(a._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageAppointments;
