import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Card,
  Grid,
} from "@mui/material";
import axios from "axios";

const BudgetOptimization = () => {
  const [budgetRecommendations, setBudgetRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Select Region");
  const [regions, setRegions] = useState([]);

  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://your-production-backend-url.com/api"
      : "http://localhost:5000/api";

  // Fetch available regions dynamically
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${baseURL}/budget-optimization`, {
          params: { region: "" }, // Fetch data for all regions to determine available regions
        });
        const allRegions = response.data.regions;
        setRegions(allRegions); // Save all regions for dropdown
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  // Fetch budget recommendations based on the selected region
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedRegion !== "Select Region") {
        setLoading(true);
        try {
          const response = await axios.get(`${baseURL}/budget-optimization`, {
            params: { region: selectedRegion },
          });

          setBudgetRecommendations(response.data.recommendations || []);
          setBudgetError("");
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          setBudgetError(
            error.response?.data?.message || "Failed to load recommendations."
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [selectedRegion]);

  return (
    <Card className="card" style={{ padding: "20px", width: "100%" }}>
      <Typography
        variant="h6"
        sx={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Budget Optimization
      </Typography>

      {/* Region Selection Dropdown */}
      <div style={{ marginBottom: "20px", width: "100%" }}>
        <Select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{ minWidth: "200px", width: "100%" }}
        >
          <MenuItem value="Select Region">Select Region</MenuItem>
          {regions.map((region, index) => (
            <MenuItem key={index} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Loading and Error Messages */}
      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress />
          <Typography variant="body1">Loading recommendations...</Typography>
        </div>
      )}

      {budgetError && (
        <Typography
          color="error"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          {budgetError}
        </Typography>
      )}

      {!loading && budgetRecommendations.length > 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div style={{ marginTop: "40px", width: "100%" }}>
              <Typography variant="h5" style={{ marginBottom: "20px" }}>
                Budget Recommendations for {selectedRegion}
              </Typography>
              <table
                className="table-container"
                style={{ width: "100%", tableLayout: "auto" }}
              >
                <thead>
                  <tr>
                    <th className="table-cell">Ad Name</th>
                    <th className="table-cell">CTR (%)</th>
                    <th className="table-cell">Before Budget</th>
                    <th className="table-cell">Action</th>
                    <th className="table-cell">Recommended Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetRecommendations.map((rec, index) => (
                    <tr key={index}>
                      <td className="table-cell">{rec.Ad_name}</td>
                      <td className="table-cell">{rec.CTR}</td>
                      <td className="table-cell">${rec.BeforeBudget}</td>
                      <td className="table-cell">{rec.Action}</td>
                      <td className="table-cell">${rec.RecommendedBudget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      ) : (
        !loading &&
        !budgetError && (
          <Typography></Typography>
        )
      )}
    </Card>
  );
};

export default BudgetOptimization;
