const User = require("../modal/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ");
  }
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  try {
    const decode = jwt.verify(token[1], process.env.JWT_SECRETS);
    const user = await User.findById(decode.id);
    console.log("decode----------", user);
    if (!user) {
      return next(new ErrorResponse("Not user found with this id", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};
