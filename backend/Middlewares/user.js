const userModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const adminModel = require("../Models/Admin/admin");

module.exports.adminMiddleware = async (req, res, next) => {
  try {
      // Extract token from cookies
      const token = req.cookies.token;

      if (!token) {
          return res.status(401).send("Not authorized, no token");
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");

      if(req.user.userType !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      } else {
          const admin = await adminModel.findById(req.user.user);
          if(admin.role !== 'admin') {
              return res.status(403).json({ message: 'Access denied' });
          }
      }

      next();
  } catch (error) {
      console.error("Error verifying admin token:", error);
      res.status(401).json({ message: "Authentication failed." });
  }
};


module.exports.customerMiddleware = async (req, res, next) => {
  try {
      // Extract token from cookies
      const token = req.cookies.token;

      if (!token) {
          return res.status(401).send("Not authorized, no token");
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");

      if(req.user.userType !== 'customer') {
          return res.status(403).json({ message: 'Access denied' });
      }

      next();
  } catch (error) {
      console.error("Error verifying customer token:", error);
      res.status(401).json({ message: "Authentication failed." });
  }
};

