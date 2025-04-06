export type Job = {
  id: number;
  title: string;
  description: string;
};

export interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  resumeUrl: string;
  appliedDate: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
}