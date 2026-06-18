export interface ScheduleSlot {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface ModuleSchedule {
  slots: ScheduleSlot[];
  location: string;
  teamsEnabled: boolean;
  autoVirtualRoom: boolean;
  virtualRoomUrl: string;
  sendReminder: boolean;
  reminderDays: number;
}

export type ModuleStatus = 'PENDING' | 'SCHEDULED' | 'ONGOING' | 'ENDED';

export interface LmsModule {
  name: string;
  description: string;
  duration: number | null;
  completionCriteria: string;
  moduleStatus?: ModuleStatus;
  schedule?: ModuleSchedule;
}

export interface LmsEvent {
  id: number;
  name: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  catalogue: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  // Form / detail fields
  completionCriteria?: string;
  attendancePercentage?: number;
  evaluable?: boolean;
  cutoffScore?: number;
  description?: string;
  tags?: string[];
  skills?: { name: string; level: string }[];
  country?: string;
  modules?: LmsModule[];
}

export const EVENTS_MOCK: LmsEvent[] = [
  {
    id: 1,
    name: 'Webinar | Expert Panel Discussion on Emerging Trends in UX/UI Design',
    status: 'Draft',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 100,
    evaluable: true,
    cutoffScore: 80,
    description: 'An expert panel discussion covering the latest trends in UX/UI design.',
    tags: ['UX', 'UI Design'],
    skills: [{ name: 'UX Research', level: 'Intermediate' }],
    country: 'Spain',
  },
  {
    id: 2,
    name: 'Presential Bootcamp: Intensive Workshop on UX/UI Design Principles',
    status: 'Published',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 80,
    evaluable: false,
    cutoffScore: 70,
    description: 'Intensive bootcamp on UX/UI design principles.',
    tags: ['UX', 'Bootcamp'],
    skills: [{ name: 'Prototyping', level: 'Advanced' }],
    country: 'Spain',
    modules: [
      {
        name: 'UX Foundations & Design Thinking',
        description: 'An introduction to user-centered design, UX principles, and the design thinking framework. Participants learn how to identify user needs, define problems, and understand the role of UX in creating successful digital products.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
      {
        name: 'User Research & Experience Mapping',
        description: 'Participants explore user research techniques and learn how to transform insights into actionable design artifacts including personas, empathy maps, and user journeys. The session emphasizes understanding user behaviors, motivations, and pain points.',
        duration: 120,
        completionCriteria: 'By attendance',
      },
      {
        name: 'UX Design Sprint: Information Architecture, User Flows & Wireframing',
        description: 'This intensive session walks participants through organizing information, creating user flows, and wireframing interfaces. Participants will create user personas and customer journey maps to visualize user needs and craft prototyping artifacts.',
        duration: 240,
        completionCriteria: 'By attendance',
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
  },
  {
    id: 3,
    name: 'The Coffee Break Effect: Enhancing Workplace Productivity and Well-Being',
    status: 'Published',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 80,
    evaluable: false,
    cutoffScore: 70,
    description: 'Explore how workplace breaks enhance productivity and employee well-being.',
    tags: ['Productivity', 'Wellness'],
    skills: [],
    country: 'Spain',
  },
  {
    id: 4,
    name: 'Design Thinking and Human-Centered Design',
    status: 'Published',
    catalogue: 'Netex Catálogo',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 90,
    evaluable: true,
    cutoffScore: 75,
    description: 'Design thinking methodologies and human-centered design practices.',
    tags: ['Design Thinking'],
    skills: [{ name: 'Design Thinking', level: 'Intermediate' }],
    country: 'Spain',
  },
  {
    id: 5,
    name: 'User Research Methods',
    status: 'Unpublished',
    catalogue: 'Netex Catálogo',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 80,
    evaluable: true,
    cutoffScore: 80,
    description: 'Core methods for conducting effective user research.',
    tags: ['Research', 'UX'],
    skills: [{ name: 'User Research', level: 'Intermediate' }],
    country: 'Spain',
  },
  {
    id: 6,
    name: 'The Mind-Body Break: A Holistic Approach to Workplace Wellness',
    status: 'Published',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 75,
    evaluable: false,
    cutoffScore: 70,
    description: 'A holistic approach to integrating wellness into the workplace.',
    tags: ['Wellness'],
    skills: [],
    country: 'Spain',
  },
  {
    id: 7,
    name: 'From Burnout to Balance: Mastering Workplace Stress',
    status: 'Published',
    catalogue: 'Netex Catálogo',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 80,
    evaluable: false,
    cutoffScore: 70,
    description: 'Strategies to manage and recover from workplace burnout.',
    tags: ['Stress', 'Wellness'],
    skills: [],
    country: 'Spain',
  },
  {
    id: 8,
    name: 'Leading with Wellbeing: For Managers and Team Leaders',
    status: 'Draft',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 100,
    evaluable: true,
    cutoffScore: 80,
    description: 'Leadership program focused on embedding wellbeing into management practice.',
    tags: ['Leadership', 'Wellness'],
    skills: [{ name: 'Leadership', level: 'Advanced' }],
    country: 'Spain',
  },
  {
    id: 9,
    name: 'Healthy Teams, Productive Teams: A Guide to Collective Wellness',
    status: 'Draft',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 80,
    evaluable: false,
    cutoffScore: 70,
    description: 'How collective wellness drives team productivity.',
    tags: ['Team', 'Wellness'],
    skills: [],
    country: 'Spain',
  },
  {
    id: 10,
    name: 'Psychological Safety at Work: Foundations for Wellbeing',
    status: 'Draft',
    catalogue: '-',
    created: '12/07/2022 - 12:30',
    createdBy: 'Tomás Herrero',
    lastModified: '12/07/2022 - 12:30',
    lastModifiedBy: 'Tomás Herrero',
    completionCriteria: 'By attendance percentage',
    attendancePercentage: 80,
    evaluable: true,
    cutoffScore: 75,
    description: 'Building psychological safety as a foundation for a healthy workplace.',
    tags: ['Psychology', 'Safety'],
    skills: [{ name: 'Emotional Intelligence', level: 'Intermediate' }],
    country: 'Spain',
  },
];
