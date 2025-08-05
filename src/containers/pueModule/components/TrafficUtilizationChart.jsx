// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';
// import { useTheme } from '@mui/material';

// const TrafficUtilizationChart = ({ trafficData, showComparison = true }) => {
//   const chartRef = useRef(null);
//   const theme = useTheme();

//   useEffect(() => {
//     const chart = echarts.init(chartRef.current);

//     const currentData = trafficData.map((d) => ({
//       ...d,
//       isUpdated: false,
//     }));

//     const updatedData = trafficData.map((d) => ({
//       label: d.label,
//       value: Math.round(d.value * 1.1), // increase by 10% (or any logic)
//       isUpdated: true,
//     }));

//     const fullData = showComparison
//       ? [...currentData, ...updatedData]
//       : currentData;

//     const categories = showComparison
//       ? [
//           ...currentData.map((d) => d.label),
//           '', // spacer
//           ...updatedData.map((d) => `Updated ${d.label}`),
//         ]
//       : currentData.map((d) => d.label);

//     const getGradientColor = (label) => {
//       if (label.includes('Consume')) return '#9619B5';
//       if (label.includes('allocated')) return '#0288D1';
//       return '#2268D1';
//     };

//     const option = {
//       title: {
//         text: 'Traffic Utilization ',
//         left: 'left',
//         textStyle: {
//           fontSize: 16,
//           fontFamily: 'Inter',
//           color: theme?.palette?.graph?.title || '#fff',
//         },
//       },

//       grid: {
//         top: '20%',
//         left: '5%',
//         right: '5%',
//         bottom: '8%',
//         containLabel: true,
//       },
//       xAxis: {
//         type: 'category',
//         data: categories,

//         axisLabel: {
//           show: false,
//           fontSize: 12,
//           color: theme?.palette?.graph?.line_color || '#ccc',
//           interval: 0,
//         },
//         axisLine: {
//           lineStyle: {
//             color: theme?.palette?.graph?.line_color || '#444',
//           },
//         },
//         splitLine: {
//           show: true,
//           lineStyle: {
//             color: theme?.palette?.graph?.line_color,
//             type: 'dashed',
//           },
//         },
//       },
//       yAxis: {
//         type: 'value',
//         max: 100,
//         axisLabel: {
//           fontSize: 12,
//           color: theme?.palette?.graph?.xis,
//         },
//         splitLine: {
//           show: false,
//           lineStyle: {
//             color: theme?.palette?.graph?.xis,
//             type: 'dashed',
//           },
//         },
//       },
//       tooltip: {
//         show: false,
//         trigger: 'item',
//         formatter: '{b}: {c}',
//       },

//       series: [
//         {
//           type: 'bar',
//           barWidth: `${showComparison ? '50%' : '40%'}`,
//           label: {
//             show: true,
//             position: 'inside',
//             rotate: 90,
//             formatter: ({ name }) => name,
//             fontSize: `${showComparison ? '10px' : '12px'}`,
//             color: theme?.palette?.graph?.label_color,
//           },
//           data: [
//             ...currentData.map((item) => ({
//               value: item.value,
//               name: item.label,
//               itemStyle: {
//                 color: getGradientColor(item.label, false),
//               },
//             })),
//             ...(showComparison ? [{ value: null }] : []), // spacer if comparing
//             ...(showComparison
//               ? updatedData.map((item) => ({
//                   value: item.value,
//                   name: ` ${item.label}`,
//                   itemStyle: {
//                     color: getGradientColor(item.label, true),
//                     // opacity: 0.5,
//                   },
//                 }))
//               : []),
//           ],
//         },
//       ],

//       graphic: [
//         {
//           type: 'text',
//           left: `${showComparison ? '23%' : '47%'}`,
//           top: '5%',
//           style: {
//             text: 'Current',
//             fill: '#2268d1',
//             font: ' 12px Inter',
//             backgroundColor: theme?.mode === 'dark' ? '#4256AE40' : '#EEF2FF',
//             padding: [8, 12, 8, 8],
//             borderRadius: 8,
//           },
//         },
//         ...(showComparison
//           ? [
//               {
//                 type: 'text',
//                 left: '70%',
//                 top: '5%',
//                 style: {
//                   text: 'Updated Traffic',
//                   fill: '#14A166',
//                   fontSize: 12,
//                   fontFamily: 'Inter',
//                   fontWeight: 300,
//                   backgroundColor:
//                     theme?.mode === 'dark' ? '#71B62633' : '#E9FAF1',
//                   padding: [8, 8],
//                   borderRadius: 8,
//                 },
//               },
//             ]
//           : []),
//       ],
//     };

//     chart.setOption(option);
//     const resizeHandler = () => chart.resize();
//     window.addEventListener('resize', resizeHandler);
//     return () => {
//       chart.dispose();
//       window.removeEventListener('resize', resizeHandler);
//     };
//   }, [theme, showComparison]);

//   return <div ref={chartRef} style={{ width: '100%', height: '280px' }} />;
// };

// export default TrafficUtilizationChart;

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

