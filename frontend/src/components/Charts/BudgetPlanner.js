import React from "react";
import BudgetOptimization from "./BudgetOptimization";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";

const BudgetPlanner = () => {
  return (
    <div
      className="budget-optimization-container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* Navbar at the top */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "50px", // Adjust based on your Navbar height
          zIndex: 1000, // Ensure it stays on top of other elements
        }}
      >
        <Navbar />
      </div>

      {/* Main content (Sidebar and BudgetOptimization) */}
      <div
        style={{
          display: "flex",
          marginTop: "50px", // Offset to avoid overlap with Navbar
          flexDirection: "row",
          width: "100%",
        }}
      >
        {/* Sidebar with top margin */}
        <div
          style={{
            position: "fixed",
            left: 0,
            top: "60px", // Adjust based on Navbar height
            width: "250px", // Sidebar width
            height: "calc(100vh - 60px)", // Sidebar should take up the remaining height
            marginTop: "20px", // Top margin for Sidebar
          }}
        >
          <Sidebar />
        </div>

        {/* Main Content Area (BudgetOptimization centered) */}
        <div
          className="budget-optimization-content"
          style={{
            marginLeft: "260px", // Adjust to Sidebar width
            marginRight:"260px",
            paddingTop: "80px", // Space to avoid overlap with Navbar
            display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            width: "100%", // Make sure the content spans the full width
          }}
        >
          <BudgetOptimization />
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
