import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        'https://cliniciq-hospital-appointment-system.onrender.com/api/admin/users',
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (err) {
      alert('Access denied');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveDoctor = async (id) => {
    await axios.patch(
      `https://cliniciq-hospital-appointment-system.onrender.com/api/admin/approve/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const blockUser = async (id) => {
    await axios.patch(
      `https://cliniciq-hospital-appointment-system.onrender.com/api/admin/block/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const unblockUser = async (id) => {
    await axios.patch(
      `https://cliniciq-hospital-appointment-system.onrender.com/api/admin/unblock/${id}`,
      {},
      { withCredentials: true }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    await axios.delete(
      `https://cliniciq-hospital-appointment-system.onrender.com/api/admin/users/${id}`,
      { withCredentials: true }
    );
    fetchUsers();
  };

  return (
    <div className="container">
      <h3>All Users</h3>

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
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>

              <td>
                {user.isBlocked && 'Blocked'}
                {user.role === 'doctor' && !user.isApproved && 'Pending'}
                {!user.isBlocked && (user.role !== 'doctor' || user.isApproved) && 'Active'}
              </td>

              <td>
                {user.role === 'doctor' && !user.isApproved && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approveDoctor(user._id)}
                  >
                    Approve
                  </button>
                )}

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
  );
}

export default ManageUsers;
