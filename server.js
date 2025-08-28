// Import Express.js
import express from "express";

// Import OpenAI
import OpenAI from "openai";

// Import file system, enables users to interact
// with the file system on your computer
import fs from "fs";

// Import dotenv library
import dotenv from "dotenv";

// Middleware that makes it easy to handle file uploads/images
import multer from "multer";

// Load environment variables into the file
dotenv.config();

// OpenAI api-key
const apikey = process.env.OPENAI_API_KEY;

// OpenAI instance/object
const openai = new OpenAI({apiKey: apikey});

// Express instance/object
const app = express();

// Create an instance of multer and setup a folder destination called uploads
// Later, files from that folder will be read from fs.readFileSync
const upload = multer({ dest: "uploads/" });

// 1) Tell Express to serve everything inside "public" folder
// If there are multiple files, it looks for index.html first
app.use(express.static('public'));

// 2) Start server
// Express listens to port and serves the index.html into that port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// 1) app.post("/analyse", ...) When someone sends a POST request to /analyse, run this function
// A POST request usually means the client is sending data, like an upload file or form

// 2) upload.single("image") looks for a form field named "image" in the request
// It saves the uploaded file into the uploads/ folder and adds info about the file into the req.file
// For example req.file = {path: "uploads/abc123"}

// 3) async (req, res) => { ... } this is the route handler where:
// req = request coming in from the frontend
// res = response you send back
// We make it async because we will be using await

app.post("/analyse", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path; // file path of uploaded images
    const base64Image = fs.readFileSync(imagePath, "base64"); // reads file from disk

    // Call OpenAI response from server
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Describe this image and suggest a workout plan." },
            { type: "input_image", image_url: `data:image/jpeg;base64,${base64Image}` },
          ],
        },
      ],
    });

    // Send it back to the browser as JSON
    res.json({ result: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});