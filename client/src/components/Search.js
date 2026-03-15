import React, { useState } from 'react';
import axios from 'axios';

function SearchUsers({ role }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!query) {
      setMessage('Please enter a search term');
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
        withCredentials: true
      });

      if (res.data.data.length === 0) {
        setMessage('No users found');
        setResults([]);
      } else {
        setResults(res.data.data);
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      setMessage('Access denied or server error');
      setResults([]);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Search Users</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          placeholder="Enter name to search"
          className="form-control"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {message && <p>{message}</p>}

      {results.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  {user.isBlocked ? 'Blocked' :
                   user.role === 'doctor' && !user.isApproved ? 'Pending' : 'Active'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchUsers;
