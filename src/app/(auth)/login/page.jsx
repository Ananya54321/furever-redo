"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { loginAction } from "../../../../actions/loginActions";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    userType: "user",
  });

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type) => {
    setUser((prevUser) => ({ ...prevUser, userType: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAction(user);

      if (!result.success) {
        setError(result.error || "Login failed. Please try again.");
      } else {
        console.log("Login successful");
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email" name="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-800"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password" name="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-800"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        name="submit"
        className="w-full bg-yellow-800 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-300 disabled:bg-yellow-500 disabled:cursor-not-allowed">
        {loading ? "Logging in..." : `Login as ${user.userType}`}
      </button>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-yellow-800 hover:text-yellow-700 font-medium">
            Register here
          </button>
        </p>
      </div>
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg ">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <Tabs defaultValue="user" className="w-[400px]">
          <TabsList>
            <TabsTrigger
              value="user"
              onClick={() => handleUserTypeChange("user")}>
              User Account
            </TabsTrigger>
            <TabsTrigger
              value="seller"
              onClick={() => handleUserTypeChange("seller")}>
              Seller Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user">{renderForm()}</TabsContent>
          <TabsContent value="seller">{renderForm()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
