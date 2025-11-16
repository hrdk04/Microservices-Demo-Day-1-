import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

function Dashboard() {
  const [status, setStatus] = useState(false);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const [item,setItem] = useState([]);
  const [form, setForm] =useState({itemName:'',itemImage: '', itemPrice: '', itemQuentity:''})
  const [edit, setedit] = useState(null)
  
  useEffect(() => {
    setStatus(email)
    loadItem();
  }, []);

  const loadItem=()=>{
    fetch("http://localhost:5000/getItem")
    .then(res=> res.json())
    .then(data=>setItem(data))
    .catch(err=>console.log(err));
  }

  const updateItem = async(e) =>{
    e.preventDefault();
    await axios.put(`http://localhost:5000/update/${edit._id}`,edit)
    setedit(null);
    loadItem();
  }

  const deleteItem= async(id)=>{
        await axios.delete(`http://localhost:5000/delete/${id}`);
        loadItem();
  }
  const submit = async (e)=>{
    e.preventDefault();
    const res= await axios.post('http://localhost:5000/addItem',form)
    alert(res.data.msg)
    loadItem();
    // setForm({itemName:'',itemImage: '', itemPrice: '', itemQuentity:''});
  }



  if (!status) return <h2>Checking login…<Link to="/" >Login</Link></h2>;

  return (
    <>
    <div style={{ padding: 20 }}>
      <h1>Welcome, {email}</h1>
      <button onClick={() => { localStorage.clear(); navigate("/"); }}> Logout </button>
        <div style={{border:'1px solid red'}}>
                <h2>{edit? "Edit Item": "Add Item"}</h2>
                <form onSubmit={edit ? updateItem:submit} >
                    <input type="text" value={edit? edit.itemName : form.itemName}  placeholder="Enter item name" onChange={(e)=> edit ? setedit({...edit, itemName: e.target.value}): setForm({...form, itemName: e.target.value})} /> <br/>
                    <input type="text" value={edit? edit.itemImage : form.itemImage}  placeholder="Enter Image URL" onChange={(e)=> edit ? setedit({...edit, itemImage: e.target.value}): setForm({...form, itemImage: e.target.value})} /> <br/>
                    <input type="text" value={edit? edit.itemPrice : form.itemPrice}  maxLength={5} placeholder="Enter Price" onChange={(e)=> edit ? setedit({...edit, itemPrice: e.target.value}): setForm({...form, itemPrice: e.target.value})} /> <br/>
                    <input type='text' value={edit? edit.itemQuentity : form.itemQuentity} maxLength={3} placeholder="Quentity" onChange={(e)=> edit ? setedit({...edit, itemQuentity: e.target.value}): setForm({...form,itemQuentity: e.target.value})}/> <br/>
                    <button>{edit? "Upate":"Add" }</button>
                    {edit && (
                        <button type="button" onClick={()=> setedit(null)} >Cancel</button>
                    )}
                </form>
        </div>
            
        <h1>Item list</h1>
        <div style={{border:'1px solid #ccc', display:'flex',flexWrap:'wrap', margin:'0 10px'}}>
                {item.map((i)=>(
                    <div key={i._id} style={{border:'1px solid #ccc',
                        padding:'10px',marginBottom:'10px', width:'250px',
                    }}>
                        <h2>{i.itemName}</h2>
                        <img src={i.itemImage} alt="" width='200' height='200' /> 
                        <p>Price: {i.itemPrice}</p>
                        <p>Quantity: {i.itemQuentity}</p>
                        <button onClick={()=> setedit(i)} >Edit</button>
                        <button onClick={()=> deleteItem(i._id)} >Delete</button>
                    </div>
                ))}
        </div>
    </div>
    </>
  );
}

export default Dashboard;
