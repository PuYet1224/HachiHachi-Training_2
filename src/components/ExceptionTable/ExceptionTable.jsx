import React, { useState } from "react";
import "./ExceptionTable.css";
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown";
import exceptionOptionsdata from "../../assets/exceptionOptionsdata";
import positionOptionsdata from "../../assets/positionOptionsdata";
import workLocationOptionsdata from "../../assets/workLocationOptionsdata";
import employeeTypeOptionsdata from "../../assets/employeeTypeOptionsdata";
import unitMappingdata from "../../assets/unitMappingdata"; 

const headPositions = ["Giám đốc", "Trưởng phòng CX", "Trưởng phòng Thương mại Điện tử", "Trưởng phòng Kinh doanh sỉ","Cửa hàng trưởng"]; 

const ExceptionTable = ({ onClose }) => {
  const [exceptionOption, setExceptionOption] = useState(""); 
  const [searchOption, setSearchOption] = useState(""); 
  const [isExceptionDisabled, setIsExceptionDisabled] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true); 
  const [tableRows, setTableRows] = useState([]); 
  const [expandedRow, setExpandedRow] = useState(null);
  
  const toggleExpandedRow = (rowId) => {
    setExpandedRow((prevRow) => (prevRow === rowId ? null : rowId));
  };
  // Get search options based on selected exception
  const getSearchOptions = (exception) => {
    switch (exception) {
      case "Chức danh":
        return positionOptionsdata;
      case "Điểm làm việc":
        return workLocationOptionsdata;
      case "Loại nhân sự":
        return employeeTypeOptionsdata;
      default:
        return []; // Return empty array if no exception selected
    }
  };

  const getSearchPlaceholder = (exception) => {
    switch (exception) {
      case "Chức danh":
        return "Tìm theo mã và tên chức danh";
      case "Điểm làm việc":
        return "Tìm theo mã và tên điểm làm việc";
      case "Loại nhân sự":
        return "Tìm theo mã và loại nhân sự";
      default:
        return "-- Chọn --";
    }
  };

  const handleExceptionChange = (value) => {
    setExceptionOption(value);
    setSearchOption("");
    setTableRows([]); 

    if (value === "-- Chọn --" || !value) {
      setIsSearchDisabled(true);
    } else {
      setIsSearchDisabled(false); 
    }

    setIsExceptionDisabled(false); 
  };
  
  const handleSearchChange = (value) => {
    if (!value) return;
    setSearchOption(value);
    addRowToTable(exceptionOption, value);
    setIsExceptionDisabled(true);
    setSearchOption("");
  };

  const addRowToTable = (exception, searchValue) => {
    if (!searchValue) return;

    let additionalData = {};
    let label = ""; 
    let isHead = false; // Flag to check if the position is a head

    if (exception === "Chức danh") {
      const selectedPosition = positionOptionsdata.find(
        (item) => item.value === searchValue
      );
      if (selectedPosition) {
        const [positionLabel, positionCode] = selectedPosition.label.split(" | ");
        label = positionLabel;
        additionalData = {
          unit: unitMappingdata[positionCode] || "Đơn vị không xác định",
          isHead: headPositions.includes(positionLabel),
        };
      }
    } else if (exception === "Điểm làm việc") {
      const selectedLocation = workLocationOptionsdata.find(
        (item) => item.value === searchValue
      );
      if (selectedLocation) {
        const [locationLabel, locationCode] = selectedLocation.label.split(" | ");
        label = locationLabel;
        additionalData = {
          locationName: locationLabel,
        };
      }
    } else if (exception === "Loại nhân sự") {
      const selectedEmployeeType = employeeTypeOptionsdata.find(
        (item) => item.value === searchValue
      );
      if (selectedEmployeeType) {
        label = selectedEmployeeType.label;
        additionalData = {
          employeeType: selectedEmployeeType.label,
        };
      }
    }

    const newRow = {
      id: Date.now(), // Unique ID for each row
      exception,
      value: searchValue,
      label, // Store the label for display
      ...additionalData,
    };

    setTableRows((prevRows) => {
      return [...prevRows, newRow];
    });
  };

  const handleDeleteRow = (id) => {
    setTableRows((prevRows) => {
      return prevRows.filter((row) => row.id !== id);
    });
    if (tableRows.length <= 1) { // Adjusted to handle the removal of the last row
      setIsExceptionDisabled(false);
    }
  };

  const handleExceptionChangeInRow = (id, newException) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          let updatedRow = { ...row, exception: newException, value: "", label: "" };
          if (newException === "Chức danh") {
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  const searchOptions = getSearchOptions(exceptionOption);
  const searchPlaceholder = getSearchPlaceholder(exceptionOption);

  const getAvailableExceptionOptions = (currentException) => {
    return exceptionOptionsdata.map(option => ({
      ...option,
      disabled: option.value === currentException
    }));
  };

  return (
    <div className="exception-table-container">
      {/* Header */}
      <div className="header">
        <h2>THÊM NGOẠI LỆ</h2>
        <button className="close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="16"
            height="16"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {/* Main Body */}
      <div className="main-body">
        <div className="left-section">
          <label className="section-label">Ngoại lệ theo(*)</label>
          <SearchableDropdown
            options={exceptionOptionsdata}
            selectedOption={exceptionOption}
            setSelectedOption={handleExceptionChange}
            placeholder="-- Chọn --"
            disabled={isExceptionDisabled} 
          />
        </div>

        {/* Section: Tìm kiếm */}
        <div className="right-section">
          <label className="section-label">Tìm kiếm</label>
          <SearchableDropdown
            options={searchOptions}
            selectedOption={searchOption}
            setSelectedOption={handleSearchChange}
            placeholder={searchPlaceholder}
            disabled={!exceptionOption || exceptionOption === "-- Chọn --"}
          />
        </div>
      </div>

      {tableRows.length > 0 && (
  <div className="table-section">
    <table className="exception-table">
      <thead>
        <tr>
          <th></th>
          <th>{exceptionOption}</th>
          {tableRows.some((row) => row.exception === "Chức danh") && (
            <>
              <th>Đơn vị trực thuộc</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {tableRows.map((row) => (
          <tr key={row.id}>
            {/* Dropdown symbol */}
            <td>
              <button className="dropdown-button" title="Chọn loại ngoại lệ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 451.846 451.847"
                  width="16"
                  height="16"
                  className="custom-cursor-on-hover"
                >
                  <path
                    d="M225.923,353.169L31.73,159.977c-12.497-12.497-12.497-32.758,0-45.255
                      c12.497-12.497,32.758-12.497,45.255,0L225.923,262.659L375.86,112.722c12.497-12.497,32.758-12.497,45.255,0
                      c12.497,12.497,12.497,32.758,0,45.255L225.923,353.169z"
                    fill="#1A6634"
                  ></path>
                </svg>
              </button>
            </td>

            {/* Giá trị cột chính */}
            <td>
              {row.exception === "Chức danh" && row.label}
              {row.exception === "Điểm làm việc" && row.locationName}
              {row.exception === "Loại nhân sự" && row.employeeType}
            </td>

            {/* Chỉ hiển thị "Đơn vị trực thuộc" nếu ngoại lệ là "Chức danh" */}
            {row.exception === "Chức danh" && <td>{row.unit}</td>}

            {/* Chỉ hiển thị "Trưởng đơn vị" nếu ngoại lệ là "Chức danh" */}
            {row.exception === "Chức danh" && (
              <td>{row.isHead ? "Trưởng đơn vị" : ""}</td>
            )}

            {/* Loại ngoại lệ */}
            <td>
              <SearchableDropdown
                options={getAvailableExceptionOptions(row.exception)}
                selectedOption={row.exception}
                setSelectedOption={(newException) =>
                  handleExceptionChangeInRow(row.id, newException)
                }
                placeholder="-- Chọn --"
                disabled={false}
              />
            </td>

            {/* Actions Column */}
            <td>
              <button
                className="trash-button"
                onClick={() => handleDeleteRow(row.id)}
                title="Xóa"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="16"
                  height="16"
                  fill="#fff"
                >
                  <path d="M135.2 17.7L128 0H320l-7.2 17.7C309.4 32.3 320 48.6 320 66.7V96h32v32c0 8.8-7.2 16-16 16h-32v288c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V144H64c-8.8 0-16-7.2-16-16V96h32V66.7c0-18.1 10.6-34.4 27.2-49Z" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {/* Create Exception Button */}
      <div className="create-exception-button-container">
        <button
          className="create-exception-button"
          onClick={() => {
            if (exceptionOption && searchOption) {
              addRowToTable(exceptionOption, searchOption);
            } else {
              alert("Vui lòng chọn ngoại lệ và tìm kiếm để tạo.");
            }
          }}
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

      {/* Footer Buttons */}
      <div className="footer-buttons">
        <button className="close-footer-button" onClick={onClose}>
          Đóng
        </button>
        <button
          className="update-footer-button"
          onClick={() => {
            if (tableRows.length === 0) {
              alert("Không có ngoại lệ nào để cập nhật.");
              return;
            }
            console.log("Cập nhật ngoại lệ:", tableRows);
          }}
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default ExceptionTable;
