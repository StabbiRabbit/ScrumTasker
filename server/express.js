const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3000;
const SERVER_URL = "http://127.0.0.1:" + PORT;

app.get("/", (req, res) => {
  return res.status(202).sendFile(path.join(__dirname, "../build/bundle.html"));
});
// app.use("/build", express.static(path.join(__dirname, "../build")));

app.get("/board", (req, res) => {
  const dummyData = {
    title: "dummyExample",
    stories: ["Story1", "Story2"],
  };
  res.status(200).json(dummyData);
});


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = { app, SERVER_URL };
