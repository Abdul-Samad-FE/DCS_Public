import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import KpiSelector from '../kpiSelector';
import CustomCard from '../../../../components/customCard';
import DefaultTable from '../../../../components/tables';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopDevicesPowerCostData } from '../../../../store/features/dashboardModule/actions/topDevicesPowerCostAction';
import styled from 'styled-components';
import CustomSpin from '../../../../components/CustomSpin';

// const CustomSpin = styled(Spin)`
//   .ant-spin-dot-item {
//     background-color: ${(props) =>
//       props?.theme?.palette?.main_layout?.secondary_text};
//   }
// `;
const Top5DevicesTable = ({
  kpiOptions,
  siteId = null,
  spinnerLoading,
  isPue = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [topDevicesOption, setTopDevicesOption] = useState('24 hours');

  const topDevicesPowerCostData = useSelector(
    (state) => state.topDevicesPowerCostData?.data?.top_devices
  );
  const loading = useSelector(
    (state) => state.topDevicesPowerCostData?.loading
  );

  useEffect(() => {
    if (siteId) {
      dispatch(fetchTopDevicesPowerCostData(siteId, topDevicesOption));
    }
  }, [siteId, topDevicesOption]);

  const handleDeviceClick = (record) => {
    navigate('inventorydetail', {
      state: {
        // data: record,
        // parent: 'dashboard',
        // mycode
        ip: record.ip_address,
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'device_name',
      key: 'device_name',
      // ...getColumnSearchProps("device_name"),
      render: (text, record) => {
        return (
          <p
            // onClick={() => handleDeviceClick(record)}
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: 'Total Power Consumption',
      dataIndex: 'total_power',
      key: 'total_power',
      // ...getColumnSearchProps("total_power"),
      // render: (record) => {
      //   return (
      //     <div
      //       style={{
      //         background: theme?.palette?.graph?.graph_area?.from_top,
      //         color: theme?.palette?.main_layout?.primary_text,
      //         width: "65px",
      //         height: "25px",
      //         borderRadius: "3px",
      //         display: "flex",
      //         justifyContent: "center",
      //         alignItems: "center",
      //       }}
      //     >
      //       {record} kw
      //     </div>
      //   );
      // },
    },
    // {
    //   title: 'Total Bandwidth',
    //   dataIndex: 'total_bandwidth',
    //   key: 'total_bandwidth',
    //   // render: (record) => {
    //   //   return (
    //   //     <div
    //   //       // style={{
    //   //       //   background: theme?.palette?.graph?.graph_area?.from_top,
    //   //       //   color: theme?.palette?.main_layout?.primary_text,
    //   //       //   width: "65px",
    //   //       //   height: "25px",
    //   //       //   borderRadius: "3px",
    //   //       //   display: "flex",
    //   //       //   justifyContent: "center",
    //   //       //   alignItems: "center",
    //   //       // }}
    //   //     >
    //   //       {record} Mbps
    //   //     </div>
    //   //   );
    //   // },
    // },
    {
      title: 'Traffic Speed',
      dataIndex: 'traffic_speed',
      key: 'traffic_speed',
      // render: (record) => {
      //   return (
      //     <div
      //       // style={{
      //       //   background: theme?.palette?.graph?.graph_area?.from_top,
      //       //   color: theme?.palette?.main_layout?.primary_text,
      //       //   width: "65px",
      //       //   height: "25px",
      //       //   borderRadius: "3px",
      //       //   display: "flex",
      //       //   justifyContent: "center",
      //       //   alignItems: "center",
      //       // }}
      //     >
      //       {record} Mbps
      //     </div>
      //   );
      // },
    },
    // {
    //   title: 'Bandwidth Utilization',
    //   dataIndex: 'bandwidth_utilization',
    //   key: 'bandwidth_utilization',
    //   // render: (record) => {
    //   //   return (
    //   //     <div
    //   //       // style={{
    //   //       //   background: theme?.palette?.graph?.graph_area?.from_top,
    //   //       //   color: theme?.palette?.main_layout?.primary_text,
    //   //       //   width: "65px",
    //   //       //   height: "25px",
    //   //       //   borderRadius: "3px",
    //   //       //   display: "flex",
    //   //       //   justifyContent: "center",
    //   //       //   alignItems: "center",
    //   //       // }}
    //   //     >
    //   //       {record} Mbps
    //   //     </div>
    //   //   );
    //   // },
    // },
    {
      title: 'Power Consumption Ratio',
      dataIndex: 'pcr',
      key: 'pcr',
      // render: (record) => {
      //   return (
      //     <div
      //       style={{
      //         background: theme?.palette?.graph?.graph_area?.from_top,
      //         color: theme?.palette?.main_layout?.primary_text,
      //         width: "65px",
      //         height: "25px",
      //         borderRadius: "3px",
      //         display: "flex",
      //         justifyContent: "center",
      //         alignItems: "center",
      //       }}
      //     >
      //       {record}
      //     </div>
      //   );
      // },
    },
    {
      title: 'CO2 Emissions',
      dataIndex: 'co2emmissions',
      key: 'co2emmissions',
      // render: (record) => {
      //   return (
      //     <div
      //       style={{
      //         background: theme?.palette?.graph?.graph_area?.from_top,
      //         color: theme?.palette?.main_layout?.primary_text,
      //         width: "65px",
      //         height: "25px",
      //         borderRadius: "3px",
      //         display: "flex",
      //         justifyContent: "center",
      //         alignItems: "center",
      //       }}
      //     >
      //       {record} kg
      //     </div>
      //   );
      // },
    },
    // {
    //   title: "Average Power Consumption",
    //   dataIndex: "average_power",
    //   key: "average_power",
    //   // ...getColumnSearchProps("average_power"),
    //   render: (record) => {
    //     return (
    //       <div
    //         style={{
    //           background: theme?.palette?.graph?.graph_area?.from_top,
    //           color: theme?.palette?.main_layout?.primary_text,
    //           width: "65px",
    //           height: "25px",
    //           borderRadius: "3px",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         {record}kw
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Power Cost",
    //   dataIndex: "cost_of_power",
    //   key: "cost_of_power",
    //   // ...getColumnSearchProps("cost_of_power"),
    //   render: (record) => {
    //     return (
    //       <div
    //         style={{
    //           background: theme?.palette?.graph?.graph_area?.from_top,
    //           color: theme?.palette?.main_layout?.primary_text,
    //           width: "65px",
    //           height: "25px",
    //           borderRadius: "3px",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         {record} AED
    //       </div>
    //     );
    //   },
    // },
  ];
  return (
    <CustomSpin spinning={isPue ? spinnerLoading : loading}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          height: '386px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: theme?.palette?.main_layout?.primary_text,
              marginBottom: '0px',
              marginTop: '0px',
              fontFamily: 'inter',
            }}
          >
            Top 5 Devices Power and Bandwidth Utilization from{' '}
            {topDevicesOption}
          </p>
          <KpiSelector
            options={kpiOptions}
            setTopDevicesOption={setTopDevicesOption}
            value={topDevicesOption}
            topDevices="true"
          />
        </div>
        {topDevicesPowerCostData?.length > 0 ? (
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            columns={columns}
            dataSource={topDevicesPowerCostData || ''}
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={false}
            scroll={{
              x: 600,
            }}
          />
        ) : (
          <div
            style={{
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              No Data
            </p>
          </div>
        )}
      </CustomCard>
    </CustomSpin>
  );
};

export default Top5DevicesTable;
