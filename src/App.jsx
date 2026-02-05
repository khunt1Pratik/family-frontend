import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./Auth Pages/login";
import RegisterPage from "./Auth Pages/Register";
import Navbar from "./Component/Navbar";
import EditFamily from "./Pages/EditProfile";
import Edit from "./Pages/EditProfile";
import AdminBusinessList from "./Admin/AdminBusinessList";
import AdminUpdateForm from "./Admin/AdminEditBus";
import UserFamilyList from "./Pages/List";
import HomePage from "./Component/HomePage";
import AddBusiness from "./Admin/Addbusiness";
import BusinessDetail from "./Pages/BusinessDetail";
import UserList from "./Admin/UserList";
import EditBusiness from "./Pages/EditBusiness";
import CategoryPage from "./Admin/category";
import AddUser from "./Admin/AddUser"
import AdminUserEdit from "./Admin/userEdit";
import AddUserBusiness from "./Pages/AddUserBusiness";
import PopularSearch from "./Component/PopularBusiness";
import AdminKeyword from "./Admin/AdminKeyword";



const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  if (isAdmin !== true) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />

          <Route path="/popularSearch" element={<PopularSearch />} />



          {/* User Route */}

          <Route path="/familyList" element={<ProtectedUserRoute><UserFamilyList /></ProtectedUserRoute>} />
          <Route path="/editfamily/:id" element={<ProtectedUserRoute><Edit /></ProtectedUserRoute>} />
          <Route path="/useredit/:id" element={<ProtectedUserRoute><EditFamily /></ProtectedUserRoute>} />
          <Route path="/editbusiness/:id" element={<ProtectedUserRoute><EditBusiness /></ProtectedUserRoute>} />
          <Route path="/adduserbusiness" element={<ProtectedUserRoute><AddUserBusiness /></ProtectedUserRoute>} />
          <Route path="/BusinessDetail/:id" element={<ProtectedUserRoute><BusinessDetail /></ProtectedUserRoute>} />


          {/* Admin Route */}
          <Route path="/adminBusinessList" element={<ProtectedAdminRoute><AdminBusinessList /></ProtectedAdminRoute>} />
          <Route path="/userList" element={<ProtectedAdminRoute><UserList /></ProtectedAdminRoute>} />
          <Route path="/adminUserEdit/:id" element={<ProtectedAdminRoute><AdminUserEdit /></ProtectedAdminRoute>} />
          <Route path="/adminEdit/:id" element={<ProtectedAdminRoute><AdminUpdateForm /></ProtectedAdminRoute>} />
          <Route path="/addUser" element={<ProtectedAdminRoute><AddUser /></ProtectedAdminRoute>} />
          <Route path="/AddBusiness" element={<ProtectedAdminRoute><AddBusiness /></ProtectedAdminRoute>} />
          <Route path="/CategoryPage" element={<ProtectedAdminRoute><CategoryPage /></ProtectedAdminRoute>} />
          <Route path="/keyword" element={<ProtectedAdminRoute><AdminKeyword /></ProtectedAdminRoute>} />




        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
