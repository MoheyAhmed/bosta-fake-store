import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/endpoints";
import { useAuthStore } from "../store/authStore";
import ErrorState from "../components/ErrorState";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("mor_2314"); // FakeStore demo user often works
  const [password, setPassword] = useState("83r5^_");   // common demo pass
  const [touched, setTouched] = useState(false);

  const mutation = useMutation({
    mutationFn: () => loginRequest({ username, password }),
    onSuccess: (data) => {
      // Fake Store returns token (no profile). We store typed username for header.
      login({ username, token: data?.token || "token" });
      navigate("/products", { replace: true });
    },
  });

  const errMsg = touched && (!username.trim() || !password.trim())
    ? "Username and password are required."
    : "";

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!username.trim() || !password.trim()) return;
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">
        Access Create Product & Cart (protected routes).
      </p>

      {mutation.isError ? (
        <div className="mt-4">
          <ErrorState message="Login failed. Please verify credentials and try again." />
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-5">
        <div>
          <label className="block text-sm font-medium text-slate-800">Username</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        {errMsg ? <p className="text-xs text-red-600">{errMsg}</p> : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

       
      </form>
    </div>
  );
}
