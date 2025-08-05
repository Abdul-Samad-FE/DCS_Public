import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
// import Modal from "./modal";
import PdfModal from "./modal";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/inventory/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/inventory/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
} from "../../../components/sweetAlertWrapper";
import {
  jsonToExcel,
  columnGenerator,
  generateObject,
} from "../../../utils/helpers";
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";
import { Spin, Row, Col, Button, Modal } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";
import CustomDatePicker from "../customReports/datePicker";
import Selector from "../../../components/selector";
import { SettingOutlined, ImportOutlined } from "@ant-design/icons";
import statusIcon from "../../../resources/svgs/status.png";
import downloadIcon from "../../../resources/svgs/download.png";
import { InboxOutlined, EyeOutlined } from "@ant-design/icons";
import { Select, Space, DatePicker, Upload, message } from "antd";
import ApcChart from "../../../components/apcChart";
import { useDispatch } from "react-redux";
// import { setData } from "../../../store/features/reportModule/reports";
// import { selectData } from "../../../store/features/reportModule/reports";
import file from "./excelFile/p.pdf";
const options = [
  {
    label: "Analysis Report",
    value: "Analysis Report",
    desc: "Analysis Report",
  },
  {
    label: "Monitoring Report",
    value: "Monitoring Report",
    desc: "Monitoring Report",
  },
  {
    label: "All",
    value: "All",
    desc: "All",
  },
];

const data = [];

