import React from 'react';
import { Briefcase, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with top companies and opportunities that match your skills and aspirations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/jobs"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Briefcase className="mr-2" size={20} />
            Browse Jobs
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Users className="mr-2" size={20} />
            Admin Login
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            For Job Seekers
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create your profile, upload your resume, and apply to jobs with just a few clicks.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            For Employers
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Post job openings, manage applications, and find the perfect candidates for your team.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Easy Management
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Track application status, communicate with candidates, and streamline your hiring process.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100">
            Join thousands of job seekers who have found their perfect role through our platform.
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-3 border-2 border-white text-base font-medium rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-200"
          >
            Create Your Profile
          </a>
        </div>
      </section>
    </div>
  );
}