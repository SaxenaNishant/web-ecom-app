require("dotenv").config({
  path: "./config.env",
});
const express = require("express");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Cookies = require("js-cookie");

const clientID = "32d78df718175481ab28";
const clientSecret = "b05420bcc0c229fdbf7db4c183a497a6827f61ce";

//const { OAuth2Client } = require("google-auth-library");
// const GOOGLE_CLIENT_ID =
//   "719289195272-f6c2tv3e297gor9ml21okrsbevbtusoa.apps.googleusercontent.com";
// const CLIENT_SECRETS = "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";
// const client = new OAuth2Client(GOOGLE_CLIENT_ID); // Replace by your client ID
// connect DB

connectDb();

const app = express();

app.use(express.json());
app.use(
  cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: "http://localhost:3001",
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  })
);

// async function verifyGoogleToken(token) {
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: GOOGLE_CLIENT_ID, // Replace by your client ID
//   });
//   const payload = ticket.getPayload();
//   return payload;
// }

// router.post("/auth/google", (req, res, next) => {
//   verifyGoogleToken(req.body.idToken)
//     .then((user) => {
//       console.log(user); // Token is valid, do whatever you want with the user
//     })
//     .catch(console.error); // Token invalid
// });

app.get("/oauth/redirect", (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code;
  axios({
    // make a POST request
    method: "post",
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json",
    },
  })
    .then((response) => {
      // Once we get the response, extract the access token from
      // the response body
      const accessToken = response.data.access_token;
      console.log("accessToken===" + accessToken);
      // redirect the user to the welcome page, along with the access token
      // res.status(200).json({
      //   success: true,
      //   data: response,
      // });
      axios({
        // make a POST request
        method: "get",
        // to the Github authentication API, with the client ID, client secret
        // and request token
        url: `https://api.github.com/user`,
        // Set the content type header, so that we get the response in JSOn
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Include the token in the Authorization header
          Authorization: "token " + accessToken,
        },
      })
        .then((resp) => {
          console.log("Response in the logsssssss", resp);
          const token = jwt.sign(resp.data, process.env.JWT_SECRETS);
          res.cookie("auth_token", token, {
            maxAge: 900000,
            httpOnly: true,
            secure: false,
          });
          // localStorage.set("authToken", token);
          // console.log(token);
          res.redirect("http://localhost:3001/");
        })
        .catch((err) => console.log("ERRRRRRRR", err));
    })
    .catch((error) => console.log("ERROR IN OUTER", error));
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

// error handler should be last piece of middleware

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server is running on ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged error ${err}`);

  server.close(() => process.exit(1));
});
