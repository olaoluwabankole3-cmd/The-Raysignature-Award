export interface Nominee {
  id: string;
  name: string;
  role: string;
  image: string;
  contributions: string;
}

export interface VotingCategory {
  id: string;
  title: string;
  description: string;
  nominees: Nominee[];
}
