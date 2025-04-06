// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import TopApplicants from '../components/TopApplicants';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/top_applicants')
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching applicants:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
      <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Top Applicants Dashboard</h1>
      {jobs.map((job) => (
        <TopApplicants key={job.job_id} job={job} />
      ))}
    </div>
  );
};

export default Dashboard;

