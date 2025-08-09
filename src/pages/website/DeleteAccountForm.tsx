import React, { useState } from "react";
import "./DeleteAccountForm.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authPost } from "../../axios/useAuthPost";

const DeleteAccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    app: "",
  });

  const user = useSelector(selectCurrentUser);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const response = await authPost(`user/deleteuser`, formData, user.token);
    if (response.message === "Delete account request sent successfully") {
      alert("Request submitted! Your account will be deleted within 48 hours.");
    }
  };

  return (
    <div className="delete-account-form">
      <h2>Delete My Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Registered Email ID</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Mobile Number</label>
          <input
            type="tel"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit number"
          />
        </div>

        <div>
          <label>Delete Account For</label>
          <select
            name="app"
            required
            value={formData.app}
            onChange={handleChange}
          >
            <option value="">Select App</option>
            <option value="swaasthya">Swaasthya</option>
            <option value="v-track">V-Track</option>
            <option value="vitalz">Vitalz</option>
          </select>
        </div>

        <p className="info-text">
          Within <strong>48 hours</strong> of the request submission, your
          requested account will be deleted.
        </p>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default DeleteAccountForm;
