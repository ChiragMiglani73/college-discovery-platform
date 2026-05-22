import axios from "axios";

import type {
  College,
  CollegeDetail,
  CollegeFilters,
  PaginatedResponse,
  ApiResponse,
  PredictResponse,
} from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const collegeApi = {
  getColleges: async (
    filters: Partial<CollegeFilters> & {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<College>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(
        ([, v]) => v !== "" && v !== undefined
      )
    );

    const { data } = await api.get(
      "/colleges",
      {
        params,
      }
    );

    return data;
  },
  getCollegeById: async (
    id: number
  ): Promise<ApiResponse<CollegeDetail>> => {
    const { data } = await api.get(
      `/colleges/${id}`
    );

    return data;
  },


  compareColleges: async (
    ids: number[]
  ): Promise<ApiResponse<College[]>> => {
    const { data } = await api.get(
      "/colleges/compare",
      {
        params: {
          ids: ids.join(","),
        },
      }
    );

    return data;
  },

  predictColleges: async (
    exam: string,
    rank: number
  ): Promise<PredictResponse> => {
    const { data } = await api.get(
      "/colleges/predict",
      {
        params: {
          exam,
          rank,
        },
      }
    );

    return data;
  },

  getLocations: async (): Promise<
    ApiResponse<string[]>
  > => {
    const { data } = await api.get(
      "/colleges/locations"
    );

    return data;
  },

  getCourses: async (): Promise<
    ApiResponse<string[]>
  > => {
    const { data } = await api.get(
      "/colleges/courses"
    );

    return data;
  },

  addQuestion: async (
    college_id: number,
    question: string,
    asked_by?: string
  ) => {
    const { data } = await api.post(
      "/questions",
      {
        college_id,
        question,
        asked_by,
      }
    );

    return data;
  },

  addAnswer: async (
    question_id: number,
    answer: string,
    answered_by?: string
  ) => {
    const { data } = await api.post(
      `/questions/${question_id}/answers`,
      {
        answer,
        answered_by,
      }
    );

    return data;
  },


  addReview: async (
    college_id: number,
    rating: number,
    comment: string,
    user_name?: string
  ) => {
    const { data } = await api.post(
      "/reviews",
      {
        college_id,
        rating,
        comment,
        user_name,
      }
    );

    return data;
  },

  saveCollege: async (
    collegeId: number
  ) => {
    const { data } = await api.post(
      `/saved/${collegeId}`
    );

    return data;
  },

  getSavedColleges: async (): Promise<
    ApiResponse<College[]>
  > => {
    const { data } = await api.get(
      "/saved"
    );

    return data;
  },

  removeSavedCollege: async (
    collegeId: number
  ) => {
    const { data } = await api.delete(
      `/saved/${collegeId}`
    );

    return data;
  },

saveComparison: async (
  collegeIds: number[]
) => {
  const { data } = await api.post(
    "/comparisons",
    {
      collegeIds,
    }
  );

  return data;
},

getSavedComparisons: async () => {
  const { data } = await api.get(
    "/comparisons"
  );

  return data;
},
};


export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string
  ) => {
    const { data } = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    return data;
  },

  login: async (
    email: string,
    password: string
  ) => {
    const { data } = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    return data;
  },
};

export default api;