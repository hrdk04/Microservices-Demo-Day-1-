import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/simpleLogin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String
}));

const Item = mongoose.model("Item", new mongoose.Schema({
    itemName: String,
    itemImage: String,
    itemPrice: Number,
    itemQuentity: Number
}))

app.post('/addItem', async(req, res)=>{
    const { itemName, itemImage, itemPrice, itemQuentity} = req.body;
    const itm=new Item({itemName,itemImage,itemPrice , itemQuentity})
    await itm.save();
    res.json({msg:"item saved"})
});

app.get('/getItem', async (req,res)=>{
    const get= await Item.find();
    console.log(get)
    res.json(get);
});

app.put('/update/:id',async(req,res)=>{
    const { itemName, itemImage, itemPrice, itemQuentity} = req.body;
    await Item.findByIdAndUpdate(req.params.id,{
        itemName,itemImage,itemPrice,itemQuentity
    });
    res.json({msg: 'Item Updated!'});
});

app.delete('/delete/:id', async(req,res)=>{
    await Item.findByIdAndDelete(req.params.id);
    res.json({msg:'item deleted!'})
});

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ status: "error", msg: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashed });
  await user.save();

  res.json({ status: "ok", msg: "Registered successfully" });
});

// LOGIN (NO TOKEN)
let serverLoginState = {};   // stores active sessions without JWT

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ status: "error", msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ status: "error", msg: "Incorrect password" });

  // simple login flag (not secure, but as per your requirement)
  serverLoginState[email] = true;

  res.json({ status: "ok", msg: "Login successful", email });
});

// CHECK LOGIN
app.post("/checkLogin", (req, res) => {
  const { email } = req.body;
  if (serverLoginState[email]) return res.json({ loggedIn: true });
  return res.json({ loggedIn: false });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
