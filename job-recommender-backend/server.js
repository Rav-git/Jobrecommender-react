const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS configuration to allow requests from Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.vercel.app', 'http://localhost:3000'] 
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Ensure data and uploads directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Copy CSV files to data directory
const copyDataFiles = () => {
  const files = ['linkdindata.csv', 'skills.csv'];
  files.forEach(file => {
    const sourcePath = path.join(__dirname, '..', file);
    const destPath = path.join(dataDir, file);
    
    console.log(`Checking for ${file}...`);
    console.log(`Source path: ${sourcePath}`);
    console.log(`Destination path: ${destPath}`);

    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Successfully copied ${file}`);
      } catch (err) {
        console.error(`Error copying ${file}:`, err);
      }
    } else {
      console.error(`Source file ${file} not found at ${sourcePath}`);
    }
  });
};

// Copy CSV files on startup
copyDataFiles();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('resume');

// API route for resume upload
app.post("/upload", (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ 
        error: err.code === 'LIMIT_FILE_SIZE' 
          ? 'File size is too large. Maximum size is 5MB.' 
          : 'Error uploading file'
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if required files exist
    const requiredFiles = ['linkdindata.csv'];
    for (const file of requiredFiles) {
      const filePath = path.join(dataDir, file);
      if (!fs.existsSync(filePath)) {
        return res.status(500).json({ 
          error: `Required file ${file} not found. Please ensure all required files are present.`
        });
      }
    }

    console.log("Processing resume...");
    console.log("File details:", {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const pythonScript = path.join(__dirname, "scripts", "process_resume.py");
    if (!fs.existsSync(pythonScript)) {
      return res.status(500).json({ 
        error: "Processing script not found"
      });
    }

    console.log("Script Path:", pythonScript);
    console.log("File Path:", req.file.path);

    // Execute Python script
    const pythonProcess = spawn("python", [pythonScript, req.file.path]);

    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.log("Python output:", output);
      result += output;
    });

    pythonProcess.stderr.on("data", (data) => {
      const errorOutput = data.toString();
      console.error("Python error:", errorOutput);
      error += errorOutput;
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process exited with code:", code);
      
      // Clean up the uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      if (code !== 0) {
        console.error("Error output:", error);
        return res.status(500).json({ 
          error: "Error processing resume",
          details: error.split('\n')[0] // Send only the first line of error
        });
      }

      try {
        const recommendations = JSON.parse(result);
        if (recommendations.error) {
          return res.status(400).json({ error: recommendations.error });
        }
        if (!Array.isArray(recommendations) || recommendations.length === 0) {
          return res.status(400).json({ error: "No job recommendations found" });
        }
        res.json(recommendations);
      } catch (e) {
        console.error("Error parsing Python output:", e);
        console.error("Raw output:", result);
        return res.status(500).json({ 
          error: "Error processing resume results",
          details: "Invalid response format"
        });
      }
    });

    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      return res.status(500).json({ 
        error: "Failed to process resume",
        details: "Could not start processing"
      });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
