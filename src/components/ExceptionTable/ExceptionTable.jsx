import React, { useState } from "react";
import "./ExceptionTable.css";
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown"; 

const ExceptionTable = ({ onClose }) => {
  const [exceptionOption, setExceptionOption] = useState("");
  const [searchOption, setSearchOption] = useState("");

  const handleUpdate = () => {
    if (!searchOption) {
      alert("Vui lòng chọn thông tin tìm kiếm.");
      return;
    }
    console.log("Cập nhật ngoại lệ:", searchOption);
  };

  const handleCreateException = () => {
    if (!exceptionOption) {
      alert("Vui lòng chọn ngoại lệ để tạo.");
      return;
    }
    console.log("Tạo ngoại lệ mới:", exceptionOption);
  };

  const options = [
    { label: "Giám đốc | BDGD", value: "BDGD" },
    { label: "Cửa hàng trưởng | OPSM", value: "OPSM" },
    { label: "Phó giám đốc phụ trách Kinh doanh | BDVS", value: "BDVS" },
    { label: "Trưởng phòng Kinh doanh sỉ | WSMA", value: "WSMA" },
    { label: "Trưởng phòng CX | CXMA", value: "CXMA" },
    { label: "Trưởng phòng Thương mại Điện tử | ECMA", value: "ECMA" },
  ];

  return (
    <div className="exception-table-container">
      <div className="header">
        <h2>THÊM NGOẠI LỆ</h2>
        <button className="close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="16"
            height="16"
            fill="#fff"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      <div className="main-body">
        <div className="left-section">
          <label className="section-label">Ngoại lệ theo*</label>
          <SearchableDropdown
            options={options}
            selectedOption={exceptionOption}
            setSelectedOption={setExceptionOption}
            placeholder="-- Chọn --"
          />
        </div>

        <div className="right-section">
          <label className="section-label">Tìm kiếm</label>
          <SearchableDropdown
            options={options}
            selectedOption={searchOption}
            setSelectedOption={setSearchOption}
            placeholder="-- Chọn --"
          />
        </div>
      </div>

      <div className="create-exception-button-container">
        <button
          className="create-exception-button"
          onClick={handleCreateException}
        >
          <span className="icon-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="icon-plus"
            >
              <path d="M288 224V96h-64v128H96v64h128v128h64V288h128v-64H288z"></path>
            </svg>
          </span>
          <span className="label-text">Tạo ngoại lệ</span>
        </button>
      </div>

      <div className="footer-buttons">
        <button className="close-footer-button" onClick={onClose}>
          Đóng
        </button>
        <button className="update-footer-button" onClick={handleUpdate}>
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default ExceptionTable;
