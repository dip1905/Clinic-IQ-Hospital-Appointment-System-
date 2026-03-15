import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Doctor() {
    const [doctor, setDoctor] = useState([]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(
                'http://localhost:5000/api/admin/doctors',
                { withCredentials: true }
            );
            setDoctor(res.data);
        } catch (err) {
            alert('Access denied');
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const approveDoctor = async (id) => {
        await axios.patch(
            `http://localhost:5000/api/admin/approve/${id}`,
            {},
            { withCredentials: true }
        );
        fetchUsers();
    };

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
                    {doctor.map((doc) => (
                        <tr key={doc._id}>
                            <td>{doc.name}</td>
                            <td>{doc.username}</td>
                            <td>{doc.role}</td>

                            <td>
                                {doc.isBlocked && 'Blocked'}
                                {!doc.isApproved && 'Pending'}
                                {!doc.isBlocked && doc.isApproved && 'Active'}
                            </td>

                            <td>
                                {!doc.isApproved && (
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => approveDoctor(doc._id)}
                                    >
                                        Approve
                                    </button>
                                )}

                                {!doc.isBlocked ? (
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => blockUser(doc._id)}
                                    >
                                        Block
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => unblockUser(doc._id)}
                                    >
                                        Unblock
                                    </button>
                                )}

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteUser(doc._id)}
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

export default Doctor;
