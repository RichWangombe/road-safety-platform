export const tasksData = [
  // Activity 101: Guardrail Installation
  { id: 10101, activityId: 101, name: 'Survey Site A', status: 'completed', assignedTo: 'Team Lead Alpha', dueDate: '2025-02-28' },
  { id: 10102, activityId: 101, name: 'Install Section 1', status: 'active', assignedTo: 'Team Lead Alpha', dueDate: '2025-03-15' },
  { id: 10103, activityId: 101, name: 'Inspect Section 1', status: 'pending', assignedTo: 'Supervisor Mike', dueDate: '2025-03-20' },

  // Activity 202: Congestion Monitoring System
  { id: 20201, activityId: 202, name: 'Deploy Sensor Grid 1', status: 'completed', assignedTo: 'Team Lead Bravo', dueDate: '2025-05-10' },
  { id: 20202, activityId: 202, name: 'Calibrate Sensor Grid 1', status: 'active', assignedTo: 'Team Lead Bravo', dueDate: '2025-05-20' },
  { id: 20203, activityId: 202, name: 'Submit Initial Report', status: 'pending', assignedTo: 'Team Lead Bravo', dueDate: '2025-05-25' },
];

export const activitiesData = [
  // Program 1: Highway Safety Initiative
  { id: 101, programId: 1, name: 'Guardrail Installation', status: 'active', priority: 'high', startDate: '2025-02-01', endDate: '2025-05-31', budget: 500000 },
  { id: 102, programId: 1, name: 'Pothole Repair Campaign', status: 'active', priority: 'medium', startDate: '2025-03-15', endDate: '2025-09-30', budget: 750000 },
  { id: 103, programId: 1, name: 'Signage Upgrade', status: 'planning', priority: 'medium', startDate: '2025-06-01', endDate: '2025-08-31', budget: 250000 },

  // Program 2: Urban Traffic Management
  { id: 201, programId: 2, name: 'Smart Signal Deployment', status: 'completed', priority: 'high', startDate: '2025-03-01', endDate: '2025-07-31', budget: 900000 },
  { id: 202, programId: 2, name: 'Congestion Monitoring System', status: 'active', priority: 'high', startDate: '2025-04-01', endDate: '2025-10-31', budget: 600000 },
  { id: 203, programId: 2, name: 'Public Transport Integration', status: 'on-hold', priority: 'low', startDate: '2025-08-01', endDate: '2025-11-30', budget: 300000 },

  // Program 3: Rural Road Maintenance
  { id: 301, programId: 3, name: 'Bridge Inspection', status: 'active', priority: 'high', startDate: '2025-04-10', endDate: '2025-06-30', budget: 200000 },
  { id: 302, programId: 3, name: 'Surface Resealing', status: 'planning', priority: 'medium', startDate: '2025-07-01', endDate: '2025-09-30', budget: 450000 },

  // Program 4: Driver Education Campaign
  { id: 401, programId: 4, name: 'School Safety Talks', status: 'completed', priority: 'medium', startDate: '2024-07-01', endDate: '2024-08-31', budget: 150000 },
  { id: 402, programId: 4, name: 'Media Campaign Launch', status: 'completed', priority: 'high', startDate: '2024-09-01', endDate: '2024-11-30', budget: 300000 },
];

export const resourcesData = [
  {
    id: 1,
    title: 'National Road Safety Strategy 2021-2030',
    description: 'The official government strategy document outlining key objectives and action plans.',
    category: 'Official Documents',
    type: 'PDF',
    dateAdded: '2023-01-15',
  },
  {
    id: 2,
    title: 'Defensive Driving Techniques',
    description: 'A comprehensive video tutorial on best practices for defensive driving.',
    category: 'Training Materials',
    type: 'Video',
    dateAdded: '2023-02-20',
  },
  {
    id: 3,
    title: 'Incident Reporting Form',
    description: 'Standard template for reporting road safety incidents. Please download and fill.',
    category: 'Forms & Templates',
    type: 'DOC',
    dateAdded: '2023-03-10',
  },
  {
    id: 4,
    title: 'Guide to School Zone Safety Audits',
    description: 'A step-by-step guide for conducting safety audits in school zones.',
    category: 'Guidelines',
    type: 'Guide',
    dateAdded: '2023-04-05',
  },
  {
    id: 5,
    title: 'Annual Performance Report 2022',
    description: 'A detailed report on the performance and outcomes of all road safety programs in 2022.',
    category: 'Official Documents',
    type: 'PDF',
    dateAdded: '2023-05-25',
  },
  {
    id: 6,
    title: 'Community Engagement Toolkit',
    description: 'Resources and templates for running effective community engagement sessions.',
    category: 'Guidelines',
    type: 'DOC',
    dateAdded: '2023-06-18',
  }
];

export const stakeholdersData = [
  {
    id: 1,
    name: 'Hon. John Smith',
    organization: 'Ministry of Transport',
    role: 'Minister',
    engagementLevel: 'High',
    email: 'j.smith@mot.gov',
  },
  {
    id: 2,
    name: 'Dr. Emily White',
    organization: 'National Medical Center',
    role: 'Head of Emergency Services',
    engagementLevel: 'Medium',
    email: 'e.white@nmc.org',
  },
  {
    id: 3,
    name: 'Mr. David Chen',
    organization: 'Logistics Corp',
    role: 'CEO',
    engagementLevel: 'Low',
    email: 'd.chen@logisticscorp.com',
  },
  {
    id: 4,
    name: 'Mrs. Sarah Adams',
    organization: 'Metropolis School District',
    role: 'Superintendent',
    engagementLevel: 'High',
    email: 's.adams@msd.edu',
  },
  {
    id: 5,
    name: 'Chief Inspector Davis',
    organization: 'Regional Police Department',
    role: 'Traffic Division Chief',
    engagementLevel: 'High',
    email: 'davis.t@rpd.gov',
  },
  {
    id: 6,
    name: 'Ms. Linda Green',
    organization: 'Green Future NGO',
    role: 'Director',
    engagementLevel: 'Medium',
    email: 'l.green@greenfuture.org',
  }
];
