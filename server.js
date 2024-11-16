const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const { configDotenv, config } = require("dotenv");

configDotenv({ path: ".env" });
const express = require("express");
const app = express();
const port = 3000;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

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
