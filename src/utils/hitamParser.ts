export interface HitamStudentDemographics {
  isValid: boolean;
  rollNumber: string;
  email: string;
  collegeName: string;
  joiningYear: number;
  graduationYear: number;
  currentStudyYear: string;
  admissionType: string;
  programmeType: string;
  branchCode: string;
  branchName: string;
  seatNumber: string;
}

const BRANCH_MAP: Record<string, string> = {
  "02": "Electrical & Electronics Engineering (EEE)",
  "03": "Mechanical Engineering (MECH)",
  "04": "Electronics & Communication Engineering (ECE)",
  "05": "Computer Science & Engineering (CSE)",
  "66": "CSE - AI & Machine Learning (CSM)",
  "67": "CSE - Data Science (CSD)",
};

/**
 * Parses a roll number or @hitam.org email address and extracts student demographics.
 * Roll format: 2XE5ZYGHIJ (e.g. 24E51A66G7 or 24E51A0501)
 */
export function parseHitamCredentials(input: string): HitamStudentDemographics | null {
  if (!input) return null;
  let clean = input.trim().toUpperCase();

  // If email was entered, enforce @hitam.org and extract user portion
  if (clean.includes("@")) {
    const [user, domain] = clean.split("@");
    if (domain !== "HITAM.ORG") return null;
    clean = user;
  }

  // Regex format: 2X (yr) + E5 + Z (admission) + Y (programme) + GH (branch) + IJ (seat)
  const regex = /^(2\d)(E5)([15])([AM])(02|03|04|05|66|67)([0-9A-Z]{2})$/;
  const match = clean.match(regex);
  if (!match) return null;

  const [, yr, , adm, prog, br, seat] = match;
  const joiningYear = 2000 + parseInt(yr, 10);
  const isLateral = adm === "5";
  const graduationYear = joiningYear + (isLateral ? 3 : 4);

  const currentYear = new Date().getFullYear();
  const diff = currentYear - joiningYear + (isLateral ? 1 : 0);
  const yearNames = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const currentStudyYear = yearNames[Math.min(3, Math.max(0, diff))] || "Final Year / Alumni";

  const branchName =
    prog === "M" && br === "05"
      ? "International Twinning Programme (ITP - CSE)"
      : BRANCH_MAP[br] || `Branch ${br}`;

  const rollNumber = `${yr}E5${adm}${prog}${br}${seat}`;

  return {
    isValid: true,
    rollNumber,
    email: `${rollNumber.toLowerCase()}@hitam.org`,
    collegeName: "Hyderabad Institute of Technology and Management (HITAM)",
    joiningYear,
    graduationYear,
    currentStudyYear,
    admissionType: isLateral ? "Lateral Entry Student" : "Regular Student",
    programmeType: prog === "M" ? "International Twinning Programme (ITP)" : "Regular Branch",
    branchCode: br,
    branchName,
    seatNumber: seat,
  };
}
