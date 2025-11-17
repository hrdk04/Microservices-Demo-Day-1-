import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/login", form);

    alert(res.data.msg);

    if (res.data.status === "ok") {
      localStorage.setItem("email", form.email);
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} /><br />
        <button>Login</button>
      </form>
      <br />
      <Link to="/register">New user? Register</Link>
    </div>
  );
}

export default Login;
