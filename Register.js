import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/register", form);
    alert(res.data.msg);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input type="text" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} /><br />
        <input type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} /><br />

        <button>Register</button>
      </form>
      <br />
      <Link to="/">Already registered? Login</Link>
    </div>
  );
}

export default Register;
