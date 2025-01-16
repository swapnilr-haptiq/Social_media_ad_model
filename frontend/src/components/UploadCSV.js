import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Charts/Navbar";
import Papa from "papaparse"; // Import papaparse library for CSV parsing
import { Tooltip, IconButton } from "@mui/material"; // Import Tooltip and IconButton

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hovering, setHovering] = useState(false); // State to manage hover for column names
  const navigate = useNavigate();

  const requiredColumns = [
    "Region",
    "Ad_name",
    "Clicks",
    "Impressions",
    "Conversions",
    "Budget_Allocated",
    "Engagement",
    "Age_Group",
    "Date",
    "time_spent(sec,min)",
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const validateCSVColumns = (data) => {
    const headers = Object.keys(data[0]);
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );
    return missingColumns;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    Papa.parse(file, {
      complete: async (result) => {
        const missingColumns = validateCSVColumns(result.data);
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(", ")}`);
          setMessage("");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            "http://localhost:5000/api/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          setMessage(response.data.message);
          setError("");

          // Navigate to dashboard and reload to fetch updated data
          navigate("/dashboard");
          window.location.reload();
        } catch (err) {
          setMessage("");
          setError(
            err.response?.data?.error ||
              err.message ||
              "An error occurred while uploading the file."
          );
        }
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Upload CSV File</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Upload
          </button>
        </form>

        {/* Tooltip for showing required columns */}
        <div
          style={styles.tooltipContainer}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Tooltip
            open={hovering}
            title={
              <div style={styles.tooltipContent}>
                <ul style={styles.tooltipList}>
                  {requiredColumns.map((col, index) => (
                    <li key={index} style={styles.tooltipListItem}>
                      {col}
                    </li>
                  ))}
                </ul>
              </div>
            }
            arrow
          >
            <IconButton style={styles.infoIcon}>Require Columns</IconButton>
          </Tooltip>
        </div>

        {message && <p style={styles.successMessage}>{message}</p>}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "20px auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative", // Ensures proper positioning for child elements
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  successMessage: {
    color: "green",
    fontSize: "16px",
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
    fontSize: "16px",
    textAlign: "center",
  },
  tooltipContainer: {
    position: "absolute",
    bottom: "-30px", // Position the tooltip 20px below the "Upload" button
    right: "10px", // Aligning it to the right
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    fontSize: "16px",
    color: "#007bff",
    textDecoration: "underline",
    fontWeight: "bold",
    backgroundColor: "#e6f7ff",
    padding: "5px 10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  tooltipContent: {
    padding: "15px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "300px",
    wordWrap: "break-word",
    fontSize: "14px",
    color: "#333",
  },
  tooltipList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    textAlign: "left",
  },
  tooltipListItem: {
    marginBottom: "5px",
    padding: "5px 10px",
    borderRadius: "3px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
};

export default UploadCSV;
