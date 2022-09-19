const jwt = require("jsonwebtoken");
const JWT_SECRET = "Th!s1s@v3ryC0mpl3xK3yForT0ken"

const getuser = (req, res, next) => {
  const token = req.header("authtoken");
  if (!token) {
    return res.status(401).json({ error: "Token is not Valid" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Login Correctly" });
  }
};

module.exports = getuser;
