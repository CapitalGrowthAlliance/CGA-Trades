export interface Investor {
  rank: number;
  name: string;
  country: string;
  flag: string;
  equity: number;
  dailyRoi: number;
}

const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Alice", "Andrew", "Donna", "Joshua", "Emily", "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Dorothy", "Timothy", "Melissa"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

const countries = [
  { name: "USA", flag: "🇺🇸" },
  { name: "UK", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "India", flag: "🇮🇳" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Norway", flag: "🇳🇴" }
];

export const generateInvestors = (): Investor[] => {
  const investors: Investor[] = [];
  const maxEquity = 7400000;
  const minEquity = 37539;

  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    // Generate equity with a bias towards higher values for lower ranks
    // We'll sort them later, so just generate a range
    const equity = Math.floor(Math.random() * (maxEquity - minEquity + 1)) + minEquity;
    
    // Calculate ROI based on equity ranges
    let dailyRoi = 2.5;
    if (equity >= 1000000) {
      dailyRoi = 2.9;
    } else if (equity >= 50000) {
      dailyRoi = 2.7;
    }

    investors.push({
      rank: 0, // Will be set after sorting
      name: `${firstName} ${lastName.charAt(0)}.`,
      country: country.name,
      flag: country.flag,
      equity,
      dailyRoi
    });
  }

  // Sort by equity descending
  return investors
    .sort((a, b) => b.equity - a.equity)
    .map((investor, index) => ({
      ...investor,
      rank: index + 1
    }));
};

export const MOCK_INVESTORS = generateInvestors();
