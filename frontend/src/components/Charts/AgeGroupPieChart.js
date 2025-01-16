import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  CircularProgress,
  Typography,
  Card,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const AgeGroupPieChart = () => {
  const [region, setRegion] = useState(""); // No default region initially
  const [regions, setRegions] = useState([]); // To store dynamic regions
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [topAgeGroup, setTopAgeGroup] = useState(""); // To store the top-performing age group
  const [topAgeGroupCTR, setTopAgeGroupCTR] = useState(null); // To store the CTR of the top age group

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/regional-ad-performance"
        );
        const { regions } = response.data; // Expecting a regions array
        setRegions(regions);
        if (regions.length > 0) {
          setRegion(regions[0]); // Set the first region as default
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        setErrorMessage("Error fetching regions.");
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/age-group-insights?region=${region}`
        );
        const data = response.data || [];
        setErrorMessage("");

        if (data.length > 0) {
          const topAgeGroupData = data.reduce((max, current) =>
            current.CTR > max.CTR ? current : max
          );
          setTopAgeGroup(topAgeGroupData.Age_Group);
          setTopAgeGroupCTR(topAgeGroupData.CTR);

          const preparedData = {
            labels: data.map((item) => item.Age_Group),
            datasets: [
              {
                label: "CTR (%)",
                data: data.map((item) => item.CTR),
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                ],
              },
            ],
          };

          setChartData(preparedData);
        } else {
          setErrorMessage("No data available for the selected region.");
        }
      } catch (error) {
        console.error("Error fetching age group insights:", error);
        setChartData(null);
        setErrorMessage(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (region) {
      fetchData();
    }
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
        Age Group Insights by Region
      </Typography>

      {/* Region Selection Dropdown */}
      <div style={{ marginBottom: "25px" }}>
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

      {/* Loading and Error Messages */}
      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress />
          <Typography variant="body1">Loading data...</Typography>
        </div>
      )}

      {errorMessage && (
        <div style={{ color: "red", textAlign: "center" }}>{errorMessage}</div>
      )}

      {/* Pie Chart */}
      {chartData ? (
        <div style={{ width: "500px", height: "400px", margin: "0 auto" }}>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  color: "white",
                  font: { weight: "bold", size: 14 },
                  formatter: (value, context) => {
                    if (typeof value === "number") {
                      const ageGroup =
                        context.chart.data.labels[context.dataIndex];
                      const ctr = value.toFixed(2);
                      if (ageGroup === topAgeGroup) {
                        return `${ageGroup} (Top)\n${ctr}%`;
                      }
                      return `${ageGroup}\n${ctr}%`;
                    }
                    return value;
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const ctr = tooltipItem.raw;
                      const ageGroup = tooltipItem.label;
                      if (typeof ctr === "number") {
                        return `${ageGroup}: ${ctr.toFixed(2)}%`;
                      }
                      return `${ageGroup}: N/A`;
                    },
                  },
                },
              },
            }}
            width={100}
            height={100}
          />
        </div>
      ) : (
        !loading && <div>No data available for the selected region</div>
      )}

      {topAgeGroup && typeof topAgeGroupCTR === "number" && (
        <Typography
          variant="body1"
          style={{ marginTop: "20px", color: "green" }}
        >
          In {region}, the top-responding age group is{" "}
          <span>{topAgeGroup}</span> with a CTR rate of{" "} 
          <span>{topAgeGroupCTR.toFixed(2)}%</span>.
        </Typography>
      )}
    </Card>
  );
};

export default AgeGroupPieChart;
