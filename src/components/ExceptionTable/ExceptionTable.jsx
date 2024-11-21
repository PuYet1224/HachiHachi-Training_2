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
  const [tableRows, setTableRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [exceptionBodies, setExceptionBodies] = useState([
    { id: Date.now(), exceptionOption: "", searchOption: "" },
  ]);
  
  const allExceptions = ["Chức danh", "Điểm làm việc", "Loại nhân sự"];
  const handleAddExceptionBody = () => {
    setExceptionBodies((prev) => [
      ...prev,
      { id: Date.now(), exceptionOption: "", searchOption: "" },
    ]);
  };
  
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
    if (value === "-- Chọn --") {
      setExceptionOption("");
    } else {
      setExceptionOption(value);
    }
    setSearchOption("");
    setTableRows([]);
  };

  const handleSearchChange = (value) => {
    if (!value) return;
    setSearchOption(value);
    addRowToTable(exceptionOption, value);
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
      subDropdownValues: [],
      hasNestedTables: false,
      nestedSelectedOptions: {},
      ...additionalData,
    };

    setTableRows((prevRows) => [...prevRows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleDeleteSubTable = (id) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            dropdownValue: "-- Chọn --",
            hasSubTable: false,
            subDropdownValues: [],
            hasNestedTables: false,
            nestedSelectedOptions: {},
          };
        }
        return row;
      })
    );
  };

  const handleDeleteNestedTable = (rowId, subValue) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const updatedSubDropdownValues = row.subDropdownValues.filter(
            (value) => value !== subValue
          );
          const updatedNestedSelectedOptions = { ...row.nestedSelectedOptions };
          delete updatedNestedSelectedOptions[subValue];

          return {
            ...row,
            subDropdownValues: updatedSubDropdownValues,
            nestedSelectedOptions: updatedNestedSelectedOptions,
            hasNestedTables: updatedSubDropdownValues.length > 0,
          };
        }
        return row;
      })
    );
  };

  const handleDropdownValueChange = (rowId, newValue) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            dropdownValue: newValue,
            hasSubTable: newValue !== "-- Chọn --",
            subDropdownValues: newValue !== "-- Chọn --" ? [] : [],
            hasNestedTables: false,
            nestedSelectedOptions: {},
          };
        }
        return row;
      })
    );
  };

  const handleSubDropdownChange = (rowId, selectedValue) => {
    if (selectedValue === "-- Chọn --") return;

    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          if (!row.subDropdownValues.includes(selectedValue)) {
            return {
              ...row,
              subDropdownValues: [...row.subDropdownValues, selectedValue],
              hasNestedTables: true,
            };
          }
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
        option.value === currentException ||
        option.value === exceptionOption,
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

  const getOptionsForException = (exception) => {
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

  const handleNestedDropdownChange = (rowId, subValue, newSelectedOptions) => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const updatedNestedOptions = {
            ...row.nestedSelectedOptions,
            [subValue]: newSelectedOptions,
          };
          return {
            ...row,
            nestedSelectedOptions: updatedNestedOptions,
          };
        }
        return row;
      })
    );
  };

  const searchOptions = getSearchOptions(exceptionOption);
  const searchPlaceholder = getSearchPlaceholder(exceptionOption);

  const isSectionLeftDisabled = tableRows.length > 0;
  const isSectionRightDisabled = exceptionOption === "";

  return (
    <div className="exception-table-container">
      {/* Header */}
      <div className="header">
        <h2>THÊM NGOẠI LỆ</h2>
        <button className="close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
            width="16"
            height="16"
          >
            <path
              fill="#fff"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            />
          </svg>
        </button>
      </div>

      {/* Main Body */}
      <div className="main-body">
        {/* Section Left */}
        <div className="left-section">
          <label className="section-label">Ngoại lệ theo(*)</label>
          <SearchableDropdown
            options={exceptionOptionsdata}
            selectedOption={exceptionOption}
            setSelectedOption={handleExceptionChange}
            placeholder="-- Chọn --"
            disabled={isSectionLeftDisabled}
            multiSelect={false}
          />
        </div>

        {/* Section Right */}
        <div className="right-section">
          <label className="section-label">Tìm kiếm</label>
          <SearchableDropdown
            options={searchOptions}
            selectedOption={searchOption}
            setSelectedOption={handleSearchChange}
            placeholder={searchPlaceholder}
            disabled={isSectionRightDisabled}
            multiSelect={false}
          />
        </div>
      </div>

      {/* Table Section */}
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
    return (
      <React.Fragment key={row.id}>
        <tr className="main-row"></tr>
        <tr>
          <td>
          <button
          className="dropdown-button"
          title="Thu gọn/Mở rộng"
          onClick={() => toggleRowExpansion(row.id)}
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A6634"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 15l6-6 6 6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A6634"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </button>
          </td>

          <td>
            {row.exception === "Chức danh" && row.label}
            {row.exception === "Điểm làm việc" && row.locationName}
            {row.exception === "Loại nhân sự" && row.employeeType}
          </td>

          {row.exception === "Chức danh" && <td>{row.unit}</td>}

          {row.exception === "Chức danh" && (
            <td>{row.isHead ? "Trưởng đơn vị" : ""}</td>
          )}

          {/* Cái này là dropdown thứ nhất */}
          <td>
            <SearchableDropdown
              options={getAvailableExceptionOptions(row.exception)}
              selectedOption={row.dropdownValue}
              setSelectedOption={(newValue) =>
                handleDropdownValueChange(row.id, newValue)
              }
              placeholder="-- Chọn --"
              disabled={false}
              multiSelect={false}
            />
          </td>
          <td>
            {row.subDropdownValues.length === 0 && (
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
            )}
          </td>
        </tr>

        {/* Th này là dropdown thứ hai */}
        {isExpanded && row.hasSubTable && row.dropdownValue !== "-- Chọn --" && (
          <tr>
            <td></td>
            <td colSpan={row.exception === "Chức danh" ? 3 : 1}>
              <SearchableDropdown
                options={getOptionsForDropdownValue(row.dropdownValue)}
                selectedOption="" 
                setSelectedOption={(selectedValue) => {
                  if (selectedValue !== "-- Chọn --") {
                    handleSubDropdownChange(row.id, selectedValue);
                  }
                }}
                placeholder="-- Chọn --"
                disabled={false}
                multiSelect={false} 
                hideSelectedOptions={true}
              />
            </td>
            <td></td>
          </tr>
        )}

        {/* Thằng này là cái table được sinh ra từ thằng dropdown thứ hai */}
        {isExpanded && row.hasNestedTables &&
          row.subDropdownValues.map((subValue) => {
            const remainingExceptions = allExceptions.filter(
              (e) =>
                e !== exceptionOption &&
                e !== row.dropdownValue &&
                e !== subValue
            );

            const option = [
              ...positionOptionsdata,
              ...workLocationOptionsdata,
              ...employeeTypeOptionsdata
            ].find(opt => opt.value === subValue);

            return (
              <tr key={`${row.id}-${subValue}`}>
  <td></td>
  <td
    colSpan={
      row.exception === "Chức danh" ? 3 : 1
    }
    style={{ padding: 0 }}
  >
    <table className="nested-sub-table" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th></th>
          <th>{remainingExceptions[0]}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{option ? option.label.split(" | ")[0] : "Không xác định"}</span>
              <span style={{ fontSize: "0.9em", color: "#555" }}>
                {option ? option.value : ""}
              </span>
            </div>
          </td>
          <td>
            <SearchableDropdown
              options={getOptionsForException(remainingExceptions[0])}
              selectedOptions={
                row.nestedSelectedOptions
                  ? row.nestedSelectedOptions[subValue] || []
                  : []
              }
              setSelectedOptions={(newSelectedOptions) =>
                handleNestedDropdownChange(row.id, subValue, newSelectedOptions)
              }
              placeholder="-- Chọn --"
              disabled={false}
              multiSelect={true}
              hideSelectedOptions={false}
              customStyles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#1A6634" : "#fff",
                  color: state.isSelected ? "#fff" : "#000",
                  cursor: "pointer",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#1A6634",
                  color: "#fff",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "#fff",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  color: "#fff",
                  ':hover': {
                    backgroundColor: "#ff0000",
                    color: "white",
                  },
                }),
              }}
            />
          </td>
          <td>
            <button
              className="trash-button"
              onClick={() => handleDeleteNestedTable(row.id, subValue)}
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
            );
          })}
      </React.Fragment>
    );
  })}
</tbody>
          </table>
        </div>
      )}

      {/* cái này không làm kịp */}
<div className="create-exception-button-container">
  <button
    className="create-exception-button"
    onClick={() => {
      if (exceptionOption && searchOption) {
        addRowToTable(exceptionOption, searchOption);
      } else {
        alert("CHỨC NĂNG NÀY ĐANG ĐƯỢC PHÁT TRIỂN...");
      }
    }}
  >
    <span className="icon-circle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="24"
        height="24"
      >
        <line x1="50" y1="35" x2="50" y2="65" stroke="#1A6634" strokeWidth="3" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="#1A6634" strokeWidth="3" />
      </svg>
    </span>
    <span className="label-text">Tạo ngoại lệ</span>
  </button>
</div>

      {/* Footer */}
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
