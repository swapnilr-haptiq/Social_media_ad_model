import React from "react";
import BarChart from "./Charts/BarChart";
import AgeGroupPieChart from "./Charts/AgeGroupPieChart";
import BudgetOptimization from "./Charts/BudgetOptimization";
import ABTesting from "./Charts/ABTesting";
import LowerPerformanceAds from "./Charts/LowerPerfomingAds";
import TopPerformanceAds from "./Charts/TopPerformingAds";
import RegionPerformance from "./Charts/RegionPerformance";
import AdTimePerformance from "./Charts/AdTimePerformance";
import Navbar from "./Charts/Navbar";
import OverviewCards from "./Charts/OverviewCards";
import Sidebar from "./Charts/SideBar";
import "../css/style.css"; // Import the styling file

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="content-container">
          <div className="top-row">
            <div className="overview-cards">
              <OverviewCards />
            </div>
            <div className="ad-time-performance" style={{ marginTop: "70px" }}>
              <AdTimePerformance />
            </div>
          </div>
          <div
            className="charts-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "50px",
            }}
          >
            <div
              className="bar-chart"
              style={{ flex: "1", marginRight: "20px" }}
            >
              <BarChart />
            </div>
            <div className="age-group-pie-chart" style={{ flex: "1" }}>
              <AgeGroupPieChart />
            </div>
          </div>
          <div
            className="performance-row"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px", // Add some space between components
              marginTop: "70px",
              width: "100%",
            }}
          >
            <div
              className="region-performance"
              style={{
                flex: "1",
                maxWidth: "48%",
                // marginTop: "70px", // Control the width to make them responsive
              }}
            >
              <RegionPerformance />
            </div>
            <div
              className="ab-testing"
              style={{
                flex: "1",
                maxWidth: "48%",
                marginTop: "20px", // Control the width to make them responsive
                // Control the width to make them responsive
              }}
            >
              <ABTesting />
            </div>
          </div>
          <div className="bottom-sections">{/* Other components */}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
