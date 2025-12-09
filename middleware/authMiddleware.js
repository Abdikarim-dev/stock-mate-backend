const jwt = require("jsonwebtoken");

const authenticate = (request, response, next) => {
  // Get the token
  const token =
    request.headers.authorization &&
    request.headers.authorization.split(" ")[1];
    
  if (!token)
    return response.status(404).json({ message: "No Token Provided" });

  try {
    // Comparing the tokens
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return response.status(403).json({
          message: "Invalid Or Expired Token!",
        });
      // request.body.userId = decoded.id;
      // request.body.userRole = decoded.role;
      request.user = decoded;
      next();
    });
  } catch (error) {
    response.status(500).json({
      message: "Error Happened at the Authentication Middleware",
    });
  }
};

// [
//   admin,staff
// ]

// [
//   admin for deleting 
// ]

const authorizeRoles = (...allowedRoles) => {
  return (request, response, next) => {
    const userRole = request.user.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return response.status(403).json({
        message: "Forbidden: Access denied",
      });
    }
  };
};

module.exports = { authenticate, authorizeRoles };
