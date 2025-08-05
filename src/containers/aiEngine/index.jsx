import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Col, Row, Select, Spin } from 'antd';
import CustomCard from '../../components/customCard';
import CustomSelector from '../../components/customSelector';
import KpiSelector from '../dashboardModule/dashboard/kpiSelector';
import DeviceSpecificConsuptionChart from '../../components/deviceSpecificPConsumption';
import MonthlyCostInternalChart from '../../components/montlyCostInternalChart';
import axios from 'axios';
import { baseUrl } from '../../utils/axios';
import MonthlyCostInternalChart2 from '../../components/montlyCostInternalChart2';
import Chatbot from '../chatBot/chatBot';
import DefaultSelector from '../../components/defaultSelector';
import CustomLineAndBarchartGraph from '../../components/customLineAndBarchartGraph';
import CustomBarChartWithLabels from '../../components/customBarchartWithLabel';
import CustomScatterChart from '../../components/customScatteredChart';
import PredictionBarChart from './components/graphs/energyUtilization';
import GraphWrapper from '../../components/ui/graphWrapper';
import axiosInstance from '../../utils/axios/axiosInstance';
import MonthlyPowerConsumption from './components/graphs/moonthlyPowerConsumption';
import MonthlyEnergyEfficiency from './components/graphs/moonthlyEnergyEfficiency';
import YearlyPrediction from './components/graphs/yearlyPrediction';
import Co2Emissions from './components/graphs/co2Emissions';
import { fetchSiteNames } from '../../services/services';
import { fetchPowerOutputPrediction } from '../../services/aiEngineServices/aiEngineServices';
const AiEngin = () => {
  const theme = useTheme();
  const access_token = localStorage.getItem('access_token');

  const [siteId, setSiteId] = useState(null);
  const [data, setData] = useState([]);
  // const [siteName, setSiteName] = useState(null);
  const [sites, setSites] = useState();
  const { Option } = Select;

  const selectedSite = sites?.filter((site) => site.value === siteId)[0];

  useEffect(() => {
    if (sites?.length > 0) {
      setSiteId(sites && sites[0]?.value);
      // setSiteName(sites && sites[0]?.label);
    }
  }, [sites]);

  const xData = [
    '00:00',
    '01:15',
    '02:30',
    '03:45',
    '05:00',
    '06:15',
    '07:30',
    '08:45',
    '10:00',
    '11:15',
    '12:30',
    '13:45',
    '15:00',
    '16:15',
    '17:30',
    '18:45',
    '20:00',
    '21:15',
    '22:30',
    '23:45',
  ];

  const yData = [
    300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 800, 390, 400, 500, 600,
    750, 800, 1100, 600, 400,
  ];

  const visualPieces = [
    { lte: 6, color: theme?.palette?.main_layout?.secondary_text },
    { gt: 6, lte: 8, color: 'red' },
    { gt: 8, lte: 14, color: theme?.palette?.main_layout?.secondary_text },
    { gt: 14, lte: 17, color: 'red' },
    { gt: 17, color: theme?.palette?.main_layout?.secondary_text },
  ];
  // const visualPieces = [
  //   { lte: 6, color: 'green' },
  //   { gt: 6, lte: 8, color: 'red' },
  //   { gt: 8, lte: 14, color: 'green' },
  //   { gt: 14, lte: 17, color: 'red' },
  //   { gt: 17, color: 'green' },
  // ];

  const markAreas = [
    [{ name: 'Morning Peak', xAxis: '07:30' }, { xAxis: '10:00' }],
    [{ name: 'Evening Peak', xAxis: '17:30' }, { xAxis: '21:15' }],
  ];

  const anomalies = [
    { value: 800, xAxis: 10, yAxis: 800 },
    { value: 1100, xAxis: 17, yAxis: 1100 },
  ];

  // const legendData = [
  //   'Energy Efficiency Ratio (EER)',
  //   'Power Usage Effectiveness (PUE)',
  //   'Carbon Usage Effectiveness (CUE)',
  // ];

  // --------------------
  const siteNames = async () => {
    try {
      // const sitesss = await axios.get(baseUrl + '/sites/get_site_names', {
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // });
      const sitesss = await fetchSiteNames();
      // console.log('sites in AI Engine', sitesss);

      setSites(
        sitesss?.map((item) => {
          return {
            label: item?.site_name,
            value: item?.id,
          };
        })
      );
    } catch (error) {
      console.log('tumhara error', error);
    }
  };

  useEffect(() => {
    siteNames();
  }, []);
  const handleChange = (value, option) => {
    setSiteId(value);
    // setSiteName(option.children);
  };

  // const powerOutPutPrediction = async () => {

  //   if (siteId) {
  //     const res = await fetchPowerOutputPrediction(siteId);
  //     // const res = await axiosInstance.get(
  //     //   `/sites/sites/power_output_prediction/${siteId}`
  //     // );
  //     if (res.status === 200) {
  //       setData(res?.data?.data);
  //     }
  //     console.log('power_output_prediction:', res);
  //   }
  // };
  const powerOutPutPrediction = async () => {
    if (!siteId) return;

    try {
      const res = await fetchPowerOutputPrediction(siteId);
      if (res.status === 200) {
        setData(res?.data?.data);
      }
      console.log('power_output_prediction:', res?.data?.data);
    } catch (error) {
      console.error('Error fetching power output prediction:', error);
    }
  };
  // const comparisons = async () => {
  //   if (siteId) {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(
  //         baseUrl + `/sites/sites/power_comparison_and_prediction/${siteId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         }
  //       );
  //       if (res.status === 200) {
  //         console.log('comparison data:', res);
  //         setLoading(false);
  //         setGraphData(res?.data?.data);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   }
  // };

  useEffect(() => {
    powerOutPutPrediction();
    // comparisons();
  }, [siteId]);

  return (
    <div style={{ padding: '0px 10px 10px 10px' }}>
      <div
        style={{
          // padding: "10px 10px 0px 10px",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          marginTop: '10px',
        }}
      >
        <div
          style={{
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          {selectedSite?.label}
        </div>

        <DefaultSelector
          options={sites}
          onChange={handleChange}
          value={selectedSite?.label}
          allowClear={false}
        />
      </div>
      <Row gutter={[10, 10]}>
        <Col xs={24} xl={12}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              borderRadius: '7px',
              position: 'relative',
              height: '351px',
            }}
          >
            <MonthlyPowerConsumption siteId={siteId} />
          </CustomCard>
        </Col>
        <Col xs={24} xl={12}>
          {/* <Spin spinning={loading}> */}
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              borderRadius: '7px',
              position: 'relative',
            }}
          >
            {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: theme?.palette?.graph?.title,
                    marginBottom: "0px",
                    marginTop: "0px",
                    fontFamily: "inter",
                  }}
                >
                  
                </p>
              </div> */}
            <MonthlyEnergyEfficiency siteId={siteId} />
          </CustomCard>
          {/* </Spin> */}
        </Col>
        {/* <Col xs={24}>
            <CustomCard
              style={{
                border: "1px solid #36424E",
                backgroundColor: "#050C17",
                borderRadius: "7px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: "#E4E5E8",
                    marginBottom: "0px",
                    marginTop: "0px",
                    fontFamily: "inter",
                  }}
                >
                  Energy Utilization/Month
                </p>
              </div>

              <MonthlyCostInternalChart2 dashboard="true" />
            </CustomCard>
          </Col> */}

        <Col xs={24} xl={12}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              borderRadius: '7px',
              position: 'relative',
            }}
          >
            <CustomLineAndBarchartGraph
              title="Distribution of Daily Power Consumption with AI-Driven Anomaly Detection"
              subtext="Anomalies Highlighted"
              xData={xData}
              yData={yData}
              visualPieces={visualPieces}
              markAreas={markAreas}
              anomalies={anomalies}
            />
          </CustomCard>
        </Col>
        <Col xs={12}>
          {/* <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              borderRadius: '7px',
              position: 'relative',
            }}
          >
            <CustomScatterChart
              chartTitle="Emissions by Site and Year"
              data={scatterChartData}
            />
          </CustomCard> */}
          <Co2Emissions siteID={siteId} />
        </Col>
        <Col xs={24}>
          <YearlyPrediction siteID={siteId} />
        </Col>
      </Row>
      {/* <Row gutter={[10, 10]}></Row> */}
      <Chatbot />
    </div>
  );
};

export default AiEngin;
