import React, { useState } from "react";
import DragAndDropDevices from "./dragAndDropDevices";

import {
  Row,
  Col,
  Select,
  Space,
  DatePicker,
  Input,
  Checkbox,
  Button,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const ScheduleReport = () => {
  const [selectedOption, setSelectedOption] = useState();
  const [reportTitle, setReportTitle] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [date, setDate] = useState();
  const [endDate, setEndtDate] = useState();
  const [loading, setLoading] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  console.log(selectedOptions, "devices");
  console.log(selectedOption, "selectedOption period");
  console.log(reportTitle, "reportTitle");

  const onChangeReportTitle = (e) => {
    console.log(e.target.value);
    setReportTitle(e.target.value);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };
  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });

  const options = [
    {
      label: "Current Month",
      value: "Current Month",
      desc: "Current Month",
    },
    {
      label: "Last Month",
      value: "Last Month",
      desc: "Last Month",
    },
    {
      label: "Last 3 Month",
      value: "Last 3 Month",
      desc: "Last 3 Month",
    },
    {
      label: "Last 6 Month",
      value: "Last 6 Month",
      desc: "Last 6 Month",
    },
    {
      label: "1 Year",
      value: "1 Year",
      desc: "1 Year",
    },
  ];
  const handleChange = (value) => {
    setSelectedOption(value);
    console.log(value);
  };
  const onChangeCheckBox = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleSave = () => {
    if (!reportTitle) {
      console.error("Report Title is required");
      messageApi.open({
        type: "error",
        content: "Report Title is required",
      });
    } else if (selectedOptions.length < 1) {
      messageApi.open({
        type: "error",
        content: "Select Atleast 1 Device",
      });
    } else if (!selectedOption) {
      messageApi.open({
        type: "error",
        content: "Select Reporting Period",
      });
    } else if (!selectedOption) {
      messageApi.open({
        type: "error",
        content: "Select Reporting Period",
      });
    } else {
      setLoading(true);

      // Set loading to false after 5 seconds
      setTimeout(() => {
        setLoading(false);
        messageApi.open({
          type: "success",
          content: "Report Saved Successfully",
        });
        setStartBtn(false);
      }, 2000);
    }
  };
  return (
    <>
      <Spin spinning={loading} tip="It will take few seconds" size="large">
        <div className="content" />
      </Spin>
      {contextHolder}
      <div
        style={{
          color: "#FFFFFF",
          background: "#0D131C",
          borderRadius: "0px",
          height: "auto",
          padding: "0px 0px 0px 0px",
          width: "96%",
          margin: "0 auto",
          marginTop: "-30.5px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            width: "40%",
            marginLeft: "auto",
            justifyContent: "end",
          }}
        >
          <Button
            style={{
              background: "#0490E7",
              borderRadius: "2px",
              color: "#FFFFFF",
              fontSize: "14px",
              border: "unset",
              width: "133px",
              height: "32px",
              fontWeight: 600,
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        <p
          style={{
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 700,
            background: "#050C17",
            borderRadius: "2px",
            padding: "10px 16px",
            marginTop: "0px",
            marginBottom: "0px",
          }}
        >
          Create Schedule Report
        </p>
        <div
          style={{
            borderLeft: "1px solid #2D2F35",
            borderRight: "1px solid #2D2F35",
            borderBottom: "1px solid #2D2F35",
            padding: "5px 15px 15px 15px",
          }}
        >
          <p
            style={{
              color: "#B9B9B9",
              fontSize: "12px",
              marginTop: "0px",
              paddingTop: "10px",
              marginBottom: "7px",
            }}
          >
            Report Title
          </p>
          <Input
            className="new_report_input"
            placeholder="Enter Report"
            onChange={onChangeReportTitle}
          />
          <br />
          <Checkbox
            style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "#E4E4E4",
              marginTop: "15px",
              marginBottom: "10px",
            }}
            onChange={onChangeCheckBox}
          >
            Create the report in the Current virtual domain and each of its
            sub-domains
          </Checkbox>
          <br />
          <a
            style={{
              color: "#0490E7",
              fontSize: "12px",
              textDecoration: "none",
              // marginLeft: "10px",
            }}
            href=""
          >
            View Sub-Virtual Domains
          </a>
          <DragAndDropDevices
            setSelectedOptions={setSelectedOptions}
            selectedOptions={selectedOptions}
          />
          <Row>
            <Col xs={24} md={24} style={{ padding: "10px 0px 10px 0px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B9B9B9",
                      marginBottom: "7px",
                      marginTop: "0px",
                    }}
                  >
                    Reporting Period
                  </p>
                  <Select
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
                </div>

                <div style={{ width: "100%" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B9B9B9",
                      marginBottom: "7px",
                      marginTop: "0px",
                    }}
                  >
                    Select Schedule Time
                  </p>
                  {/* <DatePicker.RangePicker onChange={handleChangeDateRange} /> */}
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}
                    showTime={{
                      defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                    }}
                    // onChange={handleDatePickerChange}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ScheduleReport;
