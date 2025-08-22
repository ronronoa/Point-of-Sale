import React, { useState } from "react";
import axios from "axios";

export default function AddUser() {
  const [form, setForm] = useState({ username: "", password: "", role: "cashier" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.message);
      setForm({ username: "", password: "", role: "cashier" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Add New User</h2>

        {message && <p className="text-center text-red-500 mb-3">{message}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
