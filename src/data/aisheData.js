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
      name: 'Dr. Rameshwar Oraon',
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
      name: 'Prof. Animesh Hembrom',
      designation: 'Director Tribal Studies & Scholarship In-charge',
      email: 'scholarship.cell@ranchiuniversity.ac.in',
      phone: '+91-651-220-8553',
      officeRoom: 'Morabadi Campus, Tribal Welfare Cell'
    },
    eligibleSchemes: ['post-matric', 'nfst'],
    annualTuitionFee: '₹18,500',
    hostelFee: '₹12,000',
    programs: [
      { id: 'msc_botany', name: 'M.Sc in Tribal Studies & Botany', durationYears: 2, feePerYear: 18500 },
      { id: 'ma_tribal', name: 'M.A in Tribal & Regional Languages (TRL)', durationYears: 2, feePerYear: 12000 },
      { id: 'phd_arts', name: 'Ph.D - Doctoral Research', durationYears: 5, feePerYear: 25000 }
    ]
  },
  {
    aisheCode: 'S-JH-019',
    name: 'Eklavya Model Residential School (EMRS), Khunti',
    state: 'Jharkhand',
    district: 'Khunti',
    type: 'MoTA Central Residential School',
    ranking: 'CBSE Affiliated Tribal Model School',
    nodalOfficer: {
      name: 'Smt. Mary Kerketta',
      designation: 'Principal & Pre-Matric Nodal Officer',
      email: 'principal.emrs.khunti@mota.gov.in',
      phone: '+91-6528-220194',
      officeRoom: 'EMRS Administrative Wing'
    },
    eligibleSchemes: ['pre-matric'],
    annualTuitionFee: '₹0 (100% Free MoTA Funded)',
    hostelFee: '₹0',
    programs: [
      { id: 'class_9', name: 'Class IX - Secondary School (CBSE)', durationYears: 1, feePerYear: 0 },
      { id: 'class_10', name: 'Class X - Secondary Board (CBSE)', durationYears: 1, feePerYear: 0 }
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
      name: 'Dr. V. K. Marandi',
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
    id: 'APP-MOTA-2026-NITJSR-9018',
    studentId: 'student_priya',
    studentName: 'Priya Munda',
    rollNumber: '2023UGCS042',
    apaarId: 'APAAR-2023-JH-77192',
    aadhaarMasked: 'XXXX-XXXX-9018',
    schemeId: 'top-class',
    schemeName: 'Top Class Education for ST Students',
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
    casteCertNo: 'JH/ST/2023/889104',
    incomeCertNo: 'JH/INC/2025/110482',
    incomeAmount: '₹1,85,000 / annum',
    digilockerVerified: true
  },
  {
    id: 'APP-NSP-2026-PRE5501',
    studentId: 'student_birsa',
    studentName: 'Birsa Munda',
    rollNumber: 'EMRS-2024-IX-019',
    apaarId: 'APAAR-2024-JH-88129',
    aadhaarMasked: 'XXXX-XXXX-3341',
    schemeId: 'pre-matric',
    schemeName: 'Pre-Matric Scholarship for ST Students',
    aisheCode: 'S-JH-019',
    instituteName: 'Eklavya Model Residential School (EMRS), Khunti',
    courseName: 'Class IX - Secondary Board',
    totalFeeClaimed: '₹7,000 / year (Hosteller Allowance)',
    appliedDate: '2026-08-01',
    status: 'disbursed',
    collegeStatus: 'approved',
    remarks: 'Approved & Certified by EMRS Principal. Disbursed via PFMS.',
    attendancePercentage: '94.2%',
    bonafideValid: true,
    casteCertNo: 'JH/ST/2023/889104',
    incomeCertNo: 'JH/INC/2025/110482',
    incomeAmount: '₹1,85,000 / annum',
    digilockerVerified: true
  },
  {
    id: 'APP-NSP-2026-RU-3312',
    studentId: 'student_sunita',
    studentName: 'Sunita Munda',
    rollNumber: '2025PGTRL008',
    apaarId: 'APAAR-2021-JH-44019',
    aadhaarMasked: 'XXXX-XXXX-7128',
    schemeId: 'post-matric',
    schemeName: 'Post-Matric Scholarship for ST Students',
    aisheCode: 'U-0207',
    instituteName: 'Ranchi University',
    courseName: 'M.Sc in Tribal Studies & Botany (Final Year)',
    totalFeeClaimed: '₹18,500 / year (Tuition + Maintenance)',
    appliedDate: '2026-09-18',
    status: 'under_review',
    collegeStatus: 'pending',
    remarks: 'Pending Nodal Officer Bonafide Verification at Morabadi Campus.',
    attendancePercentage: '91.0%',
    bonafideValid: true,
    casteCertNo: 'JH/ST/2023/889104',
    incomeCertNo: 'JH/INC/2025/110482',
    incomeAmount: '₹1,85,000 / annum',
    digilockerVerified: true
  }
];
