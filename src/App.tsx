import {
  HashRouter,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import { useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import Login from "./components/Login/Login";

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
    <div className="bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen space-y-4">
      <Nav />
      <main className="max-w-[1200px] mx-auto">
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
