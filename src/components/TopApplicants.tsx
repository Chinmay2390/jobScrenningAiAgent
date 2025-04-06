import React from 'react';
import axios from 'axios';

const TopApplicants = ({ job }) => {
  const handleSendMail = async (applicant) => {
    try {
      const res = await axios.post('http://localhost:5000/send_mail', {
        email: applicant.email,
        name: applicant.name,
        job_title: job.job_title,
      });
      alert(`Email sent to ${applicant.name}`);
    } catch (error) {
      alert(`Failed to send email: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 my-4">
      <h2 className="text-xl font-bold text-blue-600">{job.job_title}</h2>
      <ul className="mt-2">
        {job.top_applicants.map((applicant, index) => (
          <li key={index} className="border-b py-2">
            <p className="font-semibold">{applicant.name}</p>
            <p className="text-sm text-gray-600">{applicant.email}</p>
            <p className="text-sm">{applicant.skills}</p>
            <span className="text-green-700 font-semibold">
              Score: {applicant.score}
            </span>
            <div className="mt-2">
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleSendMail(applicant)}
              >
                Send Mail
              </button>
            </div>
          </li>
        ))}
        {job.top_applicants.length === 0 && (
          <p className="text-gray-500 italic">No applicants yet.</p>
        )}
      </ul>
    </div>
  );
};

export default TopApplicants;
