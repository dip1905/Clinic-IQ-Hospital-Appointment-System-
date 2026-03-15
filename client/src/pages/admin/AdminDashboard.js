import React,{useEffect} from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="container">

      <h2>Admin Dashboard</h2>

      {/* <div className="mt-4">
        <Link to="/admin/users/patients" className="btn btn-primary me-2">
          Manage Patient
        </Link>
        <Link to="/admin/users/doctors" className="btn btn-primary me-2">
          Manage Doctors
        </Link>

        <Link to="/admin/appointments" className="btn btn-secondary">
          Manage Appointments
        </Link>
      </div> */}
    </div>
  );
}

export default AdminDashboard;
