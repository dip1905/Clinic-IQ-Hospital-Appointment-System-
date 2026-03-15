import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Patient() {
  const [patient, setPatient] = useState([]);

  const fetchPatients = () => {
    axios
      .get('http://localhost:5000/api/admin/users/patients', { withCredentials: true })
      .then(res => setPatient(res.data))
      .catch(() => alert('Access denied'));
  };

  useEffect(fetchPatients, []);

  const blockUser = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/admin/block/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const unblockUser = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/admin/unblock/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    await axios.delete(
      `http://localhost:5000/api/admin/users/${id}`,
      { withCredentials: true }
    );
    fetchUsers();
  };

  return (
    <div className='container'>
      <h1>All Patients</h1>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {patient.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>

              <td>
                {user.isBlocked && 'Blocked'}
                {!user.isBlocked && (user.role !== 'doctor' || user.isApproved) && 'Active'}
              </td>

              <td>
                {!user.isBlocked ? (
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => blockUser(user._id)}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => unblockUser(user._id)}
                  >
                    Unblock
                  </button>
                )}

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default Patient;
