import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import  Navbar  from "./Navbar";
import Dashboard from "./Dashboard";
function App() {
  return (
   <BrowserRouter>
   <Navbar/>
    <Routes>
        <Route path='/' element={ <Login /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='/dashboard' element={ <Dashboard /> } />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
