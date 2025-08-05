import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../components/cards';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables';
import { getTitle } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';
// import Modal from "./modal";
import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import useColumnSearchProps from '../../../hooks/useColumnSearchProps';
import {
  Spin,
  Row,
  Col,
  Button,
  Select,
  Space,
  DatePicker,
  Tooltip,
  Modal,
  message,
} from 'antd';
import useErrorHandling from '../../../hooks/useErrorHandling';
import { dataKeysArray } from './constants';
import PageHeader from '../../../components/pageHeader';
import CustomDatePicker from '../customReports/datePicker';
import Selector from '../../../components/selector';
import {
  SettingOutlined,
  InboxOutlined,
  EyeOutlined,
  ImportOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  DownCircleOutlined,
} from '@ant-design/icons';
import PdfModal from '../schedualeResults/modal';
import statusIcon from '../../../resources/svgs/status.png';
import downloadIcon from '../../../resources/svgs/download.png';
import tdafile from './excelFile/p.pdf';
import co2file from './excelFile/co2.pdf';
import ecrfile from './excelFile/ecr.pdf';
import eerfile from './excelFile/eer.pdf';
import Swal from 'sweetalert2';

import { fetchSavedReportsData } from '../../../store/features/reportModule/actions/savedReportsAction';
import { fetchsavedReportsAsync } from '../../../store/features/reportModule/slices/savedReports/slice';
import moment from 'moment';
import ExportButton from '../../../components/exportButton';
import axios from 'axios';
import { BaseUrl, baseUrl } from '../../../utils/axios';
import { deleteSavedReportAsync } from '../../../store/features/reportModule/slices/savedReports/slice';
import axiosInstance from '../../../utils/axios/axiosInstance';
import { renderStatusTag } from '../../../utils/utils';
import CustomSpin from '../../../components/CustomSpin';
const options = [
  {
    label: 'Analysis Report',
    value: 'Analysis Report',
    desc: 'Analysis Report',
  },
  {
    label: 'Monitoring Report',
    value: 'Monitoring Report',
    desc: 'Monitoring Report',
  },
  {
    label: 'All',
    value: 'All',
    desc: 'All',
  },
];
const data = [];

