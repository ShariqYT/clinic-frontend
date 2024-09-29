import React, { useEffect, useState } from "react";
import axios from "axios";

const Receptionist = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [editingPatientId, setEditingPatientId] = useState(null);

  const fetchPatients = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const response = await axios.get("http://localhost:3001/patients", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPatients(response.data);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingPatientId) {
        await axios.put(`http://localhost:3001/patients/${editingPatientId}`, {
          patient: {
            name,
            age,
            address
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:3001/patients", {
          patient: {
            name,
            age,
            address
          }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      clearForm();
      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };


  const handleEdit = (patient) => {
    setEditingPatientId(patient.id);
    setName(patient.name);
    setAge(patient.age);
    setAddress(patient.address)
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3001/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPatients();
  };

  const clearForm = () => {
    setName("");
    setAge("");
    setAddress("");
    setEditingPatientId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };


  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <div className="flex justify-between mb-8">
        <h1 className="text-xl font-bold mb-4">Patient Management</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Log Out</button>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Age</label>
          <input
            type="number"
            className="w-full border border-gray-300 p-2 rounded"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Address</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {editingPatientId ? "Update Patient" : "Add Patient"}
        </button>
      </form>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Age</th>
            <th className="py-2 px-4 border">Address</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="py-2 px-4 border">{patient.name}</td>
              <td className="py-2 px-4 border">{patient.age}</td>
              <td className="py-2 px-4 border">{patient.address}</td>
              <td className="py-2 px-4 border">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEdit(patient)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(patient.id)}
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
};

export default Receptionist;