const { Dragger } = Upload;
const SchedualeRunResult = () => {
  const dispatch = useDispatch();
  // theme
  const theme = useTheme();
  const navigate = useNavigate();

  // hooks
  const { height, width } = useWindowDimensions();
  // const getColumnSearchProps = useColumnSearchProps();
  const getColumnSearchProps = useColumnSearchProps();

  // refs

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);

  const [open2, setOpen2] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // selectors
  const dataSource = useSelector(selectTableData);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("All");
  const [uploadedData, setUploadedData] = useState();
  const [dateRange, setDateRange] = useState([]);

  const generateRandomDate = () => {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTime);
    const day = String(randomDate.getDate()).padStart(2, "0");
    const month = String(randomDate.getMonth() + 1).padStart(2, "0");
    const year = randomDate.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const generateData = () => {
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i.toString(),
        reportTitle:
          i === 0
            ? "DUX- Last year Power Utilization"
            : i === 1
            ? "Power Utilisation of Device X"
            : i === 2
            ? "Power Utilisation of Device Y"
            : i === 3
            ? "PUE Quarter Report"
            : i === 4
            ? "Dux Rack-Wise PUE"
            : i === 5
            ? "SUlAY Quarterly Data Transfer"
            : "DUX PUE Report",
        reportType: "Analysis Report",
        // status: <img width="30px" height="25px" src={statusIcon} alt="" />,
        message: "Success",
        runDateTime: generateRandomDate(),
        download: <img src={downloadIcon} alt="" />,
        virtualDomain: `Root-Domain`,
      });
    }
    return data;
  };

  const handleCancel = () => {
    setOpen2(false);
  };

  const handleChangeDateRange = (dates) => {
    console.log(dates, "dates");
    setDateRange(dates);
    filterData(dates);
  };

  // const datafromStore = useSelector(selectData);
  // console.log(datafromStore, "datafromStore");
  const filterData = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      const formattedStartDate = start.toISOString().substring(0, 10);
      const formattedEndDate = end.toISOString().substring(0, 10);

      console.log(formattedStartDate, "start date");
      console.log(formattedEndDate, "end date");

      const filtered = data.filter(
        (item) =>
          item.runDateTime >= formattedStartDate &&
          item.runDateTime <= formattedEndDate
      );
      console.log(filtered, "filtered");
      setFilteredData(filtered);
    } else {
      // Handle case when dates are not selected
    }
  };

  useEffect(() => {
    // setData(generateData());
    setFilteredData(generateData());
  }, []);
  // const dataa = generateData();
  // dispatch(setData("hello"));

  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  const [
    deleteRecords,
    {
      data: deleteRecordsData,
      isSuccess: isDeleteRecordsSuccess,
      isLoading: isDeleteRecordsLoading,
      isError: isDeleteRecordsError,
      error: deleteRecordsError,
    },
  ] = useDeleteRecordsMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: "fetch",
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: "bulk",
  });

  // handlers
  const deleteData = () => {
    deleteRecords(selectedRowKeys);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "Are you sure you want delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleAdd = (optionType) => {
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  // const handleChange = (pagination, filters, sorter, extra) => {
  //   console.log("Various parameters", pagination, filters, sorter, extra);
  // };

  const handleExport = (optionType) => {
    if (optionType === "All Inventory") {
      jsonToExcel(dataSource, "Inventory");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "inventory_template");
    }
    handleSuccessAlert("File exported successfully.");
  };

  // row selection
  // const onSelectChange = (selectedRowKeys) => {
  //   setSelectedRowKeys(selectedRowKeys);
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  // columns
  // let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);
  // const handleDownload = (record) => {
  //   const csvData = {
  //     reportTitle: record.reportTitle || "",
  //     reportType: record.reportType || "",
  //     message: record.message || "",
  //     runDateTime: record.runDateTime || "",
  //     virtualDomain: record.virtualDomain || "",
  //   };

  //   const csvContent =
  //     "data:text/csv;charset=utf-8," +
  //     Object.keys(csvData).join(",") +
  //     "\n" +
  //     Object.values(csvData).join(",");

  //   // Create a CSV file and initiate download
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", `${record.reportTitle}.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  // };

  const handleDownload = (record) => {
    const fileName = `${record.reportTitle}.pdf`;
    // Create a download link
    const link = document.createElement("a");
    link.href = file;
    link.setAttribute("download", fileName);

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: "Report Title",
      dataIndex: "reportTitle",
      key: "reportTitle",
      ...getColumnSearchProps("reportTitle"),
    },
    {
      title: "Report Type",
      dataIndex: "reportType",
      key: "reportType",
      ...getColumnSearchProps("reportType"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <img width="30px" height="25px" src={statusIcon} alt="" />
          </div>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ...getColumnSearchProps("message"),
    },
    {
      title: "Run Date/Time",
      dataIndex: "runDateTime",
      key: "runDateTime",
      ...getColumnSearchProps("runDateTime"),
    },
    {
      title: "Download",
      dataIndex: "download",
      key: "download",
      ...getColumnSearchProps("download"),
      onCell: (record) => ({
        onClick: (event) => {
          handleDownload(record);
        },
      }),
    },
    {
      title: "Virtual Domain",
      dataIndex: "virtualDomain",
      key: "virtualDomain",
      ...getColumnSearchProps("virtualDomain"),
    },
  ];

  columns.push({
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
    width: 100,
    render: (text, record) => (
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <EyeOutlined
          style={{ fontSize: "16px" }}
          onClick={() => handleEdit(record)}
        />
        {/* <Icon onClick={() => handleEdit(record)} icon="bx:edit" /> */}
      </div>
    ),
  });

  // page header buttons

  const onRowClick = (record) => {
    navigate(`inventorydetail`);
  };

  const rowProps = (record) => {
    return {
      onClick: () => onRowClick(record),
    };
  };

  // ==============
  const handleChange = (value) => {
    // console.log(value);
    setSelectedOption(value);
    if (value === "All") {
      setFilteredData(data);
    } else {
      // console.log(value, "else value");
      // console.log(data, "data in else");
      const filtered = data.filter((item) => item.reportType === value);
      setFilteredData(filtered);
    }
  };
  // ================
  // import export
  console.log(data);
  const exportToCSV = () => {
    // Convert table data to CSV format
    const csvData = data.map((item) => ({
      reportTitle: item.reportTitle || "",
      reportType: item.reportType || "",
      // status: item.status || "",
      message: item.message || "",
      runDateTime: item.runDateTime || "",
      // download: item.download || "",
      virtualDomain: item.virtualDomain || "",
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(csvData[0]).join(",") +
      "\n" +
      csvData.map((row) => Object.values(row).join(",")).join("\n");

    // Create a CSV file and initiate download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
  };
  const showModal = () => {
    setOpen2(true);
  };
  const buttons = [
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: exportToCSV,
    },
    {
      type: "Import",
      icon: <ImportOutlined />,
      handleClick: showModal,
    },
  ];

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log(e, "file data");

      const text = e.target.result;
      const rows = text.split("\n");

      // Extract keys from the first row
      const keys = rows[0].split(",");

      const data = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (row) {
          const values = row.split(",");
          const obj = {};
          keys.forEach((key, index) => {
            obj[key.trim()] = values[index] ? values[index].trim() : "";
          });
          data.push(obj);
        }
      }

      setUploadedData(data);
    };
    reader.readAsText(file);
  };

  const props = {
    name: "file",
    multiple: false, // Allow only one file to be uploaded at a time
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const allowedExtensions = [".csv", ".xls", ".xlsx"];
      const extension = info.file.name.split(".").pop();
      const isAllowed = allowedExtensions.includes(
        "." + extension.toLowerCase()
      );
      if (!isAllowed) {
        // console.log(`File type not supported: ${extension}`);
      } else {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);

        // 2. Read from response and show file link
        newFileList = newFileList.map((file) => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });
        setFileList(newFileList);
      }
    },

    beforeUpload: (file) => {
      const allowedExtensions = [".csv", ".xls", ".xlsx"];
      const extension = file.name.split(".").pop();
      const isAllowed = allowedExtensions.includes(
        "." + extension.toLowerCase()
      );
      if (!isAllowed) {
        message.error(`File type not supported: ${extension}`);
      } else {
        handleUpload(file);
      }
      return isAllowed;
    },
  };
  console.log(fileList, "file list");
  const Start = async () => {
    setLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
    setFilteredData(uploadedData);
    handleCancel();
    setLoading(false);
  };
  return (
    <>
      <Modal
        className="import_file_modal"
        open={open2}
        title="Import file"
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            style={{ background: "#0490E7" }}
            key="submit"
            type="primary"
            loading={loading}
            onClick={Start}
          >
            Submit
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Dragger {...props} fileList={fileList}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#229849" }} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">File Type: csv, excel</p>
          </Dragger>
        </Spin>
      </Modal>
      <Spin spinning={isFetchRecordsLoading || isDeleteRecordsLoading}>
        <div>
          {open ? (
            <PdfModal
              handleClose={handleClose}
              open={open}
              recordToEdit={recordToEdit}
            />
          ) : null}

          <DefaultCard sx={{ width: `${width - 105}px` }}>
            <div
              style={{
                background: "#141B26",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  style={{
                    background: "#0490E7",
                    borderRadius: "2px",
                    border: "1px solid #0490E7",
                    color: "white",
                  }}
                >
                  <SettingOutlined /> Configure Table
                </Button> */}
                <h3 style={{ color: "white" }}>Schedule Reports</h3>
                <PageHeader pageName="" buttons={buttons} />
              </div>

              <Row style={{ marginBottom: "20px" }}>
                {/* <Col xs={24} sm={12} style={{ padding: "10px 10px 10px 0px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B9B9B9",
                      marginBottom: "7px",
                    }}
                  >
                    Reporting Category
                  </p>
                  <Select
                    // mode="multiple"
                    style={{
                      width: "100%",
                    }}
                    placeholder="select one country"
                    defaultValue={["All"]}
                    value={selectedOption}
                    onChange={handleChange}
                    optionLabelProp="label"
                    options={options}
                    optionRender={(option) => (
                      <Space>
                        <span role="img" aria-label={option.data.label}>
                          {option.data.emoji}
                        </span>
                        {option.data.desc}
                      </Space>
                    )}
                  />
                </Col> */}
                <Col xs={24} sm={12} style={{ padding: "12px 0px 10px 10px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B9B9B9",
                      marginBottom: "7px",
                      marginTop: "0px",
                    }}
                  >
                    Select Date
                  </p>
                  <DatePicker.RangePicker onChange={handleChangeDateRange} />
                </Col>
                <Col xs={24} sm={12} style={{ padding: "0px 0px 10px 10px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B9B9B9",
                      marginBottom: "7px",
                    }}
                  >
                    Report Type
                  </p>
                  <Select
                    // mode="multiple"
                    className="custom_selector"
                    style={{
                      width: "100%",
                    }}
                    placeholder="select one country"
                    defaultValue={["All"]}
                    value={selectedOption}
                    onChange={handleChange}
                    optionLabelProp="label"
                    options={options}
                    optionRender={(option) => (
                      <Space>
                        <span role="img" aria-label={option.data.label}>
                          {option.data.emoji}
                        </span>
                        {option.data.desc}
                      </Space>
                    )}
                  />
                </Col>
                {/* <Col xs={24} sm={12} style={{ padding: "10px 10px 10px 0px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B9B9B9",
                      marginBottom: "7px",
                      marginTop: "0px",
                    }}
                  >
                    Reporting Generation Method
                  </p>
                  <Select
                    // mode="multiple"
                    style={{
                      width: "100%",
                    }}
                    placeholder="select one country"
                    defaultValue={["All"]}
                    value={selectedOption}
                    onChange={handleChange}
                    optionLabelProp="label"
                    options={options}
                    optionRender={(option) => (
                      <Space>
                        <span role="img" aria-label={option.data.label}>
                          {option.data.emoji}
                        </span>
                        {option.data.desc}
                      </Space>
                    )}
                  />
                </Col> */}
              </Row>
              <DefaultTable
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "even" : "odd"
                }
                size="small"
                scroll={{ x: 1200 }}
                onChange={handleChange}
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                rowKey="name"
                style={{ whiteSpace: "pre" }}

                // pagination={{
                //   defaultPageSize: 10,
                //   pageSizeOptions: [10, 50],
                // }}

                // onRow={rowProps}
              />
            </div>
          </DefaultCard>
        </div>
      </Spin>
    </>
  );
};

export default SchedualeRunResult;
