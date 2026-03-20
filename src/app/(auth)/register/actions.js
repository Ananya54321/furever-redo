// actions for user

import axios from "axios";

export async function registerUser(data) {
  try {
    const response = await axios.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error("Failed to register user");
  }
}
