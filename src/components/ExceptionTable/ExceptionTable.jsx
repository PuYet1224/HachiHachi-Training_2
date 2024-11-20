// ExceptionTable.jsx
import React, { useState } from "react";
import "./ExceptionTable.css";
import SearchableDropdown from "../SearchableDropdown/SearchableDropdown";
import exceptionOptionsdata from "../../assets/exceptionOptionsdata";
import positionOptionsdata from "../../assets/positionOptionsdata";
import workLocationOptionsdata from "../../assets/workLocationOptionsdata";
import employeeTypeOptionsdata from "../../assets/employeeTypeOptionsdata";
import unitMappingdata from "../../assets/unitMappingdata";

const headPositions = [
  "Giám đốc",
  "Trưởng phòng CX",
  "Trưởng phòng Thương mại Điện tử",
  "Trưởng phòng Kinh doanh sỉ",
  "Cửa hàng trưởng",
];

const ExceptionTable = ({ onClose }) => {
  const [exceptionOption, setExceptionOption] = useState("");
  const [searchOption, setSearchOption] = useState("");
  const [isExceptionDisabled, setIsExceptionDisabled] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [tableRows, setTableRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const allExceptions = ["Chức danh", "Điểm làm việc", "Loại nhân sự"];

  const getSearchOptions = (exception) => {
    switch (exception) {
      case "Chức danh":
        return positionOptionsdata;
      case "Điểm làm việc":
        return workLocationOptionsdata;
      case "Loại nhân sự":
        return employeeTypeOptionsdata;
      default:
        return [];
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

    setIsSearchDisabled(value === "-- Chọn --" || !value ? true : false);

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
    let isHead = false;

    if (exception === "Chức danh") {
      const selectedPosition = positionOptionsdata.find(
        (item) => item.value === searchValue
      );
      if (selectedPosition) {
        const [positionLabel, positionCode] =
          selectedPosition.label.split(" | ");
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
        const [locationLabel] = selectedLocation.label.split(" | ");
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
      id: Date.now(),
      exception,
      value: searchValue,
      label,
      dropdownValue: "-- Chọn --",
      hasSubTable: false,
      subDropdownValue: "",
      hasNestedTable: false,
      nestedRows: [],
      showTrashIconInNestedTable: false,
      ...additionalData,
    };

    setTableRows((prevRows) => [...prevRows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setTableRows((prevRows) => {
      return prevRows.filter((row) => row.id !== id);
    });
    if (tableRows.length <= 1) {
      setIsExceptionDisabled(false);
    }
  };

  const handleDropdownValueChange = (rowId, newValue) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            dropdownValue: newValue,
            hasSubTable: newValue !== "-- Chọn --",
            hasNestedTable: false,
            subDropdownValue: "",
            nestedRows: [],
            showTrashIconInNestedTable: false,
          };
        }
        return row;
      })
    );
  };

  const handleSubDropdownChange = (rowId, newValue) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            subDropdownValue: newValue,
            hasNestedTable: newValue !== "",
            nestedRows: [],
            showTrashIconInNestedTable: newValue !== "",
          };
        }
        return row;
      })
    );
  };

  const handleAddNestedRow = (rowId, nestedValue) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const remainingExceptions = allExceptions.filter(
            (e) =>
              e !== exceptionOption &&
              e !== row.dropdownValue &&
              e !== row.subDropdownValue
          );
          const exception = remainingExceptions[0];
          const options = getOptionsForException(exception);
          const selectedOption = options.find(
            (option) => option.value === nestedValue
          );
          const selectedOptionLabel = selectedOption
            ? selectedOption.label
            : nestedValue;
          return {
            ...row,
            nestedRows: [
              ...row.nestedRows,
              { selectedOption: nestedValue, selectedOptionLabel },
            ],
          };
        }
        return row;
      })
    );
  };

  const handleDeleteNestedRow = (rowId, index) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const newNestedRows = row.nestedRows.filter((_, i) => i !== index);
          return {
            ...row,
            nestedRows: newNestedRows,
            showTrashIconInNestedTable:
              newNestedRows.length > 0 || row.subDropdownValue !== "",
          };
        }
        return row;
      })
    );
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const getAvailableExceptionOptions = (currentException) => {
    return exceptionOptionsdata.map((option) => ({
      ...option,
      disabled:
        option.value === currentException || option.value === exceptionOption,
    }));
  };

  const getOptionsForDropdownValue = (dropdownValue) => {
    switch (dropdownValue) {
      case "Chức danh":
        return positionOptionsdata;
      case "Điểm làm việc":
        return workLocationOptionsdata;
      case "Loại nhân sự":
        return employeeTypeOptionsdata;
      default:
        return [];
    }
  };

  const getOptionsForException = (exception, selectedValues = []) => {
    let options = [];
    switch (exception) {
      case "Chức danh":
        options = positionOptionsdata;
        break;
      case "Điểm làm việc":
        options = workLocationOptionsdata;
        break;
      case "Loại nhân sự":
        options = employeeTypeOptionsdata;
        break;
      default:
        options = [];
        break;
    }
    return options.filter((option) => !selectedValues.includes(option.value));
  };

  const searchOptions = getSearchOptions(exceptionOption);
  const searchPlaceholder = getSearchPlaceholder(exceptionOption);

  return (
    <div className="exception-table-container">
      {/* Header */}
      <div className="header">
        <h2>THÊM NGOẠI LỆ</h2>
        <button className="close-button" onClick={onClose}>
          {/* SVG Icon */}
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
                <th></th>
              </tr>
            </thead>
            <tbody>
  {tableRows.map((row) => {
    const isExpanded = expandedRows[row.id] ?? true;
    const remainingExceptions = allExceptions.filter(
      (e) =>
        e !== exceptionOption &&
        e !== row.dropdownValue &&
        e !== row.subDropdownValue
    );

    return (
      <React.Fragment key={row.id}>
        <tr>
          <td>
            <button
              className="dropdown-button"
              title="Thu gọn/Mở rộng"
              onClick={() => toggleRowExpansion(row.id)}
            >
              {isExpanded ? "-" : "+"}
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

          {/* Trưởng đơn vị */}
          {row.exception === "Chức danh" && (
            <td>{row.isHead ? "Trưởng đơn vị" : ""}</td>
          )}

          {/* Dropdown thứ nhất trong dòng */}
          <td>
            <SearchableDropdown
              options={getAvailableExceptionOptions(row.exception)}
              selectedOption={row.dropdownValue}
              setSelectedOption={(newValue) =>
                handleDropdownValueChange(row.id, newValue)
              }
              placeholder="-- Chọn --"
              disabled={false}
            />
          </td>
        </tr>

        {/* Dropdown thứ hai */}
        {isExpanded && row.hasSubTable && row.dropdownValue !== "-- Chọn --" && (
          <tr>
            <td colSpan="4">
              <SearchableDropdown
                options={getOptionsForDropdownValue(row.dropdownValue)}
                selectedOption={row.subDropdownValue}
                setSelectedOption={(newValue) =>
                  handleSubDropdownChange(row.id, newValue)
                }
                placeholder="-- Chọn --"
                disabled={false}
              />
            </td>
          </tr>
        )}

        {/* Bảng con sau dropdown thứ hai */}
        {isExpanded && row.hasNestedTable && (
          <tr>
            <td colSpan="5">
              <table className="nested-sub-table">
                <thead>
                  <tr>
                    <th>{row.dropdownValue}</th> 
                    <th>{remainingExceptions[0]}</th>
                  </tr>
                </thead>
                <tbody>
                  {row.nestedRows.map((nestedRow, index) => (
                    <tr key={index}>
                      <td>{nestedRow.selectedOptionLabel}</td>
                      <td>
                        <button
                          className="trash-button"
                          onClick={() =>
                            handleDeleteNestedRow(row.id, index)
                          }
                          title="Xóa"
                        >
                          ✖
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>{row.dropdownValue}</td> 
                    <td>
                      <SearchableDropdown
                        options={getOptionsForException(
                          remainingExceptions[0],
                          row.nestedRows.map((nr) => nr.selectedOption)
                        )}
                        selectedOption=""
                        setSelectedOption={(nestedValue) =>
                          handleAddNestedRow(row.id, nestedValue)
                        }
                        placeholder="-- Chọn --"
                        disabled={false}
                      />
                    </td>
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
                          fill="#ff0000"
                        >
                          <path d="M135.2 17.7L128 0H320l-7.2 17.7C309.4 32.3 320 48.6 320 66.7V96h32v32c0 8.8-7.2 16-16 16h-32v288c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V144H64c-8.8 0-16-7.2-16-16V96h32V66.7c0-18.1 10.6-34.4 27.2-49Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  })}
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
            {/* SVG Icon */}
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
