import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth API calls
export const signupUser = (userData) =>
  API.post("/user/user", {
    username: userData.fullName,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phone,
  });

export const loginUser = (credentials) =>
  API.post("/user/loginuser", {
    email: credentials.email,
    password: credentials.password,
  });

export const forgotPassword = (email) =>
  API.post("/user/forgotpassword", {
    email,
  });

export const verifyOtp = (email, otp) =>
  API.post("/user/verifyotp", {
    email,
    otp,
  });

export const resetPassword = (email, otp, newPassword) =>
  API.post("/user/resetpassword", {
    email,
    otp,
    password: newPassword,
  });

export const getMe = () => API.get("/user/me");

// Admin Settings API calls
export const updateUserProfile = (userId, userData) =>
  API.put(`/user/updateuserbyid/${userId}`, userData);

export const getSettings = () => API.get("/admin/settings");
export const updateSettings = (settings) =>
  API.put("/admin/settings", settings);

export const getAllUsers = () => API.get("/user/getalluser");

export const getUserById = (userId) => API.get(`/user/getusersbyid/${userId}`);

export const deleteUser = (userId) =>
  API.delete(`/user/deleteuserbyid/${userId}`);

// Restaurant/Venue API calls
export const createRestaurant = (restaurantData) => {
  if (restaurantData instanceof FormData) {
    return API.post("/venue", restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/venue", restaurantData);
};

export const createVenue = createRestaurant;

export const updateRestaurant = (id, restaurantData) => {
  if (restaurantData instanceof FormData) {
    return API.put(`/venue/${id}`, restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.put(`/venue/${id}`, restaurantData);
};

export const updateVenue = updateRestaurant;

export const deleteRestaurant = (id) => API.delete(`/venue/${id}`);

export const deleteVenue = deleteRestaurant;

export const getAllRestaurants = (params) => API.get("/venue", { params });

export const getAllVenues = getAllRestaurants;

export const getRestaurantById = (id, params) =>
  API.get(`/restaurant/${id}`, { params });

// Get bookings for a specific restaurant on a date
export const getRestaurantBookings = (restaurantId, date) =>
  API.get("/booking/restaurant", { params: { restaurantId, date } });

export const getVenueBookings = getRestaurantBookings;

// Booking API calls
export const createBooking = (bookingData) => API.post("/booking", bookingData);

export const getUserBookings = () => API.get("/booking/user");

export const getAllBookings = () => API.get("/booking");

export const changePassword = (currentPasswordOrObj, newPassword) => {
  if (typeof currentPasswordOrObj === "object") {
    const { currentPassword, newPassword: np } = currentPasswordOrObj;
    return API.post("/user/changepassword", {
      currentPassword,
      newPassword: np,
    });
  }
  return API.post("/user/changepassword", {
    currentPassword: currentPasswordOrObj,
    newPassword,
  });
};

export const updateBookingStatus = (id, status) =>
  API.put(`/booking/${id}/status`, { status });

// Dashboard stats API
// (defined later under STATS API section — keep single declaration)

// ============== CUISINE API ==============
export const getAllCuisines = () => API.get("/cuisine");

export const getCuisineById = (id) => API.get(`/cuisine/${id}`);

export const createCuisine = (cuisineData) => API.post("/cuisine", cuisineData);

export const updateCuisine = (id, cuisineData) =>
  API.put(`/cuisine/${id}`, cuisineData);

export const deleteCuisine = (id) => API.delete(`/cuisine/${id}`);

export const getRestaurantsByCuisine = (cuisineId) =>
  API.get(`/cuisine/${cuisineId}/restaurants`);

// Restaurant-Cuisine association
export const assignCuisinesToRestaurant = (restaurantId, cuisineIds) =>
  API.post(`/restaurant/${restaurantId}/cuisines`, { cuisineIds });

export const getRestaurantCuisines = (restaurantId) =>
  API.get(`/restaurant/${restaurantId}/cuisines`);

export const removeCuisineFromRestaurant = (restaurantId, cuisineId) =>
  API.delete(`/restaurant/${restaurantId}/cuisines/${cuisineId}`);

// ============== DISH/MENU API ==============
export const getDishesByRestaurant = (restaurantId) =>
  API.get("/dishes/restaurant", { params: { restaurantId } });

export const getAllDishes = (params) => API.get("/dishes", { params });

export const getDishById = (id) => API.get(`/dishes/${id}`);

export const createDish = (dishData) => {
  if (dishData instanceof FormData) {
    return API.post("/dishes", dishData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.post("/dishes", dishData);
};

export const updateDish = (id, dishData) => {
  if (dishData instanceof FormData) {
    return API.put(`/dishes/${id}`, dishData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return API.put(`/dishes/${id}`, dishData);
};

export const deleteDish = (id) => API.delete(`/dishes/${id}`);

// ============== REVIEW API ==============
export const createReview = (reviewData) => API.post("/reviews", reviewData);

export const getRestaurantReviews = (restaurantId, params) =>
  API.get(`/reviews/restaurant/${restaurantId}`, { params });

export const getUserReviewForRestaurant = (restaurantId) =>
  API.get(`/reviews/user/${restaurantId}`);

export const updateReview = (id, reviewData) =>
  API.put(`/reviews/${id}`, reviewData);

export const deleteReview = (id) => API.delete(`/reviews/${id}`);

export const getAllReviews = (params) => API.get("/reviews", { params });

// ============== JOB PORTAL API ==============

// Job API calls
export const getAllJobs = (params) => API.get("/jobs", { params });

export const searchJobs = (params) => API.get("/jobs/search", { params });

export const getJobById = (id) => API.get(`/jobs/${id}`);

export const createJob = (jobData) => API.post("/jobs", jobData);

export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);

export const deleteJob = (id) => API.delete(`/jobs/${id}`);

export const closeJob = (id) => API.patch(`/jobs/${id}/close`);

export const getJobsByCompany = (companyId, params) =>
  API.get(`/jobs/company/${companyId}`, { params });

// Company API calls
export const getAllCompanies = (params) => API.get("/companies", { params });

export const getCompanyById = (id) => API.get(`/companies/${id}`);

export const createCompany = (companyData) => API.post("/companies", companyData);

export const updateCompany = (id, companyData) =>
  API.put(`/companies/${id}`, companyData);

export const deleteCompany = (id) => API.delete(`/companies/${id}`);

export const getMyCompany = () => API.get("/companies/profile/me");

export const getCompanyStats = () => API.get("/companies/stats/overview");

// Application API calls
export const submitApplication = (applicationData) => {
  // If applicationData is FormData (for file uploads), don't set Content-Type
  // Axios will set the correct multipart/form-data with boundary
  if (applicationData instanceof FormData) {
    return API.post("/applications/submit", applicationData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  // Regular JSON submission
  return API.post("/applications/submit", applicationData);
};

export const getApplicationsByJob = (jobId, params) =>
  API.get(`/applications/job/${jobId}`, { params });

export const getApplicationsByUser = (userId, params) =>
  API.get(`/applications/user/${userId}`, { params });

export const getApplicationById = (id) => API.get(`/applications/${id}`);

export const updateApplicationStatus = (id, status) =>
  API.patch(`/applications/${id}/status`, { status });

export const withdrawApplication = (id) => API.patch(`/applications/${id}/withdraw`);

export const deleteApplication = (id) => API.delete(`/applications/${id}`);

export const getApplicationStats = () => API.get("/applications/stats/overview");

// ============== STATS API ==============
// Public stats - home page
export const getPublicStats = () => API.get("/stats");

// Admin dashboard stats
export const getDashboardStats = () => API.get("/stats/dashboard");

export const getUserApplications = () => API.get("/stats/my-applications");

export const getAllApplications = (params) => API.get("/stats/all-applications", { params });

// Saved jobs API
export const saveJob = (jobId) => API.post("/stats/save-job", { jobId });

export const removeSavedJob = (jobId) => API.delete(`/stats/saved-jobs/${jobId}`);

export const getSavedJobs = () => API.get("/stats/saved-jobs");

// ============== USER CV UPLOAD ==============
export const uploadCV = (formData) => API.post("/user/upload-cv", formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const getUserProfile = () => API.get("/user/profile");

export default API;
