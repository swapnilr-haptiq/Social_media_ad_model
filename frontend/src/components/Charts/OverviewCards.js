import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";

const OverviewCards = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/global-metrics"
        );
        setOverviewData(response.data);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching overview data:", error);
        setErrorMessage(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography variant="body1">Loading overview data...</Typography>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
        <Typography variant="body1">{errorMessage}</Typography>
      </div>
    );
  }

  if (!overviewData) {
    return <Typography>No data available.</Typography>;
  }

  const {
    totalReach,
    engagementRate,
    budgetSpent,
    totalAds,
    totalRegions,
    topRegion,
    topAd,
  } = overviewData;

  const cardStyles = {
    padding: "20px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const hoverStyles = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  };

  return (
    <Grid container spacing={3} style={{ marginTop: "20px" }}>
      {/* Total Reach */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          style={cardStyles}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, hoverStyles)
          }
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyles)}
        >
          <Typography variant="h6" style={{ color: "#555" }}>
            Total Clicks
          </Typography>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#333" }}
          >
            {totalReach.toLocaleString()}
          </Typography>
        </Card>
      </Grid>

      {/* Engagement Rate */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          style={cardStyles}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, hoverStyles)
          }
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyles)}
        >
          <Typography variant="h6" style={{ color: "#555" }}>
            Engagement Rate
          </Typography>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#27ae60" }}
          >
            {engagementRate}%
          </Typography>
        </Card>
      </Grid>

      {/* Budget Spent */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          style={cardStyles}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, hoverStyles)
          }
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyles)}
        >
          <Typography variant="h6" style={{ color: "#555" }}>
            Budget Spent
          </Typography>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#c0392b" }}
          >
            ${budgetSpent.toLocaleString()}
          </Typography>
        </Card>
      </Grid>

      {/* Top Performing Ad */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          style={cardStyles}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, hoverStyles)
          }
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyles)}
        >
          <Typography variant="h6" style={{ color: "#555" }}>
            Top Performing Region
          </Typography>
          {topAd ? (
            <>
              <Typography
                variant="h5"
                style={{ fontWeight: "bold", color: "#8e44ad" }}
              >
                 {topAd.region || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ color: "#555" }}>
                Impressions: {topAd.impressions || 0}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" style={{ color: "#555" }}>
              No data available for top-performing ads.
            </Typography>
          )}
        </Card>
      </Grid>

      {/* Total Ads */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          style={cardStyles}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, hoverStyles)
          }
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyles)}
        >
          <Typography variant="h6" style={{ color: "#555" }}>
            Total Ads
          </Typography>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#2980b9" }}
          >
            {totalAds}
          </Typography>
        </Card>
      </Grid>

      {/* Total Regions */}
      <Grid item xs={12} sm={6} md={4}>
        <Card
          style={cardStyles}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, hoverStyles)
          }
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyles)}
        >
          <Typography variant="h6" style={{ color: "#555" }}>
            Total Regions
          </Typography>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#c0392b" }}
          >
            {totalRegions}
          </Typography>
        </Card>
      </Grid>

      {/* Top Performing Ad */}
    </Grid>
  );
};

export default OverviewCards;