const TrafficUtilizationChart = ({
  currentData = [],
  updatedData = [],
  showComparison = true,
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 768;
  const graphicTop = isSmallScreen ? '10%' : '0%';
  const gridTop = isSmallScreen ? '35%' : '30%';
  useEffect(() => {
    if (!chartRef.current || currentData.length === 0) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    // const categories = showComparison
    //   ? [
    //       ...currentData.map((d) => d.label),
    //       ...(showComparison ? [' '] : []), // spacer label
    //       ...updatedData.map((d) => `${d.label}`),
    //     ]
    //   : currentData.map((d) => d.label);
    const categories = showComparison
      ? [
          ...currentData.map((d) => d.label),
          'Spacer', // use a unique label for spacer
          ...updatedData.map((d) => `${d.label}`),
        ]
      : currentData.map((d) => d.label);
    const getGradientColor = (label) => {
      if (label.includes('Consume')) return '#9619B5';
      if (label.includes('allocated')) return '#01A5DE';
      return '#2268D1';
    };
    const data = [
      ...currentData.map((item) => ({
        value: item.value,
        name: item.label,
        itemStyle: {
          color: getGradientColor(item.label),
        },
      })),
      ...(showComparison
        ? [
            {
              value: null,
              name: 'Spacer', // this must match the xAxis label
            },
          ]
        : []),
      ...(showComparison
        ? updatedData.map((item) => ({
            value: item.value,
            name: `Updated ${item.label}`,
            itemStyle: {
              color: getGradientColor(item.label),
            },
          }))
        : []),
    ];

    const option = {
      title: {
        show: true,
        text: 'Traffic Utilization',
        left: 'left',
        textStyle: {
          fontSize: isSmallScreen ? 14 : 16,
          fontFamily: 'Inter',
          color: theme?.palette?.graph?.title || '#fff',
        },
      },
      grid: {
        top: gridTop,
        left: '5%',
        right: '5%',
        bottom: '2%',
        containLabel: true,
      },
      // xAxis: {
      //   type: 'category',
      //   data: categories,

      //   axisLabel: {
      //     show: true,
      //     fontSize: 10,
      //     color: theme?.palette?.graph?.xis || '#ccc',
      //     rotate: 0, // no need to rotate if multiline
      //     formatter: function (value) {
      //       // Break after spaces
      //       return value.replace(/\s+/g, '\n');
      //     },
      //   },
      //   axisLine: {
      //     lineStyle: {
      //       color: theme?.palette?.graph?.line_color || '#444',
      //     },
      //   },
      //   splitLine: {
      //     show: true,
      //     lineStyle: {
      //       color: theme?.palette?.graph?.line_color,
      //       type: 'dashed',
      //     },
      //   },
      // },

      xAxis: {
        type: 'category',
        data: categories, // includes "Spacer"
        axisLabel: {
          show: true,
          fontSize: 10,
          color: theme?.palette?.graph?.xis || '#ccc',
          formatter: (value) =>
            value === 'Spacer' ? '' : value.replace(/\s+/g, '\n'),
        },
        axisLine: {
          lineStyle: {
            color: theme?.palette?.graph?.line_color || '#444',
          },
        },
        splitLine: {
          show: true,
          interval: 0, // ensure all lines show
          lineStyle: {
            color: theme?.palette?.graph?.line_color || '#444',
            type: 'dashed',
          },
        },
      },

      yAxis: {
        type: 'value',
        // max: 100,
        axisLabel: {
          fontSize: 12,
          color: theme?.palette?.graph?.xis,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: theme?.palette?.graph?.xis,
            type: 'dashed',
          },
        },
      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      series: [
        {
          type: 'bar',
          barWidth: showComparison ? '50%' : '40%',

          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => value,
            fontSize: 10,
            fontWeight: '500',
            color: theme?.palette?.graph?.xis || '#aaa',
            fontFamily: 'Inter',
          },
          data: [
            ...currentData.map((item) => ({
              value: item.value,
              name: item.label,
              itemStyle: {
                color: getGradientColor(item.label),
              },
            })),
            ...(showComparison ? [{ value: null }] : []), // spacer
            ...(showComparison
              ? updatedData.map((item) => ({
                  value: item.value,
                  name: ` ${item.label}`,
                  itemStyle: {
                    color: getGradientColor(item.label),
                  },
                }))
              : []),
          ],
        },
      ],
      // graphic: [
      //   {
      //     type: 'text',
      //     left: showComparison ? '27%' : '47%',
      //     top: graphicTop,
      //     style: {
      //       text: 'Current',
      //       fill: '#2268d1',
      //       font: '10px Inter',
      //       backgroundColor: theme?.mode === 'dark' ? '#4256AE40' : '#EEF2FF',
      //       padding: [8, 8],
      //       borderRadius: 4,
      //     },
      //   },
      //   ...(showComparison
      //     ? [
      //         {
      //           type: 'text',
      //           left: '70%',
      //           top: graphicTop,
      //           style: {
      //             text: 'Updated',
      //             fill: '#42ACAE',
      //             fontSize: 10,
      //             fontFamily: 'Inter',
      //             fontWeight: 300,
      //             backgroundColor:
      //               theme?.mode === 'dark' ? '#42ACAE40' : '#E9FAF1',
      //             padding: [8, 8],
      //             borderRadius: 4,
      //           },
      //         },
      //       ]
      //     : []),
      // ],
      graphic: showComparison
        ? [
            {
              type: 'text',
              left: '25%',
              top: graphicTop,
              style: {
                text: 'Current',
                fill: '#2268d1',
                font: '10px Inter',
                backgroundColor:
                  theme?.mode === 'dark' ? '#4256AE40' : '#EEF2FF',
                padding: [8, 8],
                borderRadius: 4,
              },
            },
            {
              type: 'text',
              left: '73%',
              top: graphicTop,
              style: {
                text: 'Updated',
                fill: '#844DCD',
                fontSize: 10,
                fontFamily: 'Inter',
                fontWeight: 300,
                backgroundColor:
                  theme?.mode === 'dark' ? '#8518A133' : '#8518A11F',
                padding: [8, 8],
                borderRadius: 4,
              },
            },
          ]
        : [],
    };

    chart.setOption(option, true);
  }, [theme, currentData, updatedData, showComparison]);

  useEffect(() => {
    const chart = chartInstanceRef.current;
    const handleResize = () => chart?.resize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '280px' }} />;
};

export default TrafficUtilizationChart;
