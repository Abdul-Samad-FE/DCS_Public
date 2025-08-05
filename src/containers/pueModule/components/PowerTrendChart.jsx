import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';
import styled from 'styled-components';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

const ChartContainer = styled.div`
  width: 100%;
  height: 280px;

  @media (max-width: 1200px) {
    height: 280px;
  }

  @media (max-width: 480px) {
    // height: 180px;
  }
`;
const PowerTrendChart = ({
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
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    if (!currentData || currentData.length === 0) return;

    const categories = showComparison
      ? [
          ...currentData.map((d) => d.label),
          '',
          ...updatedData.map((d) => `Updated ${d.label}`),
        ]
      : currentData.map((d) => d.label);

    const getGradientColor = (label, isUpdated) => {
      if (label.includes('Input')) {
        return {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: isUpdated
            ? [
                { offset: 0, color: '#D88AF3' },
                { offset: 1, color: '#9619B5' },
              ]
            : [
                { offset: 0, color: '#F3B7FF' },
                { offset: 1, color: '#9619B5' },
              ],
        };
      }

      if (label.includes('Output')) {
        return {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: isUpdated
            ? [
                { offset: 0, color: '#6BD8F5' },
                { offset: 1, color: '#0288D1' },
              ]
            : [
                { offset: 0, color: '#A9F0FF' },
                { offset: 1, color: '#0288D1' },
              ],
        };
      }

      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: isUpdated
          ? [
              { offset: 0, color: '#8BF5D4' },
              { offset: 1, color: '#22C1A7' },
            ]
          : [
              { offset: 0, color: '#8BF5D4' },
              { offset: 1, color: '#22C1A7' },
            ],
      };
    };

    const seriesData = [
      ...currentData.map((item) => ({
        value: item.value,
        name: item.label,
        itemStyle: {
          color: getGradientColor(item.label, false),
        },
      })),
      ...(showComparison ? [{ value: null }] : []),
      ...(showComparison
        ? updatedData.map((item) => ({
            value: item.value,
            name: ` ${item.label}`,
            itemStyle: {
              color: getGradientColor(item.label, true),
            },
          }))
        : []),
    ];

    const option = {
      title: {
        show: true,
        text: 'Power Trends',
        left: 'left',
        textStyle: {
          fontSize: isSmallScreen ? 14 : 16,
          fontFamily: 'Inter',
          color: theme?.palette?.graph?.title || '#fff',
        },
      },
      legend: { show: false },
      grid: {
        top: gridTop,
        left: '5%',
        right: '5%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          show: false,
          fontSize: 12,
          color: theme?.palette?.graph?.xis || '#ccc',
          interval: 0,
        },
        axisLine: {
          lineStyle: {
            color: theme?.palette?.graph?.line_color || '#444',
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: theme?.palette?.graph?.line_color,
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        // max: 300,
        axisLabel: {
          fontSize: 12,
          color: theme?.palette?.graph?.xis,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: theme?.palette?.graph?.line_color,
            type: 'dashed',
          },
        },
      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{c}',
      },
      series: [
        {
          type: 'bar',

          barWidth: `${showComparison ? '60%' : '40%'}`,

          // label: {
          //   show: true,
          //   position: 'top',
          //   formatter: ({ name, value }) => `${name}\n\n ${value}`,
          //   fontSize: 10,
          //   fontWeight: '500',
          //   color: theme?.palette?.graph?.xis || '#aaa',
          //   fontFamily: 'Inter',
          // },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              const { name, value, dataIndex } = params;
              let unit = '';

              // Assign units based on the index or name
              if (name.includes('Input Power')) {
                unit = 'kW';
              } else if (name.includes('Output Power')) {
                unit = 'kW';
              } else if (name.includes('Energy Efficiency')) {
                unit = '%';
              }

              return `${name}\n\n ${value} ${unit}`;
            },
            fontSize: 10,
            fontWeight: '500',
            color: theme?.palette?.graph?.xis || '#aaa',
            fontFamily: 'Inter',
          },

          // label: {
          //   show: true,
          //   position: 'top',
          //   formatter: (params) =>
          //     `{period|${params.name}}\n\n{value|${params.value}}`,
          //   rich: {
          //     value: {
          //       fontSize: 12,
          //       fontWeight: 'semi-bold',
          //       color: theme?.palette?.graph?.title || '#fff',
          //     },
          //     period: {
          //       fontSize: 10,
          //       fontWeight: '500',
          //       color: theme?.palette?.graph?.xis || '#aaa',
          //     },
          //   },
          // },
          data: seriesData,
        },
      ],
      // graphic: [
      //   {
      //     type: 'text',
      //     left: `${showComparison ? '23%' : '47%'}`,
      //     // top: '5%',
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
              left: '24%',
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
            {
              type: 'line',
              left: '50%',
              top: '10%',
              shape: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 280, // adjust based on chart height
              },
              style: {
                stroke: theme?.palette?.graph?.line_color,
                lineWidth: 1,
                lineDash: [4, 4],
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

  return <ChartContainer ref={chartRef} />;
};

export default PowerTrendChart;
