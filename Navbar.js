import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>My App</h2>

      <div style={styles.links}>
        <Link style={styles.link} to="/">Login</Link>
        <Link style={styles.link} to="/register">Register</Link>
        {/* <Link style={styles.link} to="/dashboard">Dashboard</Link> */}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "15px 20px",
    background: "#222",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px"
  }
};
