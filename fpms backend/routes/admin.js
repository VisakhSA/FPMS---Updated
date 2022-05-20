const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");
var Uploads = require("../models/uploads");
const Admin = require("../models/admin");
const { Faculty } = require("../models/faculty");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_secret = "Faculty Portfolio Management System";
router.post("/login", (req, res) => {
  Admin.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      var bytes = CryptoJS.AES.decrypt(user.password, req.body.email);
      var decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted == req.body.password) {
        const accessToken = jwt.sign(user.toJSON(), process.env.ATS);
        res.json({
          user,
          accessToken,
        });
      } else {
        res.status(404).json({
          message: "Password does not matched!",
        });
      }
    } else {
      res.status(404).json({
        message: "User not found!",
      });
    }
  });
});

function authenticateToken(req, res, next) {
  /*const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ATS, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });*/
  next();
}

router.post("/forget-password", (req, res) => {
  Admin.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      const secret = jwt_secret + user.password;
      const payload = {
        email: user.email,
        id: user._id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `http://localhost:3000/adminfp/${user.id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.mailid,
          pass: process.env.pw,
        },
      });
      var mailOptions = {
        from: process.env.mailid,
        to: req.body.email,
        subject: "Reset Password for FPMS",
        text: link,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.json({ message: error });
        } else {
          console.log("Email sent: " + info.response);
          res.json({ message: "Email sent: " + info.response });
        }
      });
    } else {
      res.status(404).json({
        message: "User not found!",
      });
    }
  });
});

router.get("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  Admin.findOne({ _id: id }).then((user) => {
    if (user) {
      try {
        const secret = jwt_secret + user.password;
        const payload = jwt.verify(token, secret);
        res.render("reset", { email: "Admin" });
      } catch (error) {
        res.send(error.message);
      }
    } else {
      res.send("Invalid id..");
    }
  });
});

router.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  async function facdata() {
    return await Admin.findOne({ _id: id });
  }
  async function updatefn(newpass) {
    return await Admin.updateOne({ _id: id }, { $set: { password: newpass } });
  }
  facdata().then((user) => {
    if (user) {
      try {
        const secret = jwt_secret + user.password;
        const payload = jwt.verify(token, secret);
        var newpass = CryptoJS.AES.encrypt(
          req.body.password,
          user.email
        ).toString();
        try {
          updatefn(newpass);
          res.send("Password updated");
        } catch (err) {
          res.status(404).send(err.message);
        }
      } catch (error) {
        res.status(404).send(error.message);
      }
    } else {
      res.status(404).send("Invalid id..");
    }
  });
});

router.get("/daterange", async (req, res) => {
  try {
    var facarr = [];
    const facdata = await Faculty.find();
    for (const x of facdata) {
      facarr.push(x.name);
    }
    res.render("datecheck", { facarr: facarr });
  } catch (err) {
    res.send(err);
  }
});

router.post("/datefilter", authenticateToken, async (req, res) => {
  try {
    const uploaddata = await Uploads.find({
      created_at: {
        $gte: new Date(req.body.startdate),
        $lte: new Date(req.body.enddate),
      },
      name: req.body.facname,
    }).sort({ created_at: "asc" });
    if (uploaddata.length == 0) {
      res.status(404).json({
        status: "failure",
        message: "No Uploads done by the faculties",
      });
    } else {
      console.log(uploaddata.length);
      res.status(200).json({
        status: "success",
        data: uploaddata,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      error: error.message,
    });
  }
});

router.get("/faculty", authenticateToken, async (req, res) => {
  try {
    const facdata = await Faculty.find();
    res.json(facdata);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.get("/facultycount", authenticateToken, async (req, res) => {
  try {
    const facdata = await Faculty.find();
    res.json(facdata.length);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.get("/uploadcount", authenticateToken, async (req, res) => {
  try {
    const uploaddata = await Uploads.find();
    res.json(uploaddata.length);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.get("/faculty/:facid", authenticateToken, async (req, res) => {
  try {
    const facdata = await Faculty.findById(req.params.facid);
    res.json(facdata);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.patch("/faculty/:facid", authenticateToken, async (req, res) => {
  try {
    const updatedrecord = await Faculty.updateOne(
      { _id: req.params.facid },
      { $set: { name: req.body.name, designation: req.body.designation } }
    );
    await Uploads.updateMany(
      { facultyid: req.params.facid },
      { $set: { name: req.body.name } }
    );
    res.json(updatedrecord);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.delete("/faculty/:facid", authenticateToken, async (req, res) => {
  try {
    const deletedrecord = await Faculty.deleteOne({ _id: req.params.facid });
    await Uploads.deleteMany({ facultyid: req.params.facid });
    res.json(deletedrecord);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.post("/createFaculty", authenticateToken, async (req, res) => {
  Faculty.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.status(404).json({
        message: "User already Exist",
      });
    } else {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.mailid,
          pass: process.env.pw,
        },
      });
      var mailOptions = {
        from: process.env.mailid,
        to: req.body.email,
        subject: "Details of your account in FPMS",
        text:
          "Your Username is " +
          req.body.name +
          " and your Password is " +
          req.body.password,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(404).json({ error });
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          var cipher = CryptoJS.AES.encrypt(
            req.body.password,
            req.body.email
          ).toString();
          const faculty = new Faculty({
            email: req.body.email,
            password: cipher,
            name: req.body.name,
            designation: req.body.designation,
          });
          console.log(faculty);
          faculty
            .save()
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              res.status(404).json({ message: err });
            });
        }
      });
    }
  });
});

router.get("/report/:uid", authenticateToken, async (req, res) => {
  try {
    const uploaddata = await Uploads.findById(req.params.uid);
    res.json(uploaddata);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});
module.exports = router;
