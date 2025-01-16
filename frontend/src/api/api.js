// import axios from "axios";

// export const fetchRegionalAdPerformance = async (region) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:5000/api/regional-ad-performance?region=${region}`
//     );
      
//     return response.data || [];
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error fetching data");
//   }
    
// };



// src/services/api.js// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Use your base API URL
});

export const fetchRegionalAdPerformance = (region) => {
  return api.get(`/regional-ad-performance?region=${region}`);
};

export const getBudgetOptimization = (region) => {
  return api.get(`/budget-optimization?region=${region}`);
};

export const getABTestResults = (region, adA, adB) => {
  return api.get(`/ab-test-results?region=${region}&ads=${adA},${adB}`);
};

export const getLowerPerformanceAds = (region) => {
  return api.get(`/lower-performance-ads?region=${region}`);
};

export const getTopPerformanceAds = (region) => {
  return api.get(`//top-performance-ads?region=${region}`);
};

export const getRegionPerformance = (region) => {
  return api.get(`/region-performance?region=${region}`);
};

// api.js
export const getAdTimeInsights = (adName) => {
    return api.get(`/ad-time-performance?adName=${adName}`);
};

export const getOverviewMetrics = () => {
  return api.get(`/overview-metrics`);
};


export const getAgeGroupInsights = (region) => {
    return api.get(`/age-group-insights?region=${region}`);
    
    
};

