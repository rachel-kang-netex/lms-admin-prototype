import { LmsModule } from './events.mock';

export interface PathwayItemSession {
  id: number;
  code: string;
  name: string;
  status: 'Scheduled' | 'Pending';
  scheduledModules: string;
  modulesComplete: boolean;
  dateRange: string;
  totalDuration: string;
  capacity: string;
  trainer: { name: string };
}

export interface PathwayStageItem {
  name: string;
  mandatory: boolean;
  prerequisites: number;
  prerequisitesIsLink?: boolean;
  availability: string;
  availabilityIsLink?: boolean;
  notStarted: number | string;
  inProgress: number | string;
  completed: number | string;
  sessions?: number | string;
  hasAlert?: boolean;
  trainingId?: number;
}

export interface PathwayStage {
  id: string;
  label: string;
  type: 'courses' | 'events';
  items: PathwayStageItem[];
}

export const PATHWAY_STRUCTURE_MOCK: Record<number, PathwayStage[]> = {
  204: [
    {
      id: 'stage1',
      label: 'Stage 1 (Courses)',
      type: 'courses',
      items: [
        { mandatory: true, name: 'Understanding UX and UI', prerequisites: 0, availability: 'Always available', notStarted: 3, inProgress: 23, completed: 0 },
        { mandatory: true, name: 'Design Thinking and Human-Centered Design', prerequisites: 1, prerequisitesIsLink: true, availability: '13/05/2026, 11:00', availabilityIsLink: true, notStarted: 5, inProgress: 18, completed: 0 },
      ],
    },
    {
      id: 'stage2',
      label: 'Stage 2 (Events)',
      type: 'events',
      items: [
        { mandatory: true, name: 'Webinar | Expert Panel Discussion on Emerging Topics in UX', sessions: 0, hasAlert: true, prerequisites: 1, prerequisitesIsLink: true, availability: '13/05/2026, 11:00 – 12/05/2027, 23:59', notStarted: 0, inProgress: 0, completed: 0, trainingId: 2 },
        { mandatory: true, name: 'Presential Bootcamp: Intensive Workshop on UX/UI Design', sessions: 2, hasAlert: true, prerequisites: 1, prerequisitesIsLink: true, availability: 'Always available', notStarted: 0, inProgress: 0, completed: 0, trainingId: 1 },
      ],
    },
  ],
  201: [
    {
      id: 'stage1',
      label: 'Stage 1 (Courses)',
      type: 'courses',
      items: [
        { mandatory: true, name: 'Foundations of Leadership', prerequisites: 0, availability: 'Jul 1, 2026', availabilityIsLink: true, notStarted: 30, inProgress: 0, completed: 0 },
      ],
    },
    {
      id: 'stage2',
      label: 'Stage 2 (Events)',
      type: 'events',
      items: [
        { mandatory: true, name: 'Team Management & Communication Workshop', sessions: 1, prerequisites: 0, availability: 'Aug 1, 2026', availabilityIsLink: true, notStarted: 30, inProgress: 0, completed: 0 },
      ],
    },
  ],
  203: [
    {
      id: 'stage1',
      label: 'Stage 1 (Courses)',
      type: 'courses',
      items: [
        { mandatory: true, name: 'Foundations of Leadership', prerequisites: 0, availability: 'Apr 1, 2026', notStarted: 0, inProgress: 0, completed: 2 },
      ],
    },
    {
      id: 'stage2',
      label: 'Stage 2 (Events)',
      type: 'events',
      items: [
        { mandatory: true, name: 'Team Management & Communication Workshop', sessions: 1, prerequisites: 0, availability: 'May 15, 2026', notStarted: 0, inProgress: 0, completed: 2 },
      ],
    },
  ],
};

export interface LmsLearner {
  id: number;
  name: string;
  attendance: string;
  timeSpent: string;
  evaluationGrade: string | null;
  completed: boolean;
  enrollmentType?: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  enrollmentThrough?: string;
}

export interface LmsTrainer {
  id: number;
  name: string;
}

export interface LmsEnrollmentProcess {
  id: number;
  name: string;
  description: string;
  learnersCount: number;
}

