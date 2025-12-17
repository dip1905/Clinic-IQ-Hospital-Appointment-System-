import React, { useEffect, useState } from 'react';
import {
  getAppointmentsForDoctor,
  getAppointmentsForPatient,
  bookAppointment,
  cancelAppointment,
  getDoctors,
  markCompleted
} from '../services/api';
import axios from 'axios';
import '../css/Dashboard.css';


function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');

  // const name = localStorage.getItem('name');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  // useEffect(() => {
  //   if (role === 'doctor') fetchDoctorAppointments(username);
  //   else if (role === 'patient') {
  //     fetchPatientAppointments(username);
  //     fetchDoctorsList();
  //   }
  // }, [username, role]);
  
  useEffect(() => {
  if (!username || !role) return;

  if (role === 'doctor') {
    fetchDoctorAppointments(username);
  } else if (role === 'patient') {
    fetchPatientAppointments(username);
    fetchDoctorsList();
  }
}, [username, role]);

  const fetchDoctorAppointments = async (uname) => {
    const res = await getAppointmentsForDoctor(uname);
    setAppointments(res.data);
  };

  const fetchPatientAppointments = async (uname) => {
    if (!uname) return;
    const res = await getAppointmentsForPatient(uname);
    setAppointments(res.data);
  };

  const fetchDoctorsList = async () => {
    const res = await getDoctors();
    setDoctors(res.data);
  };

  const handleBook = async (e) => {
  e.preventDefault();
  if (!doctor || !date) {
    alert("Please select doctor and date");
    return;
  }
  try {
    await bookAppointment({
      patient: username,
      doctor,
      date
    });
    alert('Appointment booked');
    fetchPatientAppointments(username);
    setDoctor('');
    setDate('');
  } catch (err) {
    alert("Booking failed");
    console.error(err);
  }
};

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      alert("Appointment cancelled");
      if (role === 'doctor') fetchDoctorAppointments(username);
      else fetchPatientAppointments(username);
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Cancel failed: " + err.response?.data?.message || err.message);
    }
  };
  const handleComplete = async (id) => {
  try {
    await markCompleted(id);
    alert("Marked as completed");
    role === 'doctor'
      ? fetchDoctorAppointments(username)
      : fetchPatientAppointments(username);
  } catch (error) {
    alert("Failed to mark completed");
  }
};


  return (
    <div className="container">
      {role === 'patient' && (
        <form onSubmit={handleBook} className="mb-4">
          <h3>Book Appointment</h3>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
            <option value="">Select Doctor</option>
            {doctors
              .map(doc => (
                <option key={doc._id} value={doc.username}>{doc.name}</option>
              ))}

          </select>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="ms-2" />
          <button type="submit" className="btn btn-primary ms-2">Book</button>
        </form>
      )}

      <div className="mt-4">
        <h3>{role === 'doctor' ? 'My Patients' : 'My Appointments'}</h3>
        {appointments.map((appt) => (
          <div key={appt._id} className="appointment-card">
            <p><strong>{role === 'doctor' ? 'Patient' : 'Doctor'}:</strong> {role === 'doctor' ? appt.patient : appt.doctor}</p>
            <p><strong>Date:</strong> {new Date(appt.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {appt.status}</p>

            {appt.status === 'booked' && (
              <div className="appointment-actions">
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(appt._id)}>Cancel</button>
                {role === 'doctor' && (
                  <button className="btn btn-success btn-sm" onClick={() => handleComplete(appt._id)}>Mark Completed</button>
                )}
              </div>
            )}
          </div>

        ))}
      </div>
    </div>
  );
}

export default Dashboard;
