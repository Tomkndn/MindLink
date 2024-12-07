import { create } from "zustand";
//i have change this plz uncomment below line 
// const baseUrl = import.meta.env.VITE_API_URL;
const baseUrl="http://localhost:5000";
const useStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  initializeAuth: async () => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(baseUrl + "/api/auth/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { user } = await response.json();
          set({ user, isAuthenticated: true, loading: false });
        } else {
          localStorage.removeItem("token");
          set({ user: null, isAuthenticated: false, loading: false });
        }
      } catch (error) {
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false, loading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  signUp: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(baseUrl + "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Sign-up failed");
      }

     
      set({ user: data.user, isAuthenticated: true, loading: false });
      return { ok: true, data };  
    } catch (err) {
      set({ loading: false, error: err.message });
      return { ok: false, error: err.message };
    }
  },

  signIn: async ({ email, password }) => {
    set({ loading: true, error: null });
    console.log("email: ",email);
    console.log("password: ",password); 
    try {
      const response = await fetch(baseUrl + "/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const { token } = await response.json();

      localStorage.setItem("token", token);
      localStorage.setItem("email",email);

      set({ user: { email }, isAuthenticated: true, loading: false });

      return true;
    } catch (error) {
      console.error(error);
      set({ loading: false, error: error.message });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
  
}));
export default useStore;
