const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const adminRoute = require("./routes/admin");
const facultyRoute = require("./routes/faculty");
const cors = require("cors");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(cors());
app.use("/admin", adminRoute);
app.use("/faculty", facultyRoute);
mongoose.connect("mongodb://localhost/FPMS", () =>
  console.log("connected to db")
);
app.listen(4000);
