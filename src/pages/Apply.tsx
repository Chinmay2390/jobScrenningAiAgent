import React, { useState } from 'react';
import { useParams } from 'react-router-dom';  // ✅ Import useParams
import { Briefcase } from 'lucide-react';

export default function Apply() {
  const { jobId } = useParams();  // ✅ Get job ID from URL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    resume: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resume) {
      alert('Please upload a resume.');
      return;
    }
  
    const fileData = new FormData();
    fileData.append('jobId', jobId);  // ✅ Include jobId in form submission
    fileData.append('name', formData.name);
    fileData.append('email', formData.email);
    fileData.append('position', formData.position);
    fileData.append('resume', formData.resume);
  
    try {
      const response = await fetch('https://jobscrenningaiagent.onrender.com/apply', {
        method: 'POST',
        body: fileData,  // ✅ Don't manually set Content-Type
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div className="space-y-16 p-8 max-w-xl mx-auto">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Apply for a Job</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Fill in your details and upload your resume to apply.</p>
      </section>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium">Position Applied For</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md">
            <option value="">Select a position</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium">Upload Resume</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
          <Briefcase className="inline-block mr-2" size={20} />
          Submit Application
        </button>
      </form>
    </div>
  );
}
