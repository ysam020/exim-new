import "./App.scss";
import { UserContext } from "./contexts/UserContext";
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("exim_user"))
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">{user ? <HomePage /> : <LoginPage />}</div>
    </UserContext.Provider>
  );
}

export default React.memo(App);
