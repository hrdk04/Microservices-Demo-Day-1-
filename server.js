const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json({ limit: "10mb" }));

mongoose.connect("mongodb://localhost:27017/mydb")
  .then(() => console.log("✅ Mongo Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

/* USER MODEL */
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String
}));

/* ITEM MODEL - FIXED FIELD NAMES */
const Item = mongoose.model("Item", new mongoose.Schema({
  itemName: String,      // Changed from 'name'
  itemPrice: Number,     // Changed from 'price'
  itemQuentity: Number,  // Changed from 'qty'
  itemImage: String      // Changed from 'image'
}));

/* REGISTER */
app.post("/register", async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.send({ msg: "Email already exists" });
    }
    await User.create(req.body);
    res.send({ msg: "Registered successfully" });
  } catch (err) {
    res.send({ msg: "Registration failed" });
  }
});

/* LOGIN - FIXED TO RETURN EMAIL */
app.post("/login", async (req, res) => {
  try {
    const u = await User.findOne(req.body);
    if (u) {
      res.send({ loggedIn: true, email: u.email }); // Added email
    } else {
      res.send({ loggedIn: false });
    }
  } catch (err) {
    res.send({ loggedIn: false });
  }
});

/* ADD ITEM */
app.post("/item", async (req, res) => {
  try {
    console.log("Creating item:", req.body); // Debug log
    const item = await Item.create(req.body);
    console.log("Item created:", item); // Debug log
    res.send({ message: "Added", item });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send({ message: "Failed to add item" });
  }
});

/* GET ITEMS */
app.get("/item", async (req, res) => {
  try {
    const items = await Item.find();
    console.log("Fetching items:", items.length); // Debug log
    res.send(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send([]);
  }
});

/* UPDATE ITEM */
app.put("/item/:id", async (req, res) => {
  try {
    console.log("Updating item:", req.params.id, req.body); // Debug log
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.send({ message: "Updated" });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send({ message: "Update failed" });
  }
});

/* DELETE ITEM */
app.delete("/item/:id", async (req, res) => {
  try {
    console.log("Deleting item:", req.params.id); // Debug log
    await Item.findByIdAndDelete(req.params.id);
    res.send({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send({ message: "Delete failed" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));