// ─────────────────────────────────────────────────────────────────────────────
// AISHE INSTITUTES DIRECTORY & COURSES DATABASE
// All India Survey on Higher Education (AISHE) Verified Colleges & Schemes Mapping
// ─────────────────────────────────────────────────────────────────────────────

export const AISHE_DIRECTORY = [
  {
    aisheCode: 'U-0205',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    state: 'Jharkhand',
    district: 'East Singhbhum',
    type: 'Premier Institute (INI / Centrally Funded)',
    ranking: 'NIRF Top 100',
    nodalOfficer: {
      name: 'Dr. Rameshwar Sharma',
      designation: 'Dean Student Welfare & AISHE Nodal Officer',
      email: 'nodal.scholarship@nitjsr.ac.in',
      phone: '+91-657-228-6621',
      officeRoom: 'Administrative Block, Room 104'
    },
    eligibleSchemes: ['top-class', 'post-matric', 'nfst'],
    annualTuitionFee: '₹1,25,000',
    hostelFee: '₹34,000',
    programs: [
      { id: 'btech_cse', name: 'B.Tech - Computer Science & Engineering', durationYears: 4, feePerYear: 125000 },
      { id: 'btech_ece', name: 'B.Tech - Electronics & Communication', durationYears: 4, feePerYear: 125000 },
      { id: 'btech_mech', name: 'B.Tech - Mechanical Engineering', durationYears: 4, feePerYear: 120000 },
      { id: 'mtech_all', name: 'M.Tech - Advanced Engineering', durationYears: 2, feePerYear: 90000 },
      { id: 'phd_eng', name: 'Ph.D - Doctoral Research', durationYears: 5, feePerYear: 45000 }
    ]
  },
  {
    aisheCode: 'U-0207',
    name: 'Ranchi University',
    state: 'Jharkhand',
    district: 'Ranchi',
    type: 'State Public University',
    ranking: 'NAAC A Grade',
    nodalOfficer: {
      name: 'Prof. Animesh Sen',
      designation: 'Director Student Welfare & Scholarship In-charge',
      email: 'scholarship.cell@ranchiuniversity.ac.in',
      phone: '+91-651-220-8553',
      officeRoom: 'Morabadi Campus, Scholarship Verification Cell'
    },
    eligibleSchemes: ['post-matric', 'nfst'],
    annualTuitionFee: '₹18,500',
    hostelFee: '₹12,000',
    programs: [
      { id: 'msc_botany', name: 'M.Sc in Applied Mathematics & Computing', durationYears: 2, feePerYear: 18500 },
      { id: 'ma_tribal', name: 'M.A in English Literature & Linguistics', durationYears: 2, feePerYear: 12000 },
      { id: 'phd_arts', name: 'Ph.D - Doctoral Research', durationYears: 5, feePerYear: 25000 }
    ]
  },
  {
    aisheCode: 'S-JH-019',
    name: 'Kendriya Vidyalaya No. 1, Jamshedpur',
    state: 'Jharkhand',
    district: 'East Singhbhum',
    type: 'Central Model Secondary School',
    ranking: 'CBSE Affiliated Senior Secondary School',
    nodalOfficer: {
      name: 'Smt. Mary Sen',
      designation: 'Principal & Pre-Matric Nodal Officer',
      email: 'principal.kv1.jsr@gov.in',
      phone: '+91-6528-220194',
      officeRoom: 'Administrative Wing'
    },
    eligibleSchemes: ['pre-matric'],
    annualTuitionFee: '₹2,400',
    hostelFee: '₹0',
    programs: [
      { id: 'class_9', name: 'Class IX - Secondary School (CBSE)', durationYears: 1, feePerYear: 2400 },
      { id: 'class_10', name: 'Class X - Secondary Board (CBSE)', durationYears: 1, feePerYear: 2400 }
    ]
  },
  {
    aisheCode: 'U-0014',
    name: 'Indian Institute of Technology (IIT) Delhi',
    state: 'Delhi',
    district: 'South Delhi',
    type: 'Institute of National Importance (INI)',
    ranking: 'NIRF Rank 2',
    nodalOfficer: {
      name: 'Dr. V. K. Verma',
      designation: 'Associate Dean Student Affairs',
      email: 'scholarships@admin.iitd.ac.in',
      phone: '+91-11-2659-1721',
      officeRoom: 'Main Building, DSW Office'
    },
    eligibleSchemes: ['top-class', 'nfst'],
    annualTuitionFee: '₹2,00,000',
    hostelFee: '₹40,000',
    programs: [
      { id: 'btech_all', name: 'B.Tech All Disciplines', durationYears: 4, feePerYear: 200000 },
      { id: 'phd_all', name: 'Ph.D Research', durationYears: 5, feePerYear: 50000 }
    ]
  }
];

