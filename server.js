const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const express = require("express");
const app = express();
const port = 3000;

const firebaseConfig = {
  apiKey: "BIkO9K-d-eAwJF-uMiMPHfSRm242mOvp69dWg8Pmln5YQwFfI8GJkAEvVwnbyR3ZdnNCl_Up7QkzPSEQng1V7hk",
  authDomain: "648643384963.firebase.com",
  databaseURL: "https://zuluzes-a1ba9-default-rtdb.firebaseio.com",
  projectId: "648643384963",
  // storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "648643384963",
  // appId: "648643384963",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("------------------------");
  next();
});

app.post("/target", (req, res) => {
  const { target } = req.body;

  set(ref(database, "/pushups/target"), Number(target))
    .then(() => {
      console.log("Target pushups set successfully!");
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error setting target:", error);
      res.status(500).send("Error setting target");
    });
});

app.get("/reset", (req, res) => {
  set(ref(database, "/pushups/reset"), 1)
    .then(() => {
      console.log("Pushup counter reset!");
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Error resetting pushups:", error);
      res.status(500).send("Error resetting pushups");
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
