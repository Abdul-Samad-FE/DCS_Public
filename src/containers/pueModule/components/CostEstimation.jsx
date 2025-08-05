import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

const CostEstimation = ({
  currentData,
  updatedData,
  showComparison,
  selectedCurrency,
}) => {
  console.log('currentData in Cost', currentData);

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

    // Combine datasets if comparison is enabled
    const fullData = showComparison
      ? [
          ...currentData?.map((d) => ({ ...d, isUpdated: false })),
          ...(showComparison ? [{ value: null }] : []),
          ...updatedData.map((d) => ({ ...d, isUpdated: true })),
        ]
      : currentData.map((d) => ({ ...d, isUpdated: false }));

    const categories = fullData.map((d) => d.label);

    const yearlyItem = fullData.find(
      (item) => item.label.toLowerCase() === 'yearly'
    );
    const yearlyValue = yearlyItem?.value || 0;
    const minThreshold = yearlyValue * 0.1;

    const option = {
      graphic: showComparison
        ? [
            {
              type: 'text',
              left: '26%',
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
      // graphic: [
      //   {
      //     type: 'text',
      //     left: showComparison ? '28%' : '50%',
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
      title: {
        show: true,
        text: 'Cost Estimation',
        left: 'left',
        textStyle: {
          fontSize: isSmallScreen ? 14 : 16,
          fontFamily: 'Inter',
          color: theme?.palette?.main_layout?.primary_text || '#fff',
        },
      },
      grid: {
        top: gridTop,
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          show: false,
          fontSize: 12,
          color: theme?.palette?.graph?.xis || '#ccc',
        },
        axisLine: {
          lineStyle: {
            color: theme?.palette?.graph?.line_color || '#444',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme?.palette?.graph?.line_color,
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: selectedCurrency,
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
          fontSize: 12,
          color: theme?.palette?.graph?.xis,
          padding: [0, 30, 8, 0],
        },
        axisLabel: {
          fontSize: 12,
          color: theme?.palette?.graph?.xis,
        },
        splitLine: { show: false },
      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      series: [
        {
          name: 'Cost Estimation',
          type: 'bar',
          data: fullData.map((d) => ({
            value: d.value,
            name: d.label,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: d.isUpdated
                  ? [
                      { offset: 0, color: '#25D9A3' },
                      { offset: 1, color: '#077C56' },
                    ]
                  : [
                      { offset: 0, color: '#2268D1' },
                      { offset: 1, color: '#11356B' },
                    ],
              },
            },
          })),
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            formatter: (params) =>
              `{period|${params.name}}\n\n{value|${params.value}}`,
            rich: {
              value: {
                fontSize: 12,
                fontWeight: 'semi-bold',
                color: theme?.palette?.graph?.title || '#fff',
              },
              period: {
                fontSize: 10,
                fontWeight: '500',
                color: theme?.palette?.graph?.xis || '#aaa',
              },
            },
          },
          z: 2,
        },
        {
          type: 'custom',
          renderItem: function (params, api) {
            const value = api.value(1);
            if (value < minThreshold) return;
            const x = api.coord([api.value(0), 0])[0];
            const y = api.coord([0, api.value(1)])[1];
            const barWidth = api.size([1, 0])[0] * 0.2;
            const height = api.size([0, api.value(1)])[1];
            const shadowWidth = barWidth * 0.7;
            const cutOffset = 8;
            const shadowX = x + barWidth - shadowWidth * 0.04;

            return {
              type: 'polygon',
              shape: {
                points: [
                  [shadowX, y],
                  [shadowX, y + height],
                  [shadowX + shadowWidth, y + height],
                  [shadowX + shadowWidth, y + cutOffset],
                ],
              },
              style: {
                fill: api.value(2) === 'updated' ? '#0b6048' : '#3930a8',
              },
              z: 1,
            };
          },

          data: fullData.map((d, i) => [
            i,
            d.value,
            d.isUpdated ? 'updated' : 'base',
          ]),
          encode: { x: 0, y: 1 },
        },
      ],
    };

    chart.setOption(option, true);
  }, [currentData, updatedData, showComparison, selectedCurrency, theme]);

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

export default CostEstimation;
