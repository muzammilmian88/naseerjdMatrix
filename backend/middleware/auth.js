// JSON Web Token is a proposed Internet standard for creating data with optional signature and / or
// optional encryption whose payload holds JSON that asserts some number of claims.
// The tokens are signed either using a private secret or a public / private key.
import jwt from "jsonwebtoken";

// This is the auth function for generating the token and I used this auth function as middleware for security.
const auth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization.split(" ")[1];
    const isCustomAuth = token?.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
