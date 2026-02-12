import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "unauthorized",
        success: false,
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("error in isAuthenticated", error);
  }
};

