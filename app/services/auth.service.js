import api from "../lib/api";

export const login = async (username, password) => {
  try {
    // call backend
    const response = await api.post(
      "https://sandboxbakery.suvotech.et/api/v1/auth/login",
      { username, password }
    );

    // Debugging: print full response
    console.log("Login service response:", response);

    // Token might come from headers
    let token = response.data?.token; // check data first
    if (!token && response.headers.authorization) {
      token = response.headers.authorization.split(" ")[1]; // remove 'Bearer '
    }

    if (!token) {
      throw new Error("Login failed: token not returned from server.");
    }

    // Optionally, you can store token in localStorage here
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    // Return token and user info (if any)
    return {
      token,
      user: response.data?.user || null,
    };
  } catch (error) {
    // Log full error for debugging
    console.error("Login service error:", error.response?.data || error);

    // Throw readable error message
    throw new Error(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
};
