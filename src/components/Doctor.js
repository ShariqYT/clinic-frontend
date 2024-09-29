import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Doctor = () => {
  const [patients, setPatients] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      const response = await axios.get("http://localhost:3001/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const createChartData = () => {
    const dates = {};
    patients.forEach((patient) => {
      const date = new Date(patient.created_at).toLocaleDateString();
      dates[date] = (dates[date] || 0) + 1;
    });

    setChartData({
      labels: Object.keys(dates),
      datasets: [
        {
          label: "Number of Patients",
          data: Object.values(dates),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (patients.length > 0) createChartData();
  }, [patients]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex justify-between mb-8">
            <h1 className="text-xl font-bold mb-4">Doctor Portal</h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Log Out</button>
          </div>
          <h3 className="text-lg font-semibold mb-4">Registered Patients</h3>
          {patients.length === 0 ? (
            <p>No patients registered.</p>
          ) : (
            <ul className="mb-4">
              {patients.map((patient) => (
                <li key={patient.id} className="border-b py-2">{patient.name}</li>
              ))}
            </ul>
          )}
          <h3 className="text-lg font-semibold mb-4">Patients Over Time</h3>
          {chartData.labels && (
            <Bar data={chartData} options={{ responsive: true }} />
          )}
        </>
      )}
    </div>
  );
};

export default Doctor;
