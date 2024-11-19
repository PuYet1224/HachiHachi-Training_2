// src/App.jsx
import React, { useState } from "react";
import ExceptionTable from "./components/ExceptionTable/ExceptionTable";
import "./App.css";

const App = () => {
  const [isExceptionTableVisible, setExceptionTableVisible] = useState(true);

  const handleClose = () => {
    setExceptionTableVisible(false);
  };

  const handleOpen = () => {
    setExceptionTableVisible(true);
  };

  return (
    <div className="app-container">
      {isExceptionTableVisible ? (
        <ExceptionTable onClose={handleClose} />
      ) : (
        <button className="open-exception-button" onClick={handleOpen}>
          Mở Thêm Ngoại Lệ
        </button>
      )}
    </div>
  );
};

export default App;
