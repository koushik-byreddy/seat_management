/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
// src/components/Auth.js
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 2.5em;
  text-align: center;
`;

const Button = styled.button`
  background: #ffffff;
  color: #6a11cb;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
`;

const Auth = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [collectOtp, setCollectOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [error, setError] = useState("none");
  const [reset, setReset] = useState(false);

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/user/verify/email",
        { email: userEmail }
      );
      console.log("response :: ", response.data);
      if (response.data) {
        console.log("done ");
        setIsUserRegistered(true);
      } else {
        setIsUserRegistered(false);
        await handleSendOtp();
      }
    } catch (err) {
      setIsUserRegistered(false);
      await handleSendOtp();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        email: userEmail,
        password: password,
      });
      if (response.data.code === "user_login_success") {
        setIsUserLoggedIn(true);
        window.localStorage.setItem("token", response.data.token);
        setAuthToken(response.data.token);
        fetchUserData(response.data.token);
      } else {
        setIsUserLoggedIn(true);
        setIsUserRegistered(false);
      }
    } catch (err) {
      setError("invalid credentials");
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/reset", {
        email: userEmail,
        password,
        otp,
      });
      if (response.data.code === "reset_password_success") {
        setCollectOtp(false);
        setForgot(false);
        setIsUserRegistered(true);
        setIsUserLoggedIn(false);
        setReset(true);
      }
    } catch (err) {
      console.log(err.response);
      setError(err.response.data.error);
    }
  };
  const fetchUserData = async (auth) => {
    try {
      console.log("user data :: ", authToken);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth ? auth : authToken,
      };
      const response = await axios.post(
        "http://localhost:3001/user/verify",
        { email: userEmail, password: password },
        { headers }
      );
      if (response.data.code === "user_verification_success") {
        setName(response.data.name);
        window.localStorage.setItem("name", response.data.name);
      }
    } catch (err) {
      setIsUserLoggedIn(false);
      console.log(err.response.data);
    }
  };
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/user/sendotp", {
        email: userEmail,
      });
      if (response.data.message === "OTP sent successfully") {
        setCollectOtp(true);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError("invalid email");
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, [authToken]);

  const handleVerifyOtp = async () => {
    try {
      console.log("verifying otp :: ", otp);
      const response = await axios.post(
        "http://localhost:3001/user/verify/otp",
        {
          email: userEmail,
          otp,
        }
      );
      if (response.data.code === "otp_verification_success") {
        setIsOtpVerified(response.data.isVerified);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/register", {
        email: userEmail,
        otp,
        name,
        password,
      });
      if (response.data.code === "user_registration_success") {
        setIsUserLoggedIn(true);
        setAuthToken(response.data.token);
      }
    } catch (err) {
      console.log(err.response.data.error);
      setError(err.response.data.error);
    }
  };

  return (
    <div>
      {!forgot && isUserLoggedIn && (
        <>
          <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
              <nav
                className="flex items-center justify-between p-6 lg:px-8"
                aria-label="Global"
              >
                <div className="flex lg:flex-1">
                  <a href="#" className="-m-1.5 p-1.5">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                      alt=""
                    />
                  </a>
                  <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-green-700 pl-5 pt-1"
                  >
                    Slot Booker
                  </a>
                </div>
              </nav>
            </header>

            <div className="relative isolate lg:px-8">
              <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                  <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Book Through Slot Booker
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Hi <p className="text-green-600 inline-block">{name}</p>,
                    please proceed to book slots
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="/home"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Proceed
                    </a>
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </>
      )}
      {!isUserLoggedIn && (
        <>
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <div className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Register / SignIn in to{" "}
                <h2 className="text-green-500">Slot Booker</h2>
              </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <div>
                <div style={{ display: "flex" }}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  {error == "invalid email" ? (
                    <p style={{ color: "red", marginLeft: "auto" }}>
                      Invalid email
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      window.localStorage.setItem("email", e.target.value);
                    }}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {!forgot && isUserRegistered && (
                <>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      {error == "invalid credentials" ? (
                        <p style={{ color: "red" }}>Invalid credentials</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
              {isLoading && <>Loading ...</>}
              {(!isUserRegistered || forgot) && collectOtp && (
                <>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      New Password
                    </label>
                    {error == "Password must be at least 6 characters long" ? (
                      <p style={{ color: "red" }}>Less than 6 characters</p>
                    ) : (
                      ""
                    )}
                    {error == "Password must contain at least one number" ? (
                      <p style={{ color: "red" }}>atleast 1 digit required</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        OTP
                      </label>
                      {error == "Invalid OTP" ? (
                        <p style={{ color: "red" }}>Invalid OTP</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="mt-2">
                      <input
                        id="otp"
                        name="otp"
                        type="password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  </div>
                  {!forgot && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          id="name"
                          name="name"
                          type="name"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
              <div>
                {!forgot && isUserRegistered && (
                  <>
                    <button
                      type="submit"
                      className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </>
                )}
                {!forgot && !isUserRegistered && collectOtp && (
                  <>
                    <button
                      type="submit"
                      className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600"
                      onClick={handleRegister}
                    >
                      Register
                    </button>
                  </>
                )}
                {!forgot && !isUserRegistered && !collectOtp && (
                  <>
                    <button
                      type="submit"
                      className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600"
                      onClick={handleEmailSubmit}
                    >
                      Register
                    </button>
                  </>
                )}
                {forgot && isUserRegistered && collectOtp && (
                  <>
                    <button
                      type="submit"
                      className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600"
                      onClick={handleUpdate}
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
              {!reset && !forgot && isUserRegistered && (
                <>
                  <p className="mt-10 text-center text-sm text-gray-500">
                    Forgot Password?
                    <a
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleSendOtp();
                        setForgot(true);
                      }}
                      className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                      Reset Password
                    </a>
                  </p>
                </>
              )}
              {reset && (
                <p className="mt-10 text-center text-sm text-gray-500">
                  Reset successfull, Please login again
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
