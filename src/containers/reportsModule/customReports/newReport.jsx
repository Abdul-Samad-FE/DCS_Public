import React, { useEffect, useState, useRef, useContext } from 'react';
import DragAndDropDevices from './dragAndDropDevices';
import { useDispatch } from 'react-redux';
import { addReport } from '../../../store/features/reportModule/actions/addReportsAction';
import PdfModal from '../schedualeResults/modal.jsx';
import ReportBuilder from './reportBuilder.jsx';
// import ReportBuilder from "react-report-builder";
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
} from 'antd';
import { useSelector } from 'react-redux';
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice.js';
import { fetchKpiChartData } from '../../../store/features/dashboardModule/actions/kpiChartAction.js';
import { fetchMetricsChartData } from '../../../store/features/dashboardModule/actions/metricsChartAction.js';
import { fetchTopDevicesPowerCostData } from '../../../store/features/dashboardModule/actions/topDevicesPowerCostAction.js';
import jsPDF from 'jspdf';
import SelectOption from './selectOptions.jsx';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { CustomInput } from '../../../components/customInput.jsx';
import DefaultSelector from '../../../components/defaultSelector.jsx';
import KpiSelector from '../../dashboardModule/dashboard/kpiSelector.jsx';
import axiosInstance from '../../../utils/axios/axiosInstance.js';
const NewReport = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [reportTitle, setReportTitle] = useState('DCS Report');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndtDate] = useState();
  const [loading, setLoading] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [siteId, setSiteId] = useState(null);
  const [siteOptions, setSiteOptions] = useState([]);
  const [duration, setDuration] = useState('24 hours');

  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    site_id: '',
    report_title: '',
    Duration: ['24 hours'],
    ReportType: [],
  });
  const { Option } = Select;
  const dispatch = useDispatch();
  const report = useSelector((state) => state?.addReportData);
  console.log(report, 'report store data');
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const sites = useSelector((state) => state.sites?.sites);

  const updatedSites = sites?.map((item) => {
    return {
      label: item?.site_name,
      value: item?.id,
    };
  });
  useEffect(() => {
    dispatch(fetchsitesAsync());
  }, [dispatch]);
  useEffect(() => {
    setReportData({
      ...reportData,
      ReportType: selectedOptions,
      report_title: reportTitle,
    });
  }, [selectedOptions, reportTitle]);
  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange2 = (value, option) => {
    setSiteId(value);
    setReportData({
      ...reportData,
      site_id: value,
    });
  };
  const onChangeReportTitle = (e) => {
    setReportTitle(e.target.value);
  };
  const handleChangeDateRange = (dates) => {
    const [start, end] = dates;
    const formattedStartDate = start.toISOString().substring(0, 10);
    const formattedEndDate = end.toISOString().substring(0, 10);
    setStartDate(formattedStartDate);
    setEndtDate(formattedEndDate);
    setReportData({
      ...reportData,
      Duration: [formattedStartDate, formattedEndDate],
    });
  };

  const options = [
    {
      value: '24 hours',
      label: '24 hours',
      desc: '24 hours',
    },
    {
      value: '7 Days',
      label: '7 Days',
      desc: '7 Days',
    },
    {
      value: 'Last Month',
      label: 'Last Month',
      desc: 'Last Month',
    },
    {
      value: 'Current Month',
      label: 'Current Month',
      desc: 'Current Month',
    },
    {
      value: 'Last 3 Months',
      label: 'Last 3 Months',
      desc: 'Last 3 Months',
    },
    {
      value: 'Last 6 Months',
      label: 'Last 6 Months',
      desc: 'Last 6 Months',
    },
    {
      value: 'Last Year',
      label: 'Last Year',
      desc: 'Last Year',
    },
    {
      value: 'Current Year',
      label: 'Current Year',
      desc: 'Current Year',
    },
  ];
  const handleChange = (value) => {
    console.log('duration:', value);

    setDuration(value);
    setReportData({
      ...reportData,
      Duration: [value],
    });
  };

  const handleRun = (id) => {
    if (!reportTitle) {
      console.error('Report Title is required');
      messageApi.open({
        type: 'error',
        content: 'Report Title is required',
      });
    } else if (!reportData?.site_id) {
      messageApi.open({
        type: 'error',
        content: 'Please, select a site!',
      });
    } else if (!reportData?.Duration) {
      messageApi.open({
        type: 'error',
        content: 'Select Reporting Period',
      });
    } else if (selectedOptions.length < 1) {
      messageApi.open({
        type: 'error',
        content: 'Please, select atleast 1 report in available options',
      });
    } else {
      setLoading(true);
      console.log('report data', reportData);
      axiosInstance
        .post('/reports/addReport', {
          report_title: reportTitle,
          ReportType: selectedOptions,
          site_id: reportData.site_id,
          Duration: reportData.Duration,
        })
        .then((response) => {
          console.log('API Response:', response.data);
          // Handle success actions here
        })
        .catch((error) => {
          console.error('API Error:', error);
          // Handle error actions here
        })
        .finally(() => {
          setLoading(false);
        });

      // useEffect(() => {
      // dispatch(fetchMetricsChartData(siteId));
      // dispatch(fetchKpiChartData(siteId, options));

      // dispatch(fetchTopDevicesPowerCostData(siteId));
      // }, []);

      // dispatch(addReport(reportData));
      // setRecordToEdit(selectedOptions);

      // if (report?.addingReport === false) {
      //   setTimeout(() => {
      //     setLohttp://localhost:3000/main_layout/reports_module/custom-reports/new-reportading(false);
      //     messageApi.open({
      //       type: "success",
      //       content: "Report Created Successfully",
      //     });
      //     setReportTitle("DCS Report");
      //     setSiteId("");
      //     setSelectedOptions([]);
      //     setDuration("");
      //     // navigate("/main_layout/reports_module/saved-report-templates");
      //   }, 1000);
      // }
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
          color: '#FFFFFF',
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '0px',
          height: 'auto',
          padding: '0px 0px 0px 0px',
          margin: '0 28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 'auto',
            padding:'0 15px'
          }}
        >
          <p
            style={{
              color: theme?.palette?.main_layout?.primary_text,
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '2px',
              padding: '10px 16px',
              marginTop: '0px',
              marginBottom: '0px',
            }}
          >
            Create Custom Report
          </p>
          <Button
            style={{
              backgroundColor: theme?.palette?.default_button?.add_background,
              borderRadius: '2px',
              color: theme?.palette?.default_button?.primary_text,
              fontSize: '14px',
              border: 'unset',
              width: '133px',
              height: '32px',
              fontWeight: 600,
            }}
            onClick={handleRun}
          >
            Run and Save
          </Button>
        </div>

        <div
          style={{
            borderLeft: `1px solid  ${theme?.palette?.main_layout?.border_bottom}`,
            borderRight: `1px solid  ${theme?.palette?.main_layout?.border_bottom}`,
            borderBottom: `1px solid  ${theme?.palette?.main_layout?.border_bottom}`,
            padding: '5px 15px 15px 15px',
          }}
        >
          <div
            style={{
              width: '99.3%',
              marginBottom: '10px',
            }}
          >
            <Row>
              <Col xs={24} lg={8} style={{ padding: '10px 10px 10px 0px' }}>
                <div style={{}}>
                  <p
                    style={{
                      color: theme?.palette?.main_layout?.primary_text,
                      fontSize: '12px',
                      marginTop: '0px',
                      // paddingTop: "10px",
                      marginBottom: '7px',
                    }}
                  >
                    Report Title
                  </p>
                  <CustomInput
                    value={reportTitle}
                    onChange={onChangeReportTitle}
                  />
                  {/* <Input
                    value={reportTitle}
                    className="new_report_input"
                    placeholder=""
                    onChange={onChangeReportTitle}
                  /> */}
                </div>
              </Col>

              <Col xs={24} lg={8} style={{ padding: '10px 10px 10px 0px' }}>
                <div>
                  <p
                    style={{
                      color: theme?.palette?.main_layout?.primary_text,
                      fontSize: '12px',
                      marginTop: '0px',
                      // paddingTop: "2.5px",
                      marginBottom: '7px',
                    }}
                  >
                    Select Site
                  </p>
                  <DefaultSelector
                    options={updatedSites}
                    onChange={handleChange2}
                    value={siteId}
                    report={true}
                  />
                  {/* <Select
                    className="custom_selector"
                    style={{
                      width: "100%",
                    }}
                    showSearch
                    optionFilterProp="children"
                    defaultValue={["All"]}
                    filterOption={(input, option) =>
                      (option.children ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA.children ?? "")
                        .toLowerCase()
                        .localeCompare((optionB.children ?? "").toLowerCase())
                    }
                    loading={loading}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    onChange={handleChange2}
                    value={siteId}
                    dropdownStyle={{
                      backgroundColor: "#36424e",
                      color: "white",
                    }}
                    dropdownClassName="custom-dropdown"
                  >
                    {siteOptions?.map((option) => (
                      <Option key={option.value} value={option.id}>
                        {option.site_name}
                      </Option>
                    ))}
                  </Select> */}
                </div>
              </Col>
              <Col xs={24} lg={8} style={{ padding: '10px 0px 10px 0px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: '7px',
                        marginTop: '0px',
                      }}
                    >
                      Reporting Period
                    </p>
                    <KpiSelector
                      options={options}
                      value={duration}
                      onChange={handleChange}
                      report={true}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* <DragAndDropDevices
            setSelectedOptions={setSelectedOptions}
            selectedOptions={selectedOptions}
          /> */}
          <SelectOption
            setSelectedOptions={setSelectedOptions}
            selectedOptions={selectedOptions}
          />
        </div>
      </div>
    </>
  );
};

export default NewReport;
