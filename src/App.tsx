import {
  HashRouter,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import { useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import Login from "./pages/Login/Login";
import Nav from "./components/navbar/navbar";

function App() {
  const IsAuthenticated = useIsAuthenticated();
  const navigate = useNavigate()
  useEffect(() => {
    if (IsAuthenticated) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/"
      sessionStorage.removeItem("redirectAfterLogin")
      if(redirectPath != "/") {
        navigate(redirectPath, {replace: true})
      }
    }
  }, [IsAuthenticated]);
  return (
    <div className="bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee]  space-y-4">
      <Nav />
      <main className="max-w-[1200px] mx-auto ">
        <AuthenticatedTemplate>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        </UnauthenticatedTemplate>
      </main>
    </div>
  );
}

export default App;