export interface LmsTraining {
  id: number;
  name: string;
  status: 'Open' | 'Closed' | 'Scheduled';
  public: boolean;
  dates: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  eventId?: number;
  eventName?: string;
  pathwayId?: number;
  pathwayName?: string;
  modules: LmsModule[];
  learners?: LmsLearner[];
  trainers?: LmsTrainer[];
  enrollmentCapacity?: number;
  enrollmentProcesses?: LmsEnrollmentProcess[];
}

export const TRAININGS_MOCK: LmsTraining[] = [
  {
    id: 2,
    name: 'Webinar | Expert Panel Discussion on Emerging Trends in UX/UI Design',
    status: 'Scheduled',
    public: false,
    dates: 'Jul 15, 2026',
    created: '17/06/2026 - 09:00',
    createdBy: 'Tomás Herrero',
    lastModified: '17/06/2026 - 09:00',
    lastModifiedBy: 'Tomás Herrero',
    eventId: 1,
    eventName: 'Webinar | Expert Panel Discussion on Emerging Trends in UX/UI Design',
    modules: [
      {
        name: 'Expert Panel Discussion on Emerging Trends in UX/UI Design',
        description: 'An expert panel discussion covering the latest trends in UX/UI design, featuring industry leaders sharing insights on the evolving landscape of user experience and interface design.',
        duration: 90,
        completionCriteria: 'By attendance percentage',
        schedule: {
          slots: [{ startDate: '2026-07-15', startTime: '10:00', endDate: '2026-07-15', endTime: '11:30' }],
          location: '',
          teamsEnabled: true,
          autoVirtualRoom: true,
          virtualRoomUrl: '',
          sendReminder: true,
          reminderDays: 3,
        },
      },
    ],
    learners: [],
    trainers: [],
    enrollmentCapacity: 100,
  },
  {
    id: 1,
    name: 'Presential Bootcamp: Intensive Workshop on UX/UI Design Principles',
    status: 'Open',
    public: true,
    dates: 'Jun 8 - Jun 25, 2026',
    created: '15/06/2026 - 10:00',
    createdBy: 'Tomás Herrero',
    lastModified: '15/06/2026 - 10:00',
    lastModifiedBy: 'Tomás Herrero',
    eventId: 2,
    eventName: 'Presential Bootcamp: Intensive Workshop on UX/UI Design Principles',
    modules: [
      {
        name: 'UX Foundations & Design Thinking',
        description: 'An introduction to user-centered design, UX principles, and the design thinking framework. Participants learn how to identify user needs, define problems, and understand the role of UX in creating successful digital products.',
        duration: 120,
        completionCriteria: 'By attendance',
        schedule: {
          slots: [{ startDate: '2026-06-08', startTime: '09:00', endDate: '2026-06-08', endTime: '11:00' }],
          location: 'Madrid',
          teamsEnabled: false,
          autoVirtualRoom: false,
          virtualRoomUrl: '',
          sendReminder: false,
          reminderDays: 10,
        },
      },
      {
        name: 'User Research & Experience Mapping',
        description: 'Participants explore user research techniques and learn how to transform insights into actionable design artifacts including personas, empathy maps, and user journeys. The session emphasizes understanding user behaviors, motivations, and pain points.',
        duration: 120,
        completionCriteria: 'By attendance',
        schedule: {
          slots: [{ startDate: '2026-06-16', startTime: '08:00', endDate: '2026-06-16', endTime: '23:59' }],
          location: 'Madrid',
          teamsEnabled: false,
          autoVirtualRoom: false,
          virtualRoomUrl: '',
          sendReminder: false,
          reminderDays: 10,
        },
      },
      {
        name: 'UX Design Sprint: Information Architecture, User Flows & Wireframing',
        description: 'This intensive session walks participants through organizing information, creating user flows, and wireframing interfaces. Participants will create user personas and customer journey maps to visualize user needs and craft prototyping artifacts.',
        duration: 240,
        completionCriteria: 'By attendance',
        schedule: {
          slots: [{ startDate: '2026-06-25', startTime: '09:00', endDate: '2026-06-25', endTime: '13:00' }],
          location: 'Madrid',
          teamsEnabled: false,
          autoVirtualRoom: false,
          virtualRoomUrl: '',
          sendReminder: false,
          reminderDays: 10,
        },
      },
      {
        name: 'UI Design Principles & Design Systems',
        description: 'Participants learn to translate UX concepts into effective interfaces. Modules include visual hierarchy, typography, color systems, layout design, accessibility, and the fundamentals of design systems. Through guided exercises, participants design consistent and accessible UI components.',
        duration: 240,
        completionCriteria: 'By attendance',
      },
      {
        name: 'Interactive Prototyping & Usability Testing',
        description: 'This session focuses on building interactive prototypes and evaluating them through usability testing. Participants gain experience in prototyping techniques, gather feedback, and identify opportunities for improvement.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
      {
        name: 'Design Iteration & Final Presentations',
        description: 'The bootcamp concludes with refinement of the learned principles and project presentations. Participants showcase their solutions, explain their design decisions, and receive feedback from peers and instructors.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
    ],
    learners: [
      { id: 1, name: 'Ekon Azikiwe',   attendance: '1/3', timeSpent: '2h 00m', evaluationGrade: null,  completed: true,  enrollmentType: 'MANDATORY',    enrollmentThrough: 'Process: UX training enrollments' },
      { id: 2, name: 'Livia Monteiro', attendance: '1/3', timeSpent: '2h 00m', evaluationGrade: null,  completed: true,  enrollmentType: 'MANDATORY',    enrollmentThrough: 'Process: UX training enrollments' },
      { id: 3, name: 'Imani Dubois',   attendance: '1/3', timeSpent: '2h 00m', evaluationGrade: null,  completed: false, enrollmentType: 'MANDATORY',    enrollmentThrough: 'Process: UX training enrollments' },
      { id: 4, name: 'Kai Tanaka',     attendance: '1/3', timeSpent: '2h 00m', evaluationGrade: null,  completed: true,  enrollmentType: 'MANDATORY',    enrollmentThrough: 'Process: UX training enrollments' },
      { id: 5, name: 'Sofia Torres',   attendance: '1/3', timeSpent: '2h 00m', evaluationGrade: null,  completed: true,  enrollmentType: 'MANDATORY',    enrollmentThrough: 'Process: UX training enrollments' },
      { id: 6, name: 'Dakota Rivers',  attendance: '0/3', timeSpent: '-',       evaluationGrade: null,  completed: false, enrollmentType: 'RECOMMENDED',  enrollmentThrough: 'Manual addition' },
      { id: 7, name: 'Zane Kalinski',  attendance: '1/3', timeSpent: '2h 00m', evaluationGrade: null,  completed: true,  enrollmentType: 'OPTIONAL',     enrollmentThrough: 'Manual addition' },
    ],
    trainers: [
      { id: 1, name: 'Sofia Perez' },
    ],
    enrollmentCapacity: 40,
    enrollmentProcesses: [
      {
        id: 1,
        name: 'UX training enrollments',
        description: 'This process enrolls product employees in all UX trainings and events.',
        learnersCount: 5,
      },
    ],
  },
];

// Key: `${pathwayId}_${stageId}_${itemIdx}`
export const ITEM_SESSIONS_MOCK: Record<string, PathwayItemSession[]> = {
  '204_stage2_1': [
    {
      id: 1,
      code: 'TR-2026-1089',
      name: 'Sesión español',
      status: 'Scheduled',
      scheduledModules: '6/6',
      modulesComplete: true,
      dateRange: '05/18/2026, 04:30 - 05/20/2026, 05:00',
      totalDuration: '16 hours',
      capacity: '32/40',
      trainer: { name: 'Sofia Torres' },
    },
    {
      id: 2,
      code: 'TR-2026-1461',
      name: 'English session',
      status: 'Pending',
      scheduledModules: '3/6',
      modulesComplete: false,
      dateRange: '05/18/2026, 04:30 - 05/20/2026, 05:00',
      totalDuration: '16 hours',
      capacity: '0/40',
      trainer: { name: 'Maria Imani Dubois' },
    },
  ],
};

export const PATHWAY_TRAININGS_MOCK: LmsTraining[] = [
  {
    id: 204,
    name: 'Fundamentals of Crafting User-Centric Experiences and Interfaces',
    status: 'Open',
    public: true,
    dates: 'Jun 16 - Jul 31, 2026',
    created: '16/06/2026 - 09:00',
    createdBy: 'Tomás Herrero',
    lastModified: '16/06/2026 - 09:00',
    lastModifiedBy: 'Tomás Herrero',
    pathwayId: 3,
    pathwayName: 'Fundamentals of Crafting User-Centric Experiences and Interfaces',
    modules: [
      {
        name: 'UX Foundations & Design Thinking',
        description: 'An introduction to user-centered design, UX principles, and the design thinking framework. Participants learn how to identify user needs, define problems, and understand the role of UX in creating successful digital products.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
    ],
    learners: [],
    trainers: [{ id: 1, name: 'Sofia Perez' }],
    enrollmentCapacity: 40,
  },
  {
    id: 201,
    name: 'Leadership & Management Skills – Group A',
    status: 'Open',
    public: true,
    dates: 'Jul 1 - Aug 30, 2026',
    created: '15/06/2026 - 10:00',
    createdBy: 'Tomás Herrero',
    lastModified: '15/06/2026 - 10:00',
    lastModifiedBy: 'Tomás Herrero',
    pathwayId: 1,
    pathwayName: 'Leadership & Management Skills',
    modules: [
      {
        name: 'Foundations of Leadership',
        description: 'Introduction to leadership frameworks, styles, and the core competencies required to lead teams effectively in modern organizations.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
      {
        name: 'Team Management & Communication',
        description: 'Strategies for building high-performing teams, managing conflict, delivering feedback, and communicating with clarity and impact.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
    ],
    learners: [
      { id: 1, name: 'Ekon Azikiwe',   attendance: '1/2', timeSpent: '2h 00m', evaluationGrade: null, completed: true,  enrollmentType: 'MANDATORY',   enrollmentThrough: 'Process: Leadership program enrollments' },
      { id: 2, name: 'Livia Monteiro', attendance: '1/2', timeSpent: '2h 00m', evaluationGrade: null, completed: false, enrollmentType: 'MANDATORY',   enrollmentThrough: 'Process: Leadership program enrollments' },
      { id: 3, name: 'Sofia Torres',   attendance: '0/2', timeSpent: '-',       evaluationGrade: null, completed: false, enrollmentType: 'RECOMMENDED', enrollmentThrough: 'Manual addition' },
    ],
    trainers: [
      { id: 1, name: 'Sofia Perez' },
    ],
    enrollmentCapacity: 30,
    enrollmentProcesses: [
      {
        id: 2,
        name: 'Leadership program enrollments',
        description: 'This process enrolls managers and team leads in all leadership pathway trainings.',
        learnersCount: 2,
      },
    ],
  },
  {
    id: 203,
    name: 'Leadership & Management Skills – Group B',
    status: 'Closed',
    public: true,
    dates: 'Apr 1 - May 30, 2026',
    created: '15/03/2026 - 09:00',
    createdBy: 'Tomás Herrero',
    lastModified: '30/05/2026 - 17:00',
    lastModifiedBy: 'Tomás Herrero',
    pathwayId: 1,
    pathwayName: 'Leadership & Management Skills',
    modules: [
      {
        name: 'Foundations of Leadership',
        description: 'Introduction to leadership frameworks, styles, and the core competencies required to lead teams effectively in modern organizations.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
      {
        name: 'Team Management & Communication',
        description: 'Strategies for building high-performing teams, managing conflict, delivering feedback, and communicating with clarity and impact.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
    ],
    learners: [
      { id: 6, name: 'Dakota Rivers', attendance: '2/2', timeSpent: '4h 00m', evaluationGrade: null, completed: true, enrollmentType: 'MANDATORY', enrollmentThrough: 'Process: Leadership program enrollments' },
      { id: 7, name: 'Zane Kalinski', attendance: '2/2', timeSpent: '4h 00m', evaluationGrade: null, completed: true, enrollmentType: 'MANDATORY', enrollmentThrough: 'Process: Leadership program enrollments' },
    ],
    trainers: [
      { id: 1, name: 'Sofia Perez' },
    ],
    enrollmentCapacity: 30,
  },
];
