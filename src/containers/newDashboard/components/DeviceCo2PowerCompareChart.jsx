// import React from 'react';
// import ReactECharts from 'echarts-for-react';
// import * as echarts from 'echarts';
// import { useTheme } from '@mui/material/styles';
// import { Col, Row } from 'antd';
// import CustomSpin from '../../../components/CustomSpin';
// import CustomCard from '../../../components/customCard';

// const DeviceCo2PowerCompareChart = ({ onClick, loading }) => {
//   const theme = useTheme();

//   const chartData = Array.from({ length: 24 }, (_, i) => {
//     const hour = i.toString().padStart(2, '0') + ':00';
//     return {
//       time: hour,
//       carbon_emission: +(Math.random() * 20).toFixed(2), // Random KG
//       pcr: +(Math.random() * 5).toFixed(2), // Random W/Gbps
//     };
//   });

//   const option = {
//     grid: {
//       top: '5%',
//       left: '3%',
//       right: '4%',
//       bottom: '10%',
//       containLabel: true,
//     },

//     tooltip: {
//       trigger: 'axis',
//       axisPointer: { type: 'shadow' },
//       backgroundColor: theme?.palette?.graph?.toolTip_bg,
//       borderColor: theme?.palette?.graph?.tooltip_border,
//       textStyle: {
//         color: theme?.palette?.main_layout?.primary_text,
//         fontSize: 14,
//         fontFamily: 'inter',
//         fontWeight: 'bold',
//         lineHeight: 1.5,
//       },
//       formatter: (params) =>
//         params
//           .map(
//             (p) =>
//               `<div>${p.seriesName}: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${p.value} ${
//                 p.seriesName === 'CO₂ Emission' ? 'KG' : 'W/Gbps'
//               }</span></div>`
//           )
//           .join(''),
//     },
//     legend: {
//       show: true,
//       top: 'top',
//       right: 10,
//       itemWidth: 0, // hide default icon
//       itemHeight: 0,
//       textStyle: {
//         rich: {
//           btn: {
//             backgroundColor: '#e0e0e0', // your button color
//             borderColor: '#999',
//             borderWidth: 1,
//             borderRadius: 6,
//             padding: [4, 10],
//             color: '#000',
//             fontWeight: 500,
//           },
//         },
//         fontSize: 14,
//       },
//       formatter: function (name) {
//         return `{btn|${name}}`;
//       },
//     },
//     xAxis: {
//       type: 'category',
//       data: chartData.map((d) => d.time),
//       boundaryGap: true,
//       axisLabel: {
//         interval: 0,
//         rotate: 0,
//         // color: theme?.palette?.graph?.xis,
//         color: '#979797',
//       },
//     },
//     yAxis: {
//       type: 'value',
//       splitLine: {
//         show: true,
//         lineStyle: {
//           type: 'dashed',
//           color: '#979797',
//         },
//       },
//       axisLabel: {
//         color: '#979797',
//         fontSize: 13,
//       },
//     },
//     dataZoom:
//       chartData.length > 15
//         ? [
//             {
//               type: 'slider',
//               show: true,
//               xAxisIndex: 0,
//               height: 1,
//               bottom: 30,
//               start: 0,
//               end: (15 / chartData.length) * 100,
//               backgroundColor: theme?.palette?.graph?.slider?.backgroundColor,
//               fillerColor: theme?.palette?.graph?.slider?.fillerColor,
//               handleStyle: {
//                 color: theme?.palette?.graph?.slider?.handleColor,
//                 borderColor: theme?.palette?.graph?.slider?.handleColor,
//               },
//               emphasis: {
//                 fillerColor: theme?.palette?.graph?.slider?.hoverFillerColor,
//                 handleStyle: {
//                   color: theme?.palette?.graph?.slider?.handleHoverColor,
//                   borderColor: theme?.palette?.graph?.slider?.handleHoverColor,
//                 },
//                 moveHandleStyle: {
//                   color: theme?.palette?.graph?.slider?.handleHoverColor,
//                   borderColor: theme?.palette?.graph?.slider?.handleHoverColor,
//                 },
//               },
//             },
//             {
//               type: 'inside',
//               xAxisIndex: 0,
//               zoomOnMouseWheel: false,
//               moveOnMouseWheel: true,
//               moveOnMouseMove: true,
//             },
//           ]
//         : [],
//     series: [
//       {
//         name: 'CO₂ Emission',
//         type: 'bar',
//         data: chartData.map((d) => d.carbon_emission),
//         barWidth: 20,
//         itemStyle: {
//           color: theme?.palette?.graph?.graph_area?.line || '#52b69a',
//         },
//       },
//       {
//         name: 'Power Consumption Ratio',
//         type: 'bar',
//         data: chartData.map((d) => d.pcr),
//         barWidth: 20,
//         itemStyle: {
//           color: theme?.palette?.graph?.graph_area?.secondary_line || '#d62828',
//         },
//       },
//     ],
//   };

