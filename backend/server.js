

const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");
const dashboardRoute = require("./routes/dashboard");

const app = express();
const port = 5000;

app.use(cors());
app.use("/api", uploadRoute);
app.use("/api", dashboardRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});