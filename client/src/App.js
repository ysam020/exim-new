import "./App.scss";
import { UserContext } from "./contexts/UserContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("exim_user"))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlShiftLeftArrow =
        event.ctrlKey && event.shiftKey && event.key === "ArrowLeft" && !isMac;
      const cmdShiftLeftArrow =
        event.metaKey && event.shiftKey && event.key === "ArrowLeft" && isMac;
      const ctrlShiftRightArrow =
        event.ctrlKey && event.shiftKey && event.key === "ArrowRight" && !isMac;
      const cmdShiftRightArrow =
        event.metaKey && event.shiftKey && event.key === "ArrowRight" && isMac;

      if (ctrlShiftLeftArrow || cmdShiftLeftArrow) {
        navigate(-1); // Go back to the previous page
      } else if (ctrlShiftRightArrow || cmdShiftRightArrow) {
        navigate(1); // Go forward to the next page
      }
    };

    const handleMouseDown = (event) => {
      // Disable text selection
      document.onselectstart = () => false;
      document.body.style.cursor = "grabbing"; // Change cursor to grabbing
      startX = event.clientX;
    };

    const handleMouseMove = (event) => {
      if (startX !== null) {
        const deltaX = event.clientX - startX;
        if (deltaX > 100) {
          // Swipe right to navigate forward
          navigate(1);
          resetDrag(); // Reset tracking and enable text selection
        } else if (deltaX < -100) {
          // Swipe left to navigate back
          navigate(-1);
          resetDrag(); // Reset tracking and enable text selection
        }
      }
    };

    const handleMouseUp = () => {
      resetDrag(); // Reset tracking and enable text selection
    };

    const resetDrag = () => {
      startX = null;
      document.onselectstart = null; // Re-enable text selection
      document.body.style.cursor = ""; // Reset cursor
    };

    let startX = null;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">{user ? <HomePage /> : <LoginPage />}</div>
    </UserContext.Provider>
  );
}

export default React.memo(App);
