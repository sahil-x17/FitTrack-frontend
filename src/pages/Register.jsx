import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtpRegistration, verifyOtpRegistration } from "../services/api";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await requestOtpRegistration(form);
      setStep(2); // move to OTP input step
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await verifyOtpRegistration(form.email, otp);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={step === 1 ? handleSubmitStep1 : handleSubmitStep2}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">
          {step === 1 ? "Register" : "Verify OTP"}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === 1 ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              required
            />
          </>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              We've sent a 6-digit OTP to <strong>{form.email}</strong>.
            </p>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {step === 1 ? "Send OTP" : "Verify & Register"}
        </button>
      </form>
    </div>
  );
}
