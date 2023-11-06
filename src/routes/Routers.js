import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import AllFoods from "../pages/AllFoods";
import FoodDetails from "../pages/FoodDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Forgetpassword } from "../pages/Forgetpassword";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../supabase";
import { Admin } from "../pages/Admin/Admin";
import { AdminEdit } from "../pages/Admin/AdminEdit";
import { User } from "../pages/user/User";

const Routers = () => {
  const [pageAuth, setpageAuth] = useState(false);

  useEffect(async () => {
    await supabase.auth.getUser().then((val) => {
      if (val?.data?.user?.id) {
        setpageAuth(true);
      } else {
        setpageAuth(false);
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/foods" element={<AllFoods />} />
      <Route path="/foods/:id" element={<FoodDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/checkout"
        element={pageAuth ? <Checkout /> : <Navigate to="/home" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgetpasword" element={<Forgetpassword />} />
      <Route
        path="/admin"
        element={pageAuth ? <Admin /> : <Navigate to="/home" />}
      />
      <Route
        path="/admin/edit/:id"
        element={pageAuth ? <AdminEdit /> : <Navigate to="/home" />}
      />
      <Route
        path="/user"
        element=<User />
      />
    </Routes>
  );
};

export default Routers;
