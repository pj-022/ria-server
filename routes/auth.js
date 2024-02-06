const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getuser = require("../middleware/getuser");

const JWT_SECRET = "Th!s1s@v3ryC0mpl3xK3yForT0ken";

//? ROUTE 1 : Creating a User using: POST "/api/auth/createuser", No Login Required

router.post(
  "/createuser",
  [
    body("username", "Names should be atleast 4 Characters").isLength({ min: 4 }),
    body("password", "Password should be atleast 8 characters").isLength({
      min: 8,
    }),
    body("email", "Enter a valid email address").isEmail(),
    body("fullname", "Enter a valid Name").exists(),
    body("job", "Enter a valid job").exists(),
    body("bio", "Enter a valid bio").exists(),
    body("image", "Enter a valid image").exists(),
  ],
  async (req, res) => {
    success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Email Already Exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
        fullname: req.body.fullname,
        job: req.body.job,
        bio: req.body.bio,
        image: req.body.image
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true
      return res.json({ success, authtoken: authtoken });
    } catch (error) {
      success = false
      console.log(error);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
);

//? ROUTE 2 : Logging in using: POST "/api/auth/login", No Login Required

router.post(
  "/login",
  [
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Password should be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email }).maxTime(25000);
      if (!user) {
        return res.status(400).json({ success, error: "No Such User Exist" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res.status(400).json({ success, error: "Enter Valid Credentials" });
      }

      const data = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          date: user.date
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true
      return res.json({ success, authtoken: authtoken });
    } catch (error) {
      success = false
      console.log(error);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
);

//? ROUTE 3 : Fetch details of user Logged in using: GET "/api/auth/getuser", Login Required

router.get("/getuser", getuser, async (req, res) => {
  try {
    success = true
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    return res.json({ success, user });
  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Interal Server Error" });
  }

});


//? ROUTE 4: Edit User Details using: POST "/api/auth/editprofile", Login Required

router.put("/editprofile", getuser, async (req, res) => {
  success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {


    const { fullname, job, bio, image } = req.body

    const newUser = {}
    if (fullname) { newUser.fullname = fullname }
    if (job) { newUser.job = job }
    if (bio) { newUser.bio = bio }
    if (image) { newUser.image = image }

    let user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success, msg: "The User does not Exists Anymore" })
    }

    if (user.id.toString() !== req.user.id) {
      return res.status(401).json({ success, msg: "Action Not Allowed" })
    }

    user = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true })
    success = true
    return res.json({ success, msg: "User Updated SuccessFully" })

  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
})

//? ROUTE 5: Check if creds already exists using: GET "/api/auth/checkuser", No Login Required

router.post("/checkuser/:mode", [
  body("email", "Enter a valid email address").optional().exists().isEmail(),
  body("username", "Enter a Username").optional().exists().isLength({ min: 5 })
], async (req, res) => {
  success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  if (req.params.mode === "0") {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Email Already Exists" });
      }
      else {
        return res.status(200).json({ success: true, msg: "Email is Valid" })
      }
    } catch (error) {
      success = false
      console.log(error);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
  if (req.params.mode === "1") {
    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({ success, error: "Username Already Exists" });
      }
      else {
        return res.status(200).json({ success: true, msg: "Username is Valid" })
      }
    } catch (error) {
      success = false
      console.log(error);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
}
);

module.exports = router;