//   return (
//     <Row gutter={[16, 16]} style={{ padding: '10px' }}>
//       <Col xs={24} lg={24}>
//         <CustomCard
//           style={{
//             border: `1px solid ${theme?.palette?.default_card?.border}`,
//             backgroundColor: theme?.palette?.main_layout?.background,
//             borderRadius: '7px',
//             color: theme?.palette?.main_layout?.primary_text,
//           }}
//         >
//           <CustomSpin spinning={loading}>
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 width: '100%',
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: '16px',
//                   color: theme?.palette?.main_layout?.primary_text,
//                   marginBottom: '0px',
//                   marginTop: '0px',
//                   fontFamily: 'inter',
//                 }}
//               >
//                 Device Level
//               </p>
//               <div className="buttons"> show compare</div>
//             </div>
//             <div style={{ position: 'relative' }}>
//               <ReactECharts
//                 option={option}
//                 style={{ height: '350px' }}
//                 onEvents={{ click: onClick }}
//               />
//             </div>
//           </CustomSpin>
//         </CustomCard>
//       </Col>
//     </Row>
//   );
// };
// export default DeviceCo2PowerCompareChart;

import React, { useState, useMemo, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { Col, Row } from 'antd';
import CustomSpin from '../../../components/CustomSpin';
import CustomCard from '../../../components/customCard';
import DefaultSelector from '../../../components/defaultSelector';
import { useSelector } from 'react-redux';

const DeviceCo2PowerCompareChart = ({
  onClick,
  loading,
  chartData,
  getCo2Pcr,
}) => {
  const theme = useTheme();

  const devices = useSelector((state) => state.devices?.data?.data);
  // console.log('Devices from Store:', devices);

  // const [showCO2, setShowCO2] = useState(true);
  // const [showPCR, setShowPCR] = useState(true);
  const [showCO2, setShowCO2] = useState(true);
  const [showPCR, setShowPCR] = useState(false);
  const [isShowCompare, setIsShowCompare] = useState(false);
  const [isCompareDone, setIsCompareDone] = useState(false);
  const [device1, setDevice1] = useState(null);
  const [device2, setDevice2] = useState(null);
  const showBothByDefault = !showCO2 && !showPCR;

  // console.log('Chart data from API', chartData);

  let comparedData = [];

  if (isCompareDone && chartData?.length === 2) {
    const device1 = chartData[0];
    const device2 = chartData[1];

    comparedData = device1.metrics_data.map((entry, index) => {
      const d1 = entry;
      const d2 = device2.metrics_data[index]; // assuming same order and length
      // const hourOnly = d1.time.split(" ")[1].replace(":", "");
      return {
        time: d1.time.split(' ')[1],
        device1_pcr: d1.pcr,
        device2_pcr: d2.pcr,
        device1_co2: d1.carbon_emission_kg,
        device2_co2: d2.carbon_emission_kg,
      };
    });
  }

  console.log('Compared Data:', comparedData);

  const updatedDevices = devices?.map((d) => ({
    label: d.device_name,
    value: d.device_name,
    deviceId: d.id,
  }));

  useEffect(() => {
    if (devices?.length > 0) {
      setDevice1(devices[0]);
      setDevice2(devices[1]);
    }
  }, [devices]);

  // called in parent
  //  useEffect(() => {
  //     if (siteId && access_token) {
  //       dispatch(fetchDevicesData(siteId, access_token));
  //     }
  //   }, [siteId, access_token]);

  const option = {
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: theme?.palette?.graph?.toolTip_bg || '#1e1e2f',
      borderColor: theme?.palette?.graph?.tooltip_border || '#444',
      borderWidth: 1,
      textStyle: {
        color: theme?.palette?.graph?.toolTip_text_color || '#fff',
        fontFamily: 'Inter',
        fontSize: 12,
      },
      extraCssText: 'z-index: 1000;',
      formatter: (params) =>
        params
          ?.map(
            (p) =>
              `<div>${p.seriesName}: ${p.value} ${
                p.seriesName === 'CO₂ Emission' ? 'KG' : 'W/Gbps'
              }</span></div>`
          )
          .join(''),
    },
    legend: { show: false }, // Hide default legend
    xAxis: {
      type: 'category',
      // data: chartData?.comparison
      //   ? chartData?.map((d) => d.time)
      //   : chartData?.map((d) => d.device_name),
      data: isCompareDone
        ? comparedData?.map((d) => d.time)
        : chartData?.map((d) => d.device_name),
      boundaryGap: true,
      axisLabel: {
        interval: 0,
        rotate: isCompareDone ? 30 : 45,
        color: '#979797',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          // color: '#979797',
          color: theme?.palette?.graph?.line_color,
        },
      },
      axisLabel: {
        color: '#979797',
        fontSize: 13,
      },
    },
    dataZoom:
      chartData?.length > 15
        ? [
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              height: 1,
              bottom: 30,
              start: 0,
              end: (15 / chartData?.length) * 100,
              backgroundColor: theme?.palette?.graph?.slider?.backgroundColor,
              fillerColor: theme?.palette?.graph?.slider?.fillerColor,
              handleStyle: {
                color: theme?.palette?.graph?.slider?.handleColor,
                borderColor: theme?.palette?.graph?.slider?.handleColor,
              },
              emphasis: {
                fillerColor: theme?.palette?.graph?.slider?.hoverFillerColor,
                handleStyle: {
                  color: theme?.palette?.graph?.slider?.handleHoverColor,
                  borderColor: theme?.palette?.graph?.slider?.handleHoverColor,
                },
                moveHandleStyle: {
                  color: theme?.palette?.graph?.slider?.handleHoverColor,
                  borderColor: theme?.palette?.graph?.slider?.handleHoverColor,
                },
              },
            },
            {
              type: 'inside',
              xAxisIndex: 0,
              zoomOnMouseWheel: false,
              moveOnMouseWheel: true,
              moveOnMouseMove: true,
            },
          ]
        : [],

    // series: [
    //   (showCO2 || showBothByDefault) && {
    //     name: 'CO₂ Emission',
    //     type: 'bar',
    //     data: chartData?.map((d) => d.carbon_emission_kg),
    //     barWidth: 20,
    //     itemStyle: {
    //       // color: theme?.palette?.graph?.graph_area?.line || '#52b69a',
    //       // color: '#52b69a',
    //       color: '#14A166',
    //     },
    //   },
    //   (showPCR || showBothByDefault) && {
    //     name: 'Power Consumption Ratio',
    //     type: 'bar',
    //     data: chartData?.map((d) => d.pcr),
    //     barWidth: 20,
    //     itemStyle: {
    //       // color: theme?.palette?.graph?.graph_area?.secondary_line || '#d62828',
    //       color: '#2268D1',
    //     },
    //   },
    // ].filter(Boolean),
    series: isCompareDone
      ? [
          (showCO2 || showBothByDefault) && {
            name: 'CO₂ Emission - Device 1',
            type: 'bar',
            data: comparedData?.map((d) => d.device1_co2),
            barWidth: 15,
            itemStyle: { color: theme?.palette?.shades?.light_green },
          },
          (showCO2 || showBothByDefault) && {
            name: 'CO₂ Emission - Device 2',
            type: 'bar',
            data: comparedData?.map((d) => d.device2_co2),
            barWidth: 15,
            itemStyle: { color: '#A1E3B8' },
          },
          (showPCR || showBothByDefault) && {
            name: 'Power Consumption Ratio - Device 1',
            type: 'bar',
            data: comparedData?.map((d) => d.device1_pcr),
            barWidth: 15,
            itemStyle: { color: theme?.palette?.shades?.light_blue },
          },
          (showPCR || showBothByDefault) && {
            name: 'Power Consumption Ratio - Device 2',
            type: 'bar',
            data: comparedData?.map((d) => d.device2_pcr),
            barWidth: 15,
            itemStyle: { color: '#8AB6F1' },
          },
        ].filter(Boolean)
      : [
          (showCO2 || showBothByDefault) && {
            name: 'CO₂ Emission',
            type: 'bar',
            data: chartData?.map((d) => d.carbon_emission_kg),
            barWidth: 20,
            itemStyle: { color: theme?.palette?.shades?.light_green },
          },
          (showPCR || showBothByDefault) && {
            name: 'Power Consumption Ratio',
            type: 'bar',
            data: chartData?.map((d) => d.pcr),
            barWidth: 20,
            itemStyle: { color: theme?.palette?.shades?.light_blue },
          },
        ].filter(Boolean),
  };

  return (
    <Row gutter={[16, 16]} style={{ padding: '10px' }}>
      <Col xs={24} lg={24}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          <CustomSpin spinning={loading}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: theme?.palette?.main_layout?.primary_text,
                  margin: 0,
                  fontFamily: 'inter',
                }}
              >
                Device Level{' '}
                {showCO2 ? 'Carbon Emission' : 'Power Consumption Ratio'}
              </p>
              <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <button
                  // onClick={() => setShowCO2((prev) => !prev)}
                  onClick={() => {
                    setShowCO2((prev) => !prev);
                    setShowPCR((prev) => !prev);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: !showCO2 ? 'none' : `1px solid #34404B`,
                    backgroundColor: !showCO2 ? '#0F1620' : '#141D2A',
                    fontWeight: 500,
                    color: '#C8CFDA',
                    cursor: 'pointer',
                  }}
                >
                  Device Level Carbon Emission
                </button>
                <button
                  onClick={() => {
                    setShowPCR((prev) => !prev);
                    setShowCO2((prev) => !prev);
                  }}
                  style={{
                    padding: ' 10px',
                    borderRadius: '6px',
                    border: !showPCR ? 'none' : `1px solid #34404B`,
                    backgroundColor: !showPCR ? '#0F1620' : '#141D2A',
                    fontWeight: 500,
                    color: '#C8CFDA',
                    cursor: 'pointer',
                  }}
                >
                  Device Level Power Consumption Ratio
                </button>
                <button
                  onClick={() => {
                    setIsShowCompare((prev) => !prev);
                    if (isCompareDone) {
                      setIsCompareDone(false);
                      getCo2Pcr();
                    }
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: !isShowCompare ? 'none' : `1px solid #34404B`,
                    backgroundColor: '#649AEA24',
                    fontWeight: 500,
                    color: '#2268D1',
                    cursor: 'pointer',
                  }}
                >
                  {isShowCompare ? 'Hide Compare' : 'Show Compare'}
                </button>
                {/* <div>show compare</div> */}
              </div>
            </div>
            {/* device selector */}
            {isShowCompare && (
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  width: '50%',
                  marginTop: '5px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <DefaultSelector
                    options={
                      updatedDevices?.filter(
                        (device) => device.deviceId !== device2?.device_id
                      ) || []
                    }
                    onChange={(selectedName) => {
                      const selectedDevice = devices.find(
                        (d) => d.device_name === selectedName
                      );
                      setDevice1(selectedDevice);
                    }}
                    value={device1?.device_name}
                    raks={true}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <DefaultSelector
                    options={
                      updatedDevices?.filter(
                        (device) => device.deviceId !== device1?.device_id
                      ) || []
                    }
                    onChange={(selectedName) => {
                      const selectedDevice = devices.find(
                        (d) => d.device_name === selectedName
                      );
                      setDevice2(selectedDevice);
                    }}
                    value={device2?.device_name}
                    raks={true}
                  />
                </div>
                <div style={{ height: '42px' }}>
                  <button
                    onClick={() => {
                      if (!isCompareDone) {
                        setIsCompareDone(true);
                      }
                      const devicesIds = [device1?.id, device2?.id];
                      console.log('devices IDS', devicesIds);
                      getCo2Pcr(devicesIds);
                    }}
                    style={{
                      height: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: !isCompareDone ? 'none' : `1px solid #34404B`,
                      backgroundColor: '#649AEA24',
                      fontWeight: 500,
                      color: '#2268D1',
                      cursor: 'pointer',
                    }}
                  >
                    Compare
                  </button>
                </div>
              </div>
            )}
            {/* device selector end */}
            <div style={{ position: 'relative' }}>
              <ReactECharts
                option={option}
                style={{ height: '350px' }}
                onEvents={{ click: onClick }}
                key={`${showCO2}-${showPCR}`}
              />
            </div>
          </CustomSpin>
        </CustomCard>
      </Col>
    </Row>
  );
};

export default DeviceCo2PowerCompareChart;
