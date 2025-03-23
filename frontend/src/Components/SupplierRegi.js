import React, { useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SupplierRegi() {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8090/suppliers", data);
      setMessage("Supplier added successfully!");
      reset();
    } catch (error) {
      setMessage("Error adding supplier");
      console.error(error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2 className="title">Register Supplier</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              {...register("contactNumber", { required: true })}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              {...register("address", { required: true })}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Items</label>
            <input
              type="text"
              {...register("items", { required: true })}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Register Supplier
          </button>
        </form>
      </div>
    </div>
  );
}

export default SupplierRegi;
