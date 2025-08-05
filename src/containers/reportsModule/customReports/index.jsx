import React, { useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
// import Modal from "./modal";
import { useNavigate } from "react-router-dom";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/racks/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/racks/selectors";
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
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";
import HorizontalMenu from "../../../components/horizontalMenu";
import { Button, Checkbox, Divider, Tabs, Spin, message } from "antd";
import { Route, Routes, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
const CheckboxGroup = Checkbox.Group;

// const items = new Array(2).fill(null).map((_, i) => {
//   const label = i === 0 ? "Create New Report" : "Scheduled Report";
//   const key = label.replace(/\s+/g, "-").toLowerCase(); // Generating key from label
//   return {
//     label,
//     key,
//     children: `Content of ${label}`,
//   };
// });
const { TabPane } = Tabs;
const items = [
  {
    id: "Create New Report",
    name: "Custom Report",
    path: "new-report",
  },
  // {
  //   id: "Scheduled Report",
  //   name: "Schedule Report",
  //   path: "schedule-report",
  // },
];

const CustomReports = () => {
  // theme
  const theme = useTheme();
  const navigate = useNavigate();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  // refs

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);

  // selectors
  const dataSource = useSelector(selectTableData);
  const [loading, setLoading] = useState(false);
  const [startBtn, setStartBtn] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

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
  // useErrorHandling({
  //   data: fetchRecordsData,
  //   isSuccess: isFetchRecordsSuccess,
  //   isError: isFetchRecordsError,
  //   error: fetchRecordsError,
  //   type: "fetch",
  // });

  // useErrorHandling({
  //   data: deleteRecordsData,
  //   isSuccess: isDeleteRecordsSuccess,
  //   isError: isDeleteRecordsError,
  //   error: deleteRecordsError,
  //   type: "bulk",
  // });

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

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log("Various parameters", pagination, filters, sorter, extra);
  };

  const handleExport = (optionType) => {
    if (optionType === "All Racks") {
      jsonToExcel(dataSource, "Racks");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "rack_template");
    }
    handleSuccessAlert("File exported successfully.");
  };

  // row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // columns
  let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);

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
        {/* <Icon onClick={() => handleEdit(record)} icon="bx:edit" /> */}
      </div>
    ),
  });

  // page header buttons
  const buttons = [
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      // handleClick: handleExport,
      // options: [
      //   {
      //     type: "All Racks",
      //     icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
      //   },
      //   {
      //     type: "Template",
      //     icon: (
      //       <Icon fontSize="16px" icon="streamline:chat-bubble-square-write" />
      //     ),
      //   },
      // ],
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      // handleClick: handleDelete,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      // handleClick: handleAdd,
    },
  ];
  const onRowClick = (record) => {
    navigate(`rackdetail`);
  };

  const rowProps = (record) => {
    return {
      onClick: () => onRowClick(record),
    };
  };

  const handleRun = () => {
    setLoading(true);

    // Set loading to false after 5 seconds
    setTimeout(() => {
      setLoading(false);
      setStartBtn(true);
    }, 2000);
  };
  const handleSave = () => {
    setLoading(true);

    // Set loading to false after 5 seconds
    setTimeout(() => {
      setLoading(false);
      messageApi.open({
        type: "success",
        content: "Report Saved Successfully",
      });
    }, 2000);
  };

  return (
    <>
      {contextHolder}

      <div
        className="cutom_report_menu"
        style={{
          margin: "15px 0 0 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <HorizontalMenu
          menuItems={items}
          defaultPage="Create New Report"
          cutomReport={"true"}
        />
      </div>
      <Spin spinning={loading} tip="It will take few seconds" size="large">
        <div className="content" />
      </Spin>
      <Outlet />
    </>
  );
};

export default CustomReports;
