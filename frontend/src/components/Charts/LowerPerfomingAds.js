import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const LowerPerformanceAds = () => {
  const [adsData, setAdsData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lower-performance ads data
  useEffect(() => {
    const fetchLowerPerformanceAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/lower-performance-ads"
        );
        setAdsData(response.data);

        // Extract unique regions for dropdown
        const uniqueRegions = [
          ...new Set(response.data.map((item) => item._id)),
        ];
        setRegions(uniqueRegions);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLowerPerformanceAds();
  }, []);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  // Filter ads data by selected region
  const filteredAdsData = selectedRegion
    ? adsData.filter((regionData) => regionData._id === selectedRegion)
    : adsData;

  return (
    <Card className="lower-performance-ads-card" style={{ padding: "20px" }}>
      {/* Title */}
      <Typography
        className="card-title"
        variant="h6"
        sx={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Lower Performance Ads by Region
      </Typography>

      {/* Region Filter */}
      <div className="region-filter" style={{ marginBottom: "20px" }}>
        <Select
          value={selectedRegion}
          onChange={handleRegionChange}
          displayEmpty
          className="region-select"
          style={{ minWidth: "200px" }}
        >
          <MenuItem value="">Select a Region</MenuItem>
          {regions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-text">Loading data, please wait...</div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : selectedRegion ? (
        filteredAdsData.length > 0 ? (
          filteredAdsData.map((regionData) => (
            <div key={regionData._id} className="region-data">
              <Typography
                className="region-title"
                variant="h6"
                style={{ marginBottom: "16px" }}
              >
                Region: {regionData._id}
              </Typography>
              <TableContainer component={Paper} className="ads-table-container">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-header">Ad Name</TableCell>
                      <TableCell className="table-header">CTR (%)</TableCell>
                      <TableCell className="table-header">
                        Engagement Rate (%)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regionData.ads.map((ad, index) => {
                      const ctr =
                        ad.Impressions > 0
                          ? ((ad.Clicks / ad.Impressions) * 100).toFixed(2)
                          : 0;

                      // Ensure Engagement is a valid number
                      const engagementRate =
                        ad.Impressions > 0 && ad.Engagement
                          ? ((ad.Engagement / ad.Impressions) * 100).toFixed(2)
                          : 0;

                      return (
                        <TableRow key={index} className="table-row">
                          <TableCell className="table-cell">
                            {ad.Ad_name}
                          </TableCell>
                          <TableCell className="table-cell">{ctr}%</TableCell>
                          <TableCell className="table-cell">
                            {engagementRate}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))
        ) : (
          <div className="no-data-text">
            No lower performance ads found for the selected region.
          </div>
        )
      ) : (
        <div className="select-region-text">
          Please select a region to view lower-performance ads.
        </div>
      )}
    </Card>
  );
};

export default LowerPerformanceAds;
