import React, { useEffect, useState } from "react";
import "./User.css";
import { supabase } from "../../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const User = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [iddddd, setId] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateProfile()
  };

  const handleUpdateProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ name: firstName, email: email })
        .eq("user_id", iddddd)
        .single();

      if (error) {
        throw error;
      }

      console.log(data)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      toast.success("Edit successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const fetchProfileData = async (id) => {
    try {
      await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id)
        .single()
        .then((val) => {
          setFirstName(val.data.name);
          setEmail(val.data.email);
        });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(async () => {
    await supabase.auth.getUser().then((val) => {
      if (val?.data?.user?.id) {
        setId(val?.data?.user?.id);
        fetchProfileData(val?.data?.user?.id);
      }
    });
  }, []);

  return (
    <div className="user-info-page">
      <ToastContainer />
      <h1>User Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};
