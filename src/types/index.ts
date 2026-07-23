export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
  createdAt: string;
  is_checked_in: boolean;
  checkedInAt?: string | null;
}

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
}

export interface CheckInResult {
  success: boolean;
  alreadyCheckedIn: boolean;
  guest?: Guest | null;
  error?: string | null;
}
