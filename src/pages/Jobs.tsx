import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, X } from 'lucide-react';
import type { Job } from '../types';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
  });

  // Fetch jobs from backend
  useEffect(() => {
    fetch('http://localhost:5000/jobs')
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Submit new job
  const handleSubmit = async () => {
    if (!newJob.title) {
      alert('Title is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) throw new Error('Failed to add job');

      const savedJob = await response.json();
      setJobs([...jobs, savedJob]);
      setShowModal(false);
      setNewJob({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search jobs by title"
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
            <PlusCircle size={20} />
            Add Job
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Job</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              className="input-field mt-4 w-full h-12 text-lg border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Job Description"
              className="input-field mt-2 w-full h-40 text-lg border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={handleInputChange}
            />
            <button className="btn-primary mt-4 w-full" onClick={handleSubmit}>Submit Job</button>
          </div>
        </div>
      )}
    </div>
  );
}
