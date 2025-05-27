import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export const Sidebar = (logout) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  console.log("Sidebar role:", role);
  return (
    <div style={{ width: "170px", background: "#f4f4f4", padding: "1rem" }}>
      <h2>Menu</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {role === "mcadmin" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link
                style={{
                  padding: "20px",
                  margin: "20px 0",
                  fontSize: "16px",
                  color: "#2e5939",
                }}
                to="/server"
              >
                Server Page
              </Link>
            </li>
            <li>
              <Link
                style={{
                  padding: "20px",
                  margin: "20px 0",
                  fontSize: "16px",
                  color: "#2e5939",
                }}
                to="/user"
              >
                User Page
              </Link>
            </li>
            {/* <li>
              <button onClick={handleLogout}>Logout</button>
            </li> */}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <li>
              <Link
                style={{
                  padding: "20px",
                  margin: "20px 0",
                  fontSize: "16px",
                  color: "#2e5939",
                }}
                to="/available"
              >
                Available Servers
              </Link>
            </li>
            {/* <li>
              <button onClick={handleLogout}>Logout</button>
            </li> */}
          </div>
        )}
      </ul>
    </div>
  );
};
