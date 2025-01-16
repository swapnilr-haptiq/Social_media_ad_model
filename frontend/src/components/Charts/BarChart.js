import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  CircularProgress,
  Typography,
  Card,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [region, setRegion] = useState("");
  const [regions, setRegions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const groupAndSummarizeData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const adName = item.Ad_name || "Unknown";
      if (!acc[adName]) {
        acc[adName] = {
          Ad_name: adName,
          Clicks: 0,
          Impressions: 0,
          Conversions: 0,
        };
      }
      acc[adName].Clicks += item.Clicks || 0;
      acc[adName].Impressions += item.Impressions || 0;
      acc[adName].Conversions += item.Conversions || 0;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  useEffect(() => {
    const fetchRegionsAndData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/regional-ad-performance"
        );
        const { regions, data } = response.data;

        if (regions && Array.isArray(regions)) {
          setRegions(regions);
          if (regions.length > 0) {
            setRegion(regions[0]); // Set the first region as default
          }
        }

        if (data && Array.isArray(data) && !region) {
          const groupedData = groupAndSummarizeData(data);

          const preparedData = {
            labels: groupedData.map((item) => item.Ad_name),
            datasets: [
              {
                label: "Clicks",
                data: groupedData.map((item) => item.Clicks),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
              {
                label: "Impressions",
                data: groupedData.map((item) => item.Impressions),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
              {
                label: "Conversions",
                data: groupedData.map((item) => item.Conversions),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
              },
            ],
          };

          setChartData(preparedData);
        }
      } catch (error) {
        console.error("Error fetching ads data:", error);
        setErrorMessage(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegionsAndData();
  }, []);

  useEffect(() => {
    if (!region) return;

    const fetchRegionData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/regional-ad-performance?region=${region}`
        );
        const data = response.data?.data || [];
        setErrorMessage("");

        const groupedData = groupAndSummarizeData(data);

        const preparedData = {
          labels: groupedData.map((item) => item.Ad_name),
          datasets: [
            {
              label: "Clicks",
              data: groupedData.map((item) => item.Clicks),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Impressions",
              data: groupedData.map((item) => item.Impressions),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "Conversions",
              data: groupedData.map((item) => item.Conversions),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        };

        setChartData(preparedData);
      } catch (error) {
        console.error("Error fetching region data:", error);
        setErrorMessage(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [region]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Ad Performance in ${region}` },
      // Ensure datalabels are not shown on the bars
      datalabels: {
        display: false, // Disable data labels
      },
      tooltip: {
        enabled: true, // Keep tooltips enabled for interactivity
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card style={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Ad Performance
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          displayEmpty
        >
          {regions.length > 0 ? (
            regions.map((regionName) => (
              <MenuItem key={regionName} value={regionName}>
                {regionName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No regions available</MenuItem>
          )}
        </Select>
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress />
          <Typography variant="body1">Loading data...</Typography>
        </div>
      )}
      {errorMessage && (
        <div style={{ color: "red", textAlign: "center" }}>{errorMessage}</div>
      )}

      {chartData ? (
        <div style={{ width: "500px", height: "400px", margin: "0 auto" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        !loading && <div>No data available for the selected region</div>
      )}
    </Card>
  );
};

export default BarChart;
