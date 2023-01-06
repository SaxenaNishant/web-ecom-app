import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import igm from "../../images/Full-screen-wallpaper-5.jpg";
import Cookies from "js-cookie";

const PrivateScreen = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  useEffect(() => {
    console.log(
      "TTTTTTTTTTTTTTTTTTTTTT",
      Cookies.get("auth_token") + "     " + "PPPPPPPPPP",
      localStorage.getItem("authToken")
    );
    if (!localStorage.getItem("authToken") && !Cookies.get("auth_token")) {
      history.push("/login");
    } else {
      console.log(localStorage.getItem("authToken"), "TOKEN");
      const token =
        Cookies.get("auth_token") || localStorage.getItem("authToken");
      console.log("TTTTTTTTTTTTTTTTTTTTTT", token);
      const fetchPrivateData = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          const { data } = await axios.get(
            "http://localhost:5000/api/private",
            config
          );
          setPrivateData(data.data);
        } catch (error) {
          localStorage.removeItem("authToken");
          setError("You are not Authorized please login");
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      };
      fetchPrivateData();
    }
  }, [history]);
  return error ? (
    <span>{error}</span>
  ) : (
    <>
      <div
        style={{
          backgroundImage: `url(${igm})`,
          backgroundSize: "cover",
          height: "100vh",
          color: "#f5f5f5",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "0px auto 0px auto",
            paddingTop: "200px",
          }}
        >
          <h3>{privateData}</h3>
          <Button
            onClick={logoutHandler}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            LOGOUT
          </Button>
        </div>
      </div>
    </>
  );
};

export default PrivateScreen;
