import React from "react";
import LowerPerformanceAds from "./LowerPerfomingAds";
import TopPerformanceAds from "./TopPerformingAds";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";

const Performance = () => {
  return (
    <div
      className="performance-container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Navbar - Fixed at the top */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "60px", // Adjust based on your Navbar height
          zIndex: 1000, // Ensure it stays on top of other elements
        }}
      >
        <Navbar />
      </div>

      {/* Sidebar - Fixed to the left and below Navbar */}
      <div
        style={{
          position: "fixed",
          top: "60px", // Start below the Navbar
          left: 0,
          width: "250px", // Sidebar width
          height: "calc(100vh - 60px)", // Sidebar should take up the remaining height
          marginTop: "20px", // Margin from the top
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content - Adjusted for Sidebar and Navbar */}
      <div
        style={{
          //   marginLeft: "260px", // Offset to the right due to Sidebar
          paddingTop: "150px", // Space to avoid overlap with Navbar
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center horizontally
          justifyContent: "center", // Center vertically
          width: "100%", // Ensure content takes full width
        }}
      >
        <div className="top-performance-ads" style={{ marginBottom: "60px" }}>
          <TopPerformanceAds />
        </div>
        <div className="lower-performance-ads">
          <LowerPerformanceAds />
        </div>
      </div>
    </div>
  );
};

export default Performance;
