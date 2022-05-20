const express = require("express");
const router = express.Router();
var fs = require("fs");
var path = require("path");
var nodemailer = require("nodemailer");
var Uploads = require("../models/uploads");
var { Faculty } = require("../models/faculty");
var multer = require("multer");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_secret = "Faculty Portfolio Management System";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "routes/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.post("/login", (req, res) => {
  Faculty.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      var bytes = CryptoJS.AES.decrypt(user.password, req.body.email);
      var decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (decrypted == req.body.password) {
        const accessToken = jwt.sign(user.toJSON(), process.env.ATS);
        res.json({
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
  Faculty.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      const secret = jwt_secret + user.password;
      const payload = {
        email: user.email,
        id: user._id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `http://localhost:3000/facfp/${user.id}/${token}`;
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
          res.status(404).json({ message: error });
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
  Faculty.findOne({ _id: id }).then((user) => {
    if (user) {
      try {
        const secret = jwt_secret + user.password;
        const payload = jwt.verify(token, secret);
        res.render("reset", { email: user.email });
      } catch (error) {
        res.status(404).send(error.message);
      }
    } else {
      res.status(404).send("Invalid id..");
    }
  });
});

router.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  async function facdata() {
    return await Faculty.findOne({ _id: id });
  }
  async function updatefn(newpass) {
    return await Faculty.updateOne(
      { _id: id },
      { $set: { password: newpass } }
    );
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

//opens the .ejs template from which post request for adding a upload doc is triggered
router.get("/newdoc/:facid", (req, res) => {
  res.render("imagesPage", { facid: req.params.facid });
  /*Uploads.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });*/
});

router.post(
  "/newdoc",
  upload.single("image"),
  authenticateToken,
  (req, res) => {
    console.log(req.file);
    async function facdata() {
      return await Faculty.find({ _id: req.body.facid });
    }
    facdata().then((data) => {
      var facname = data[0].name;
      var obj = {
        facultyid: req.body.facid,
        name: facname,
        title: req.body.title,
        desc: req.body.desc,
        img: {
          data: fs.readFileSync(
            path.join(__dirname + "/uploads/" + req.file.filename)
          ),
          contentType: "image/png",
        },
      };
      Uploads.create(obj, (err, item) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send("Portfolio successfully created");
        }
      });
    });
  }
);

router.get("/uploads/:facid", authenticateToken, async (req, res) => {
  try {
    const facdata = await Uploads.find({ facultyid: req.params.facid });
    res.json(facdata);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.get("/upload/:uploadid", authenticateToken, async (req, res) => {
  try {
    const facdata = await Uploads.findById(req.params.uploadid);
    res.json(facdata);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.delete("/upload/:uploadid", authenticateToken, async (req, res) => {
  try {
    const deletedrecord = await Uploads.deleteOne({ _id: req.params.uploadid });
    res.json(deletedrecord);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.get("/:facid", authenticateToken, async (req, res) => {
  try {
    const facdata = await Faculty.findById(req.params.facid);
    res.json(facdata);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports = router;
