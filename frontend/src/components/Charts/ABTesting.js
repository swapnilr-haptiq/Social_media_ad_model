import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Card,
} from "@mui/material";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip // Enable tooltips
);

const ABTesting = () => {
  const [region, setRegion] = useState(""); // Initialize with an empty string
  const [selectedAdA, setSelectedAdA] = useState("");
  const [selectedAdB, setSelectedAdB] = useState("");
  const [regions, setRegions] = useState([]);
  const [ads, setAds] = useState([]);
  const [abTestResults, setAbTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchABTestResults = async () => {
    if (!selectedAdA || !selectedAdB || !region) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/ab-test-results?region=${region}&ads=${selectedAdA},${selectedAdB}`
      );
      const { results } = response.data;
      setAbTestResults(results);
      setError("");
    } catch (err) {
      setError("Failed to fetch A/B test results.");
      setAbTestResults(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionsAndAds = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/regions");
      const { regions } = response.data;
      setRegions(regions);
      setError("");

      // Set the default region to the first available region after fetching
      if (regions.length > 0) {
        setRegion(regions[0]); // Set the default region
      }
    } catch (err) {
      setError("Failed to fetch regions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdsForRegion = async (region) => {
    if (!region) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/ads?region=${region}`
      );
      const { ads } = response.data;
      setAds(ads);
      setError("");
    } catch (err) {
      setError("Failed to fetch ads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionsAndAds();
  }, []);

  useEffect(() => {
    if (region) {
      fetchAdsForRegion(region); // Fetch ads when a region is selected
    }
  }, [region]);

  useEffect(() => {
    // Clear results when the region or selected ads change
    setAbTestResults(null);
    fetchABTestResults();
  }, [region, selectedAdA, selectedAdB]);

  const chartData = abTestResults
    ? {
        labels: abTestResults.map((item) => item.Ad_name),
        datasets: [
          {
            label: "Clicks",
            data: abTestResults.map((item) => item.Clicks),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Impressions",
            data: abTestResults.map((item) => item.Impressions),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          {
            label: "Conversions",
            data: abTestResults.map((item) => item.Conversions),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      }
    : {};

 const chartOptions = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
     legend: { position: "top" },
     title: { display: true, text: `Ad Performance in ${region}` },
     tooltip: { enabled: true }, // Enable tooltips
     // Disable datalabels if it's enabled
     datalabels: {
       display: false,
     },
   },
   scales: { y: { beginAtZero: true } },
 };


  return (
    <Card
      style={{
        textAlign: "center",
        marginRight: "180px", // Added margin-right of 40px
      }}
    >
      <Typography variant="h6" gutterBottom>
        Compare Ads
      </Typography>

      {/* Region Selection Dropdown */}
      <Select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        displayEmpty
        disabled={loading} // Disable dropdown when loading
        style={{
          margin: "10px 0", // Add vertical margin for spacing
          minWidth: "100px", // Set a minimum width for uniformity
        }}
      >
        {regions.map((regionName) => (
          <MenuItem key={regionName} value={regionName}>
            {regionName}
          </MenuItem>
        ))}
      </Select>

      {/* Ad A selection */}
      <Select
        value={selectedAdA}
        onChange={(e) => setSelectedAdA(e.target.value)}
        disabled={loading || ads.length === 0} // Disable dropdown when loading or no ads
        style={{
          margin: "10px 0", // Add vertical margin for spacing
          minWidth: "100px", // Set a minimum width for uniformity
        }}
      >
        {ads.map((ad) => (
          <MenuItem key={ad} value={ad}>
            {ad}
          </MenuItem>
        ))}
      </Select>

      {/* Ad B selection */}
      <Select
        value={selectedAdB}
        onChange={(e) => setSelectedAdB(e.target.value)}
        disabled={loading || ads.length === 0} // Disable dropdown when loading or no ads
        style={{
          margin: "10px 0", // Add vertical margin for spacing
          minWidth: "100px", // Set a minimum width for uniformity
        }}
      >
        {ads.map((ad) => (
          <MenuItem key={ad} value={ad}>
            {ad}
          </MenuItem>
        ))}
      </Select>

      {loading && <CircularProgress />}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {abTestResults && (
        <div style={{ width: "500px", height: "354px", margin: "0 auto" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </Card>
  );
};

export default ABTesting;
