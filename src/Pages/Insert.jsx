import React, { useState } from "react";
import axios from "axios";
import { getEncryptedToken } from "../utils/encryptToken";

const AddBusiness = () => {
  const [form, setForm] = useState({
    user_id: 1,
    BusinessCategory: "",
    BusinessName: "",
    BusinessWebsite: "",
    BusinessAddress: "",
    BusinessDescription: "",
    BusinessKeyword : ""
  });

  const [BusinessCard, setBusinessCard] = useState(null);
  const [BusinessLogo, setBusinessLogo] = useState(null);

  const url = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", form.user_id);
    formData.append("BusinessCategory", form.BusinessCategory);
    formData.append("BusinessName", form.BusinessName);
    formData.append("BusinessWebsite", form.BusinessWebsite);
    formData.append("BusinessAddress", form.BusinessAddress);
    formData.append("BusinessDescription", form.BusinessDescription);
    formData.append("BusinessKeyword" , form.BusinessKeyword);

    if (BusinessCard) formData.append("BusinessCard", BusinessCard);
    if (BusinessLogo) formData.append("BusinessLogo", BusinessLogo);

    try {
      const res = await axios.post(url+"/business", formData, {
        headers: { "Content-Type": "multipart/form-data",  "x-api-key": getEncryptedToken() },
      });
      alert("Business added successfully!");
      console.log(res.data);
      setForm({
        user_id: 1,
        BusinessCategory: "",
        BusinessName: "",
        BusinessWebsite: "",
        BusinessAddress: "",
        BusinessDescription: "",
        BusinessKeyword: ""
      });
      setBusinessCard(null);
      setBusinessLogo(null);
    } catch (err) {
      console.error(err);
      alert("Error adding business");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "20px auto" }}>
      <h2>Add Business</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Business Category"
          name="BusinessCategory"
          value={form.BusinessCategory}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Business Name"
          name="BusinessName"
          value={form.BusinessName}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Business Website"
          name="BusinessWebsite"
          value={form.BusinessWebsite}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Business Address"
          name="BusinessAddress"
          value={form.BusinessAddress}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Business Description"
          name="BusinessDescription"
          value={form.BusinessDescription}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />

         <input
          type="text"
          placeholder="Business Keyword"
          name="Businesskeyword"
          value={form.BusinessKeyword}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <div style={{ marginBottom: 10 }}>
          <label>Business Card: </label>
          <input
            type="file"
            onChange={(e) => setBusinessCard(e.target.files[0])}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Business Logo: </label>
          <input
            type="file"
            onChange={(e) => setBusinessLogo(e.target.files[0])}
          />
        </div>

        <button type="submit">Add Business</button>
      </form>
    </div>
  );
};

export default AddBusiness;
