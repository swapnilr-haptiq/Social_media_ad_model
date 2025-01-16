import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  ChartDataLabels
);

const RegionPerformance = () => {
  const [regionsData, setRegionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegionPerformance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/region-performance"
        );
        setRegionsData(response.data);
      } catch (err) {
        setError("Failed to fetch region data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionPerformance();
  }, []);

  const chartData = {
    labels: regionsData.map((data) => data.region),
    datasets: [
      {
        label: "Conversions",
        data: regionsData.map((data) => data.conversions),
        backgroundColor: "rgb(192, 75, 75)",
        borderWidth: 0,
        datalabels: { display: false },
      },
      {
        label: "Impressions",
        data: regionsData.map((data) => data.impressions),
        backgroundColor: "skyblue",
        borderWidth: 0,
        datalabels: { display: false },
      },
    ],
  };

  // Calculate dynamic max value for the y-axis
  const calculateMaxValue = () => {
    if (regionsData.length === 0) return 100; // Default max value
    const maxConversions = Math.max(
      ...regionsData.map((data) => data.conversions)
    );
    const maxImpressions = Math.max(
      ...regionsData.map((data) => data.impressions)
    );
    return Math.ceil(Math.max(maxConversions, maxImpressions) * 1.2); // Add 20% buffer
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h2
        style={{
          // textAlign: "center",
          marginBottom: "20px",
          marginLeft:"200px",
          fontWeight: "normal",
          // display: "flex",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        Region Performance
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Box
          style={{
            width: "80%",
            height: "400px",
            marginTop: "20px",
            padding: "20px",
            borderRadius: "8px",
            marginLeft: "180px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Bar
            data={chartData}
            options={{
              responsive: true,
              indexAxis: "x",
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Region",
                  },
                  ticks: {
                    color: "#333",
                    font: {
                      size: 14,
                    },
                  },
                  grid: {
                    display: true,
                    color: "#e0e0e0",
                    borderDash: [5, 5],
                    drawTicks: false,
                    lineWidth: 1,
                  },
                },
                y: {
                  beginAtZero: true,
                  max: calculateMaxValue(), // Dynamic max value
                  title: {
                    display: true,
                    text: "Conversions and Impressions",
                  },
                  ticks: {
                    color: "#333",
                    stepSize: 10,
                    callback: function (value) {
                      return value;
                    },
                  },
                  grid: {
                    display: true,
                    color: "#e0e0e0",
                    borderDash: [5, 5],
                    drawTicks: false,
                    lineWidth: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 20,
                    padding: 5,
                  },
                },
                datalabels: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      let value = tooltipItem.raw;
                      return `${tooltipItem.dataset.label}: ${value.toFixed(
                        2
                      )}`;
                    },
                  },
                },
              },
              layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10,
                },
              },
              barThickness: 30,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default RegionPerformance;
