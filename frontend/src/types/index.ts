export interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percentage: number;
  average_package: number;
  nirf_rank: number | null;
  description: string;
  established: number;
  type: string;
  campus_size: string;
  total_students: number;
  website: string;
  image_url: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  college_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Question {
  id: number;
  college_id: number;
  question: string;
  asked_by: string;
  created_at: string;
  answers: Answer[] | null;
}

export interface Answer {
  id: number;
  question_id: number;
  answer: string;
  answered_by: string;
  created_at: string;
}

export interface CollegeDetail extends College {
  reviews: Review[];
  questions: Question[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PredictResponse {
  success: boolean;
  prediction_label: string;
  exam: string;
  rank: number;
  data: College[];
}

export interface CollegeFilters {
  search: string;
  location: string;
  min_fees: string;
  max_fees: string;
  course: string;
  sort_by: string;
  order: string;
}
