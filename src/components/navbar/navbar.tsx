import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";

import {loginRequest} from "../../authConfig"

const Nav = () => {
  const {instance} = useMsal();
  const IsAuthenticated = useIsAuthenticated()
  const account = instance.getActiveAccount()
  const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).then( result => console.log("success ", result)).catch((err) => console.log(err))
  }
  
  const handleLogoffRedirect = () => {
    instance.logoutRedirect().catch((error) => console.log(error));
  }

  return (
    <div className=" bg-white">
      <div className="max-w-[1200px] mx-auto h-16 flex justify-between items-center gap-2">
        <div>
          <span className="text-xl font-semibold">COE Automation</span>
        </div>
        <ul className="flex gap-[4vw] items-center">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="products">Products</Link>
          </li>
        </ul>
        <div>
            {IsAuthenticated ? <button onClick={handleLogoffRedirect}> {account?.name} </button> : <button onClick={handleLoginRedirect}>Login </button> }
        </div>
      </div>
    </div>
  );
};

export default Nav;