export const COLLEGE_APPLICATION_STORE = [
  {
    id: 'APP-CSSS-2026-NITJSR-9018',
    studentId: 'student_priya',
    studentName: 'Ananya Sharma',
    rollNumber: '2023UGCS042',
    apaarId: 'APAAR-2023-JH-77192',
    aadhaarMasked: 'XXXX-XXXX-9018',
    schemeId: 'top-class',
    schemeName: 'Central Top Class Education Scholarship',
    aisheCode: 'U-0205',
    instituteName: 'National Institute of Technology (NIT) Jamshedpur',
    courseName: 'B.Tech - Computer Science & Engineering (3rd Year)',
    totalFeeClaimed: '₹1,25,000 (Tuition) + ₹36,000 (Living Allowance)',
    appliedDate: '2026-09-20',
    status: 'under_review', // 'under_review' | 'verified_by_college' | 'deficiency_flagged' | 'rejected'
    collegeStatus: 'pending', // 'pending' | 'approved' | 'deficiency'
    remarks: 'Awaiting Institutional Bonafide and Current Semester Attendance Certificate validation.',
    attendancePercentage: '88.5%',
    bonafideValid: true,
    casteCertNo: 'JH/DOM/2024/491028',
    domicileCertNo: 'JH/DOM/2024/491028',
    incomeCertNo: 'JH/INC/2025/110482',
    incomeAmount: '₹2,10,000 / annum',
    digilockerVerified: true
  },
  {
    id: 'APP-NSP-2026-PRE5501',
    studentId: 'student_rohan',
    studentName: 'Rohan Sharma',
    rollNumber: 'KV1-2024-IX-019',
    apaarId: 'APAAR-2024-JH-88129',
    aadhaarMasked: 'XXXX-XXXX-3341',
    schemeId: 'pre-matric',
    schemeName: 'National Pre-Matric Scholarship Scheme',
    aisheCode: 'S-JH-019',
    instituteName: 'Kendriya Vidyalaya No. 1, Jamshedpur',
    courseName: 'Class IX - Secondary Board',
    totalFeeClaimed: '₹7,000 / year (Hosteller Allowance)',
    appliedDate: '2026-08-01',
    status: 'disbursed',
    collegeStatus: 'approved',
    remarks: 'Approved & Certified by Principal. Disbursed via PFMS.',
    attendancePercentage: '94.2%',
    bonafideValid: true,
    casteCertNo: 'JH/DOM/2024/491028',
    domicileCertNo: 'JH/DOM/2024/491028',
    incomeCertNo: 'JH/INC/2025/110482',
    incomeAmount: '₹2,10,000 / annum',
    digilockerVerified: true
  },
  {
    id: 'APP-NSP-2026-RU-3312',
    studentId: 'student_kavya',
    studentName: 'Kavya Sharma',
    rollNumber: '2025PGMA008',
    apaarId: 'APAAR-2021-JH-44019',
    aadhaarMasked: 'XXXX-XXXX-7128',
    schemeId: 'post-matric',
    schemeName: 'National Post-Matric Scholarship Scheme',
    aisheCode: 'U-0207',
    instituteName: 'Ranchi University',
    courseName: 'M.Sc in Applied Mathematics (Final Year)',
    totalFeeClaimed: '₹18,500 / year (Tuition + Maintenance)',
    appliedDate: '2026-09-18',
    status: 'under_review',
    collegeStatus: 'pending',
    remarks: 'Pending Nodal Officer Bonafide Verification at Campus.',
    attendancePercentage: '91.0%',
    bonafideValid: true,
    casteCertNo: 'JH/DOM/2024/491028',
    domicileCertNo: 'JH/DOM/2024/491028',
    incomeCertNo: 'JH/INC/2025/110482',
    incomeAmount: '₹2,10,000 / annum',
    digilockerVerified: true
  }
];
