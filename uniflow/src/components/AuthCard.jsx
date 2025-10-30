import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import UniflowLogo from "../assets/uniflow-logo.png";
import "./auth.css";

const WARDEN_EMAIL = "skavinda742@gmail.com";
const WARDEN_PASSWORD = "shehan";
const DOCTOR_EMAIL = "skavinda771@gmail.com";
const DOCTOR_PASSWORD = "kavinda";

const formCopy = {
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to continue managing your campus experience.",
    actionText: "Login",
    togglePrompt: "Don't have an account?",
    toggleLabel: "Sign Up",
    nextState: "signup",
  },
  signup: {
    title: "Create Account",
    subtitle: "Join Uniflow and stay connected with your campus community.",
    actionText: "Sign Up",
    togglePrompt: "Already have an account?",
    toggleLabel: "Login",
    nextState: "login",
  },
};

const defaultLogin = { email: "", password: "" };
const defaultSignup = { name: "", email: "", password: "" };

function AuthCard({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [loginValues, setLoginValues] = useState(defaultLogin);
  const [signupValues, setSignupValues] = useState(defaultSignup);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const copy = useMemo(() => formCopy[mode], [mode]);

  const handleToggle = () => {
    setFeedback("");
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  const handleToggleKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setSignupValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    const { email, password } = loginValues;
    const isWarden = email === WARDEN_EMAIL && password === WARDEN_PASSWORD;
    const isDoctor = email === DOCTOR_EMAIL && password === DOCTOR_PASSWORD;

    try {
      if (!isWarden && !isDoctor) {
        await signInWithEmailAndPassword(auth, email, password);
      }

      const role = isWarden ? "warden" : isDoctor ? "doctor" : "student";
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      setFeedback("Login successful!");
      onAuthSuccess?.(role);

      navigate(
        role === "warden" ? "/warden" : role === "doctor" ? "/doctor" : "/dashboard",
        { replace: true },
      );
    } catch (error) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      setFeedback("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    const { name, email, password } = signupValues;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name.trim() });
      setFeedback("Signup successful! You can now login.");
      setSignupValues(defaultSignup);
      setMode("login");
      setLoginValues({ email, password: "" });
    } catch (error) {
      setFeedback(error.message || "Unable to create account right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`auth-card auth-card--login slide-fade ${mode}`}>
      <div className="auth-card__brand">
        <img src={UniflowLogo} alt="Uniflow Logo" className="auth-card__logo" />
      </div>
      <h2 className="auth-card__title">{copy.title}</h2>
      <p className="auth-card__subtitle">{copy.subtitle}</p>

      {mode === "login" ? (
        <form
          key="login"
          className="auth-card__form slide-fade"
          onSubmit={handleLoginSubmit}
        >
          <label className="auth-card__field">
            <span>Email</span>
            <input
              className="auth-card__input"
              type="email"
              name="email"
              placeholder="student@example.com"
              value={loginValues.email}
              onChange={handleLoginChange}
              required
            />
          </label>
          <label className="auth-card__field">
            <span>Password</span>
            <input
              className="auth-card__input"
              type="password"
              name="password"
              placeholder="********"
              value={loginValues.password}
              onChange={handleLoginChange}
              required
            />
          </label>
          <button className="auth-card__submit" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : copy.actionText}
          </button>
        </form>
      ) : (
        <form
          key="signup"
          className="auth-card__form slide-fade"
          onSubmit={handleSignupSubmit}
        >
          <label className="auth-card__field">
            <span>Full Name</span>
            <input
              className="auth-card__input"
              type="text"
              name="name"
              placeholder="Your name"
              value={signupValues.name}
              onChange={handleSignupChange}
              required
            />
          </label>
          <label className="auth-card__field">
            <span>Email</span>
            <input
              className="auth-card__input"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={signupValues.email}
              onChange={handleSignupChange}
              required
            />
          </label>
          <label className="auth-card__field">
            <span>Password</span>
            <input
              className="auth-card__input"
              type="password"
              name="password"
              placeholder="Create a password"
              value={signupValues.password}
              onChange={handleSignupChange}
              required
            />
          </label>
          <button className="auth-card__submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : copy.actionText}
          </button>
        </form>
      )}

      {feedback && <p className="auth-card__feedback">{feedback}</p>}

      <p className="auth-card__toggle">
        {copy.togglePrompt}{" "}
        <span
          onClick={handleToggle}
          onKeyDown={handleToggleKey}
          role="button"
          tabIndex={0}
        >
          {copy.toggleLabel}
        </span>
      </p>
    </div>
  );
}

export default AuthCard;