const { RangePicker } = DatePicker;
const StyledRangePicker = styled(RangePicker)`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.default_select?.border || '#d9d9d9'};
  background-color: ${({ theme }) =>
    theme?.palette?.default_select?.background || '#fff'};

  .ant-picker-input > input {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#000'};
  }

  .ant-picker-clear {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#999'};
    &:hover {
      color: ${({ theme }) =>
        theme?.palette?.default_select?.primary_text || '#999'};
    }
  }

  .ant-picker-suffix {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#999'};
  }

  &:hover {
    border-color: ${({ theme }) =>
      theme?.palette?.default_select?.border || '#40a9ff'};
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background || '#fff'};
  }

  .ant-picker-active-bar {
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background || '#1890ff'};
  }
`;
const SavedReportsTemplate = () => {
  // theme
  const theme = useTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  const [selectedOption, setSelectedOption] = useState('All');
  const [dateRange, setDateRange] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState([]);
  const dispatch = useDispatch();
  const { confirm } = Modal;

  const savedReportsData = useSelector(
    (state) => state.savedReportsData?.savedReports
  );
  const reportsLoader = useSelector((state) => state.savedReportsData);
  console.log(reportsLoader, 'eportsLoader');
  useEffect(() => {
    dispatch(fetchsavedReportsAsync());
  }, []);
  useEffect(() => {
    setFilteredData(savedReportsData);
  }, [savedReportsData]);

  const viewDetail = (record) => {
    openPdfInNewTab(record?.path);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log('Various parameters', pagination, filters, sorter, extra);
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
  // let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);
  const deleteReport = (id) => {
    try {
      dispatch(deleteSavedReportAsync(id ? [id] : ids));
      if (reportsLoader.status === 'succeded') {
        Swal.fire({
          title: 'Report deleted Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            container: 'custom-swal-container',
            title: 'custom-swal-title',
            confirmButton: 'custom-swal-button',
          },
          onClose: () => {},
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showConfirm = async (id) => {
    if (ids.length > 0 || id) {
      confirm({
        title: (
          <span style={{ color: 'gray' }}>
            Are you sure you want to delete?
          </span>
        ),
        icon: <ExclamationCircleFilled />,
        content: (
          <span style={{ color: 'gray' }}>
            Once you delete it will permanatly remove from the database. Are you
            sure you want to proceed?
          </span>
        ),
        okText: 'yes',
        okType: 'primary',
        okButtonProps: {
          // disabled: true,
        },
        cancelText: 'No',
        onOk() {
          deleteReport(id);
        },
        onCancel() {},
      });
    } else {
      Swal.fire({
        title: 'Select a site first',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal-container',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-button',
        },
        onClose: () => {},
      });
    }
  };
  const columns = [
    {
      title: 'Report Title',
      dataIndex: 'report_title',
      key: 'report_title',
      ...getColumnSearchProps('report_title'),
      sorter: (a, b) => a.report_title.localeCompare(b.report_title),
    },
    {
      title: 'Report Type',
      dataIndex: 'report_type',
      key: 'report_type',
      ...getColumnSearchProps('report_type'),
      sorter: (a, b) => a.ReportType.localeCompare(b.ReportType),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (record) => renderStatusTag(record, theme),
    },
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'Message',
      ...getColumnSearchProps('Message'),
    },
    {
      title: 'Start Date',
      dataIndex: 'starttime',
      key: 'starttime',
      ...getColumnSearchProps('starttime'),
      sorter: (a, b) => a.starttime.localeCompare(b.starttime),
      render: (time) => moment(time).format('YYYY-MM-DD'),
    },
    {
      title: 'End Date',
      dataIndex: 'endtime',
      key: 'endtime',
      ...getColumnSearchProps('endtime'),
      sorter: (a, b) => a.endtime.localeCompare(b.endtime),
      render: (time) => moment(time).format('YYYY-MM-DD'),
    },
    {
      title: 'Run Date/Time',
      dataIndex: 'entered_on',
      key: 'entered_on',
      ...getColumnSearchProps('entered_on'),
      sorter: (a, b) => a.entered_on.localeCompare(b.entered_on),
      render: (time) => moment(time).format('YYYY-MM-DD'),
    },
  ];
  columns.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right',
    width: 100,
    render: (text, record) => {
      const isDisabled = !record?.Status;
      return (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          <EyeOutlined
            style={{
              fontSize: '16px',
              cursor: isDisabled ? 'not-allowed' : 'pointer', // Change cursor if disabled
            }}
            onClick={() => viewDetail(record)}
          />
          <DeleteOutlined
            style={{ fontSize: '16px' }}
            onClick={() => showConfirm(record.id)}
          />
        </div>
      );
    },
  });

  const handleChangeDateRange = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      const formattedStartDate = startDate.toISOString().substring(0, 10);
      const formattedEndDate = endDate.toISOString().substring(0, 10);
      console.log(formattedStartDate, 'formattedStartDate');
      console.log(formattedEndDate, 'formattedEndDate');
      const filtered = filteredData.filter((item) => {
        const itemDate = moment(item.entered_on);
        return (
          itemDate.isSameOrBefore(formattedEndDate, 'day') &&
          itemDate.isSameOrAfter(formattedStartDate, 'day')
        );
      });
      setFilteredData(filtered);
    }
  };

  const openPdfInNewTab = async (filename) => {
    try {
      const response = await axiosInstance.post(
        `/sites/view-pdf?filename=${filename}`,
        null,
        {
          responseType: 'blob',
        }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };
  return (
    <CustomSpin spinning={reportsLoader.status === 'loading' ? true : false}>
      {contextHolder}
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
              // background: "#141B26",
              backgroundColor: theme?.palette?.default_card?.background,
              padding: '10px',
            }}
          >
            <h3
              style={{
                color: theme?.palette?.default_card?.color,
              }}
            >
              Reports
            </h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              {/* calender show or not */}
              {/* <div style={{ width: '40%' }}>
                <StyledRangePicker
                  theme={theme}
                  onChange={handleChangeDateRange}
                />
              </div> */}
              {/* <ExportButton
                dataSource={filteredData}
                columns={columns}
                name="reports"
              /> */}
            </div>
            <DefaultTable
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'even' : 'odd'
              }
              size="small"
              scroll={{ x: 1400 }}
              onChange={handleChange}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              style={{ whiteSpace: 'pre' }}
              pagination={{
                defaultPageSize: 10,
                pageSizeOptions: [10, 50],
              }}
            />
          </div>
        </DefaultCard>
      </div>
    </CustomSpin>
  );
};

export default SavedReportsTemplate;
