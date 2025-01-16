import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Registering PointElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Select, MenuItem, FormControl } from "@mui/material";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Register PointElement
  Title,
  Tooltip,
  Legend
);

const AdTimePerformance = () => {
  const [adData, setAdData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdTimePerformance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/ad-time-performance`
        );
        console.log("Fetched Ad Data:", response.data);
        setAdData(response.data);

        // Extract unique regions
        const uniqueRegions = [
          ...new Set(
            response.data.flatMap((item) =>
              item.regions.map((regionData) => regionData.region)
            )
          ),
        ];
        setRegions(uniqueRegions);
      } catch (err) {
        setError("Failed to fetch ad time data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdTimePerformance();
  }, []);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  // Filter data based on the selected region
  const filteredData = selectedRegion
    ? adData.filter((ad) =>
        ad.regions.some((region) => region.region === selectedRegion)
      )
    : adData;

  // Aggregate total time spent for each ad based on the filtered data
  const aggregatedData = filteredData.map((ad) => ({
    adName: ad.adName,
    totalTimeSpent: ad.regions.reduce(
      (sum, region) =>
        sum + (region.region === selectedRegion ? region.timeSpent : 0),
      0
    ),
  }));

  // Prepare chart data
  const chartData = {
    labels: aggregatedData.map((ad) => ad.adName), // X-axis: Ad names
    datasets: [
      {
        label: "Total Time Spent (mins)",
        data: aggregatedData.map((ad) => ad.totalTimeSpent), // Y-axis: Total time spent
        fill: false, // Line chart with no fill
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        borderWidth: 3,
        tension: 0.4, // Smoothness of the line
        pointRadius: 6, // Larger points on the line
        pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
        pointBorderColor: "rgba(255, 255, 255, 1)", // Point border color
        pointBorderWidth: 2,
        hidden: !selectedRegion, // Hide line until a region is selected
      },
    ],
  };

  // Chart options with customized tooltips
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Ads" },
        ticks: { color: "#333", marginTop: "20px" },
      },
      y: {
        title: { display: true, text: "Time Spent (mins)" },
        beginAtZero: true,
        ticks: { color: "#333" },
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        enabled: true, // Enable tooltip
        mode: "nearest", // Show tooltip for the nearest point
        intersect: false, // Show tooltip even when not directly on the point
        callbacks: {
          label: function (context) {
            const adName = context.label; // Ad name
            const timeSpent = context.raw; // Time spent (Y value)
            return `${adName}: ${timeSpent.toFixed(2)} mins`; // Custom label format
          },
        },
      },
      datalabels: {
        display: false, // Disable data labels on the chart
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <div style={{ flex: 3, marginRight: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Ad Time Performance: Total Time Spent on Ads
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : adData.length === 0 ? (
          <p>No data available for the selected region.</p>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Region Dropdown */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            borderBottom: "2px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          Summary
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <FormControl style={{ width: "200px" }}>
            <Select
              value={selectedRegion}
              onChange={handleRegionChange}
              style={{
                background: "#f5f5f5",
                borderRadius: "5px",
              }}
            >
              <MenuItem value="">All Regions</MenuItem>
              {regions.map((regionName) => (
                <MenuItem key={regionName} value={regionName}>
                  {regionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Show summary after a region is selected */}
        {selectedRegion && (
          <div
            style={{
              marginTop: "10px",
              background: "#f9f9f9",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ul style={{ paddingLeft: "20px" }}>
              {aggregatedData.map((ad) => (
                <li
                  key={ad.adName}
                  style={{
                    background: "#f5f5f5",
                    padding: "5px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <strong>{ad.adName}</strong>: {ad.totalTimeSpent.toFixed(2)}{" "}
                  mins
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdTimePerformance;
