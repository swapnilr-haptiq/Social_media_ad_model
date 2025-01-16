const express = require("express");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded. Please upload a file." });
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  res.status(200).json({
    message: "File is valid and uploaded successfully.",
    filePath: filePath,
  });
});

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    const regions = new Set();

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        regions.add(row.Region);
        data.push({
          Ad_name: row.Ad_name,
          Clicks: parseInt(row.Clicks) || 0,
          Impressions: parseInt(row.Impressions) || 0,
          Conversions: parseInt(row.Conversions) || 0,
          Region: row.Region,
        });
      })
      .on("end", () => resolve({ data, regions: Array.from(regions) }))
      .on("error", reject);
  });
};

router.get("/regional-ad-performance", async (req, res) => {
  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1]; // Use the latest uploaded file
  const regionQuery = req.query.region;

  try {
    const { data, regions } = await readCSV(path.join(filePath, latestFile));

    const filteredData = regionQuery
      ? data.filter((row) => row.Region === regionQuery)
      : data;

    res.json({
      regions,
      data: filteredData,
    });
  } catch (err) {
    console.error("Error reading the CSV file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/regions-and-ads", async (req, res) => {
  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1]; // Use the latest uploaded file

  try {
    const { regions, ads } = await readCSV(path.join(filePath, latestFile));

    const adsSet = new Set();
    regions.forEach((row) => adsSet.add(row.Ad_name));

    res.json({
      regions,
      ads: Array.from(adsSet),
    });
  } catch (err) {
    console.error("Error reading the CSV file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/regions", async (req, res) => {
  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1];

  try {
    const { data } = await readCSV(path.join(filePath, latestFile));

    const regions = [...new Set(data.map((row) => row.Region))];
    res.json({ regions });
  } catch (err) {
    console.error("Error reading the CSV file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/ads", async (req, res) => {
  const region = req.query.region;

  if (!region) {
    return res.status(400).json({ message: "Region is required." });
  }

  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1];

  try {
    const { data } = await readCSV(path.join(filePath, latestFile));

    const ads = [
      ...new Set(
        data.filter((row) => row.Region === region).map((row) => row.Ad_name)
      ),
    ];
    res.json({ ads });
  } catch (err) {
    console.error("Error reading the CSV file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/ab-test-results", async (req, res) => {
  const region = req.query.region;
  const selectedAds = req.query.ads ? req.query.ads.split(",") : [];

  if (selectedAds.length < 2) {
    return res
      .status(400)
      .json({ message: "Please select two ads for comparison." });
  }

  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1];

  try {
    const { data } = await readCSV(path.join(filePath, latestFile));

    const filteredData = data.filter((row) => {
      return (
        (!region || row.Region === region) && selectedAds.includes(row.Ad_name)
      );
    });

    const groupedData = filteredData.reduce((acc, item) => {
      const adName = item.Ad_name || "Unknown";
      if (!acc[adName]) {
        acc[adName] = {
          Ad_name: adName,
          Clicks: 0,
          Impressions: 0,
          Conversions: 0,
        };
      }
      acc[adName].Clicks += item.Clicks;
      acc[adName].Impressions += item.Impressions;
      acc[adName].Conversions += item.Conversions;
      return acc;
    }, {});

    const groupedAds = Object.values(groupedData);

    res.json({
      results: groupedAds,
    });
  } catch (err) {
    console.error("Error reading the CSV file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/age-group-insights", (req, res) => {
  const { region } = req.query;
  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1];
  const aggregatedData = {};

  fs.createReadStream(path.join(filePath, latestFile))
    .pipe(csvParser())
    .on("data", (row) => {
      if (!region || row.Region === region) {
        const ageGroup = row.Age_Group;
        const clicks = parseInt(row.Clicks) || 0;
        const impressions = parseInt(row.Impressions) || 0;

        if (ageGroup && impressions > 0) {
          if (aggregatedData[ageGroup]) {
            aggregatedData[ageGroup].Clicks += clicks;
            aggregatedData[ageGroup].Impressions += impressions;
          } else {
            aggregatedData[ageGroup] = {
              Clicks: clicks,
              Impressions: impressions,
            };
          }
        }
      }
    })
    .on("end", () => {
      const result = Object.keys(aggregatedData).map((ageGroup) => {
        const { Clicks, Impressions } = aggregatedData[ageGroup];
        const ctr = ((Clicks / Impressions) * 100).toFixed(2);

        return {
          Age_Group: ageGroup,
          Clicks,
          Impressions,
          CTR: ctr,
        };
      });
      res.json(result);
    })
    .on("error", (err) => {
      console.error("Error reading the CSV file:", err);
      res.status(500).json({ message: "Error processing the file." });
    });
});

router.get("/budget-optimization", (req, res) => {
  const { region } = req.query;
  const filePath = path.join(__dirname, "../uploads");

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "Uploads directory not found." });
    }

    const files = fs.readdirSync(filePath);
    if (files.length === 0) {
      return res.status(400).json({ message: "No uploaded files found." });
    }

    const latestFile = files[files.length - 1];
    const aggregatedData = {};
    const regions = new Set();

    fs.createReadStream(path.join(filePath, latestFile))
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.Ad_name && row.Region && row.Impressions && row.Clicks) {
          const adName = row.Ad_name;
          const clicks = parseInt(row.Clicks, 10) || 0;
          const impressions = parseInt(row.Impressions, 10) || 0;
          const budgetAllocated = parseFloat(row.Budget_Allocated) || 0;

          regions.add(row.Region);

          if (!region || row.Region === region) {
            if (adName && impressions > 0) {
              if (!aggregatedData[adName]) {
                aggregatedData[adName] = {
                  Region: row.Region,
                  Ad_name: adName,
                  Clicks: clicks,
                  Impressions: impressions,
                  Budget_Allocated: budgetAllocated,
                };
              } else {
                aggregatedData[adName].Clicks += clicks;
                aggregatedData[adName].Impressions += impressions;
                aggregatedData[adName].Budget_Allocated += budgetAllocated;
              }
            }
          }
        }
      })
      .on("end", () => {
        const totalClicks = Object.values(aggregatedData).reduce(
          (sum, ad) => sum + ad.Clicks,
          0
        );
        const totalImpressions = Object.values(aggregatedData).reduce(
          (sum, ad) => sum + ad.Impressions,
          0
        );
        const averageCTR = totalImpressions
          ? (totalClicks / totalImpressions) * 100
          : 0;

        const tolerancePercentage = 5;
        const lowerBound =
          averageCTR - (averageCTR * tolerancePercentage) / 100;
        const upperBound =
          averageCTR + (averageCTR * tolerancePercentage) / 100;

        const recommendations = Object.values(aggregatedData)
          .map((ad) => {
            const ctr = ad.Impressions ? (ad.Clicks / ad.Impressions) * 100 : 0;
            let action = null;
            let recommendedBudget = ad.Budget_Allocated;

            if (ctr > upperBound) {
              action = "Increase Budget";
              recommendedBudget = ad.Budget_Allocated * 1.2;
            } else if (ctr < lowerBound) {
              action = "Decrease Budget";
              recommendedBudget = ad.Budget_Allocated * 0.85;
            }

            if (action) {
              return {
                Region: ad.Region,
                Ad_name: ad.Ad_name,
                CTR: ctr.toFixed(2),
                BeforeBudget: ad.Budget_Allocated.toFixed(2),
                Action: action,
                RecommendedBudget: recommendedBudget.toFixed(2),
              };
            }

            return null;
          })
          .filter(Boolean);
        res.status(200).json({
          regions: Array.from(regions),
          recommendations: recommendations,
        });
      })
      .on("error", (err) => {
        console.error("Error reading the CSV file:", err);
        res.status(500).json({ message: "Error processing the file." });
      });
  } catch (err) {
    console.error("Error accessing files:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/lower-performance-ads", (req, res) => {
  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);

  if (files.length === 0) {
    return res.status(400).json({ message: "No uploaded files found." });
  }

  const latestFile = files[files.length - 1];
  const regions = new Set();
  const data = [];
  const regionQuery = req.query.region;

  fs.createReadStream(path.join(filePath, latestFile))
    .pipe(csvParser())
    .on("data", (row) => {
      regions.add(row.Region);
      data.push({
        Ad_name: row.Ad_name,
        Clicks: parseInt(row.Clicks) || 0,
        Impressions: parseInt(row.Impressions) || 0,
        Conversions: parseInt(row.Conversions) || 0,
        Engagement: parseInt(row.Engagement) || 0,
        Region: row.Region,
      });
    })
    .on("end", () => {
      const lowerPerformanceAds = Array.from(regions).map((region) => {
        const regionData = data.filter((ad) => ad.Region === region);

        const sortedAds = regionData.sort((a, b) => {
          const ctrA = a.Impressions > 0 ? (a.Clicks / a.Impressions) * 100 : 0;
          const ctrB = b.Impressions > 0 ? (b.Clicks / b.Impressions) * 100 : 0;
          return ctrA - ctrB;
        });

        const adsWithEngagementRate = sortedAds.slice(0, 5).map((ad) => {
          const engagementRate =
            ad.Impressions > 0
              ? ((ad.Engagement / ad.Impressions) * 100).toFixed(2)
              : 0;

          return {
            ...ad,
            EngagementRate: engagementRate,
          };
        });

        return {
          _id: region,
          ads: adsWithEngagementRate,
        };
      });

      const filteredAds = regionQuery
        ? lowerPerformanceAds.filter((ad) => ad._id === regionQuery)
        : lowerPerformanceAds;

      res.status(200).json(filteredAds);
    })
    .on("error", (err) => {
      console.error("Error reading the CSV file:", err);
      res.status(500).json({ message: "Error processing the file." });
    });
});

const getLatestFile = () => {
  const filePath = path.join(__dirname, "../uploads");
  const files = fs.readdirSync(filePath);
  if (files.length === 0) {
    throw new Error("No uploaded files found.");
  }
  return path.join(filePath, files[files.length - 1]);
};

const processCSV = (filePath, callback) => {
  const data = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => data.push(row))
    .on("end", () => callback(null, data))
    .on("error", (err) => callback(err));
};

const calculatePerformanceMetrics = (ad) => {
  const ctr = ad.Impressions > 0 ? (ad.Clicks / ad.Impressions) * 100 : 0;
  const engagementRate =
    ad.Impressions > 0 ? (ad.Engagement / ad.Impressions) * 100 : 0;
  return { ctr, engagementRate };
};

// Route for Top Performance Ads
router.get("/top-performance-ads", async (req, res) => {
  try {
    const filePath = getLatestFile();
    const data = await new Promise((resolve, reject) => {
      processCSV(filePath, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const regions = [...new Set(data.map((row) => row.Region))];
    const regionQuery = req.query.region;

    // Function to calculate CTR and Engagement Rate
    const calculatePerformanceMetrics = (ad) => {
      const ctr = ad.Impressions > 0 ? (ad.Clicks / ad.Impressions) * 100 : 0;
      const engagementRate =
        ad.Impressions > 0 ? (ad.Engagement / ad.Impressions) * 100 : 0;
      return { ctr, engagementRate };
    };

    const topPerformanceAds = regions.map((region) => {
      const regionData = data.filter((ad) => ad.Region === region);
      const sortedAds = regionData
        .map((ad) => {
          const { ctr, engagementRate } = calculatePerformanceMetrics(ad);
          return { ...ad, ctr, engagementRate };
        })
        .sort((a, b) => {
          if (b.ctr !== a.ctr) return b.ctr - a.ctr;
          return b.engagementRate - a.engagementRate;
        });

      return { _id: region, ads: sortedAds.slice(0, 5) };
    });

    const filteredAds = regionQuery
      ? topPerformanceAds.filter((ad) => ad._id === regionQuery)
      : topPerformanceAds;

    res.status(200).json(filteredAds);
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/region-performance", async (req, res) => {
  try {
    const filePath = getLatestFile();
    const data = await new Promise((resolve, reject) => {
      processCSV(filePath, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const regionQuery = req.query.region;
    const aggregatedData = data.reduce((acc, row) => {
      const region = row.Region;
      if (!acc[region]) {
        acc[region] = { conversions: 0, impressions: 0 };
      }
      acc[region].conversions += parseInt(row.Conversions) || 0;
      acc[region].impressions += parseInt(row.Impressions) || 0;
      return acc;
    }, {});

    const result = Object.keys(aggregatedData).map((region) => ({
      region,
      conversions: aggregatedData[region].conversions * 3, // Multiply conversions by 5
      impressions: aggregatedData[region].impressions,
    }));

    const filteredData = regionQuery
      ? result.filter((ad) => ad.region === regionQuery)
      : result;

    res.status(200).json(filteredData);
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

// Route for Ad Time Performance
router.get("/ad-time-performance", async (req, res) => {
  try {
    const filePath = getLatestFile();
    const data = await new Promise((resolve, reject) => {
      processCSV(filePath, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const adQuery = req.query.ad;
    const regionQuery = req.query.region;

    const processedData = data.map((row) => {
      const adName = row.Ad_name && row.Ad_name.trim();
      const timeSpent = parseFloat(row["time_spent(sec,min)"]) || 0;
      const region = row.Region && row.Region.trim();
      return { adName, region, timeSpent: timeSpent / 60 };
    });

    const aggregatedData = processedData.reduce((acc, row) => {
      const { adName, region, timeSpent } = row;

      if (!acc[adName]) acc[adName] = {};

      if (!acc[adName][region]) acc[adName][region] = 0;

      acc[adName][region] += timeSpent;

      return acc;
    }, {});

    const result = Object.keys(aggregatedData).map((adName) => ({
      adName,
      regions: Object.keys(aggregatedData[adName]).map((region) => ({
        region,
        timeSpent: aggregatedData[adName][region],
      })),
    }));

    const filteredData = result
      .map((adData) => ({
        adName: adData.adName,
        regions: adData.regions.filter(
          (regionData) =>
            (!adQuery || adData.adName === adQuery) &&
            (!regionQuery || regionData.region === regionQuery)
        ),
      }))
      .filter((adData) => adData.regions.length > 0);

    res.status(200).json(filteredData);
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

router.get("/global-metrics", async (req, res) => {
  try {
    const filePath = getLatestFile();
    const data = await new Promise((resolve, reject) => {
      processCSV(filePath, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    let totalReach = 0;
    let totalClicks = 0;
    let totalImpressions = 0;
    let totalConversions = 0;
    let totalBudget = 0;

    const regionsSet = new Set();
    const adsSet = new Set();

    const regionPerformance = {};
    const adPerformance = {};

    data.forEach((row) => {
      const region = row.Region || "Unknown";
      const adName = row.Ad_name || "Unknown";
      const clicks = parseInt(row.Clicks) || 0;
      const impressions = parseInt(row.Impressions) || 0;
      const conversions = parseInt(row.Conversions) || 0;
      const budgetAllocated = parseFloat(row.Budget_Allocated) || 0;

      totalClicks += clicks;
      totalImpressions += impressions;
      totalConversions += conversions;
      totalBudget += budgetAllocated;
      totalReach += impressions;

      regionsSet.add(region);
      adsSet.add(adName);

      if (!regionPerformance[region]) {
        regionPerformance[region] = { clicks: 0, impressions: 0 };
      }
      regionPerformance[region].clicks += clicks;
      regionPerformance[region].impressions += impressions;

      if (!adPerformance[adName]) {
        adPerformance[adName] = {
          clicks: 0,
          impressions: 0,
          region: region,
        };
      }
      adPerformance[adName].clicks += clicks;
      adPerformance[adName].impressions += impressions;
    });

    const topRegion = Object.entries(regionPerformance).reduce(
      (top, [region, data]) =>
        data.clicks > (top.clicks || 0) ? { name: region, ...data } : top,
      {}
    );

    const topAd = Object.entries(adPerformance).reduce(
      (top, [adName, data]) =>
        data.impressions > (top.impressions || 0)
          ? { name: adName, impressions: data.impressions, region: data.region }
          : top,
      {}
    );

    const engagementRate = totalImpressions
      ? ((totalClicks / totalImpressions) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      totalReach,
      engagementRate,
      budgetSpent: totalBudget,
      totalAds: adsSet.size,
      totalRegions: regionsSet.size,
      topRegion,
      topAd,
    });
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).json({ message: "Error processing the file." });
  }
});

module.exports = router;
