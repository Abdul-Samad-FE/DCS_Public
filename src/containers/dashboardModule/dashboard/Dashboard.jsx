import React, { useState, useEffect, useContext } from 'react';

import HardwareLifeCycleGraph from '../../../components/hardwareLifeCycleGraph.jsx';

import './dashboard.css';
import { baseUrl } from '../../../utils/axios/index.js';
import axios from 'axios';
import { useSelector } from 'react-redux';
// ================
import { Row, Col, Select, Spin, Button } from 'antd';
import car from '../../../resources/images/car.png';
import airplane from '../../../resources/images/airplane.png';

import CustomCard from '../../../components/customCard.jsx';
import KpisChart from '../../../components/kpisChart.jsx';
import SummaryMetricsBarChart from '../../../components/summaryMetrics.jsx';
import ApcChart from '../../../components/apcChart.jsx';
import AnomaliesChart from '../../../components/anomaliesDetectionChart.jsx';
import DeviceSpecificConsuptionChart from '../../../components/deviceSpecificPConsumption.jsx';
import DetailCards from './detailCards.jsx';
import ThreshholdAlerts from '../../../components/threshholdAlerts.jsx';
import useColumnSearchProps from '../../../hooks/useColumnSearchProps.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import KpiSelector from './kpiSelector.jsx';
import { fetchPiChartData } from '../../../store/features/dashboardModule/actions/piChartAction.js';
import { fetchKpiChartData } from '../../../store/features/dashboardModule/actions/kpiChartAction.js';
import { fetchDeviceSpecificChartData } from '../../../store/features/dashboardModule/actions/deviceSpecificChartAction.js';
import { fetchMetricsChartData } from '../../../store/features/dashboardModule/actions/metricsChartAction.js';
import { fetchTrafficThroughputChartData } from '../../../store/features/dashboardModule/actions/trafficThroughputAction.js';
import { fetchTopDevicesPowerCostData } from '../../../store/features/dashboardModule/actions/topDevicesPowerCostAction.js';
import { fetchTopDevicesClickData } from '../../../store/features/dashboardModule/actions/topDevicesClickAction.js';
import { fetchDevicesData } from '../../../store/features/dashboardModule/actions/devicesAction.js';
import { fetchHmRackDetail } from '../../../store/features/dashboardModule/actions/hmRackClickAction.js';
import { setSelectedSiteId } from '../../../store/features/dashboardModule/slices/siteIdSlice.js';
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice.js';
import { fetchRacksAsync } from '../../../store/features/uamModule/racks/slices/racksSlice.js';
import {
  fetchCarbonEmmision,
  fetchElectricityMapPiData,
} from '../../../store/features/dashboardModule/actions/electricityMapPi.js';
import { set } from 'react-hook-form';
import CustomProgress from '../../../components/customProgress.jsx';
import EnergyEfficiencyOverall from '../../../components/energyEfficiencyOverall.jsx';
import { Tooltip as AntdTooltip } from 'antd';
import DevicesBarChart from '../../../components/devicesBarChart.jsx';
import PcrGraph from '../../../components/pcrGraph.jsx';
import SiteEnergyConsumptionBarChart from '../../../components/siteEnergyConsumptionBarChart.jsx';
import CustomDropdown from '../../../components/customDropDown.jsx';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import EChartsGauge from '../../uamModule/inventory/guage.jsx';
import { useTheme } from '@mui/material/styles';
import Selector from '../../../components/selector.jsx';
import DefaultSelector from '../../../components/defaultSelector.jsx';
import CustomLineGraph from '../../../components/inventoryDashboard/lineGraph.jsx';
import CustomModal from '../../../components/customModal.jsx';
import ScoringCards from '../../../components/scoringCards.jsx';
import Top5DevicesTable from './components/top5Devices.jsx';
import HeatMapRacks from './components/heatMapRacks.jsx';
import HardwareLifeCycle from './components/hardwareLifeCycle.jsx';
import EnergyEfficiencyRatio from './components/energyEfficiencyRatio.jsx';
import SiteEnergyEfficiencyRatio from './components/siteEnergyEfficiencyRatio.jsx';
import Co2EmissionCard from './components/co2EmissionCard.jsx';
import Dailyco from '../../../components/dailyco.jsx';
import electric from '../../../resources/svgs/electric.png';
import HumidityAndTemperature from './components/humidityAndTemperature.jsx';
import EnergyEfficiencyTrend from './components/energyEfficiencyTrend.jsx';
import { fetchDevicesCarbonEmission } from './services/services.js';
import axiosInstance from '../../../utils/axios/axiosInstance.js';
import PowerConsumptionAnalysis from './components/powerConsumptionAnalysis.jsx';
import DeviceLevelCO2 from './components/deviceLevelCO2.jsx';
import DeviceLevelPCR from './components/deviceLevelPCR.jsx';
import ScoreCardModels from './components/scorecardPerModel.jsx';
import styled from 'styled-components';
import { AppContext } from '../../../context/appContext.js';
import { fetchSiteNames } from '../../../services/services.js';
import {
  fetchAverageEnergyConsumptionMetrics,
  fetchLast24HoursEnergyMetrics,
  fetchLast7DaysEnergyMetrics,
  fetchPcrData,
  fetchPueDeviceData,
  fetchThreshholdData,
} from '../../../services/dashboardServices/dashboardServices.js';
import CustomSpin from '../../../components/CustomSpin.jsx';

// ========================
const apcChartData = [
  // { value: 1048, name: "RUH" },
  { value: 20, name: 'Wind', itemStyle: { color: '#5615A2' } },
  // { value: 735, name: "Direct" },
  { value: 20, name: 'Natural Gas', itemStyle: { color: '#C89902' } },
  { value: 10, name: 'Coal', itemStyle: { color: '#A02823' } },
  { value: 50, name: 'Solar', itemStyle: { color: '#01A5DE' } },
];
function Dashboard() {
  const theme = useTheme();
  const getColumnSearchProps = useColumnSearchProps();
  const { contextSite, setContextSite } = useContext(AppContext);
  const [siteId, setSiteId] = useState(null);
  const [siteName, setSiteName] = useState(null);
  const [threshholdDeviceName, setThreshholdDeviceName] = useState(null);
  const [pcrDeviceName, setPcrDeviceName] = useState(null);
  const [dataTrafficDeviceName, setDataTrafficDeviceName] = useState(null);

  const [threshholdDeviceId, setThreshholdDeviceId] = useState(null);
  const [pueDeviceName, setPueDeviceName] = useState(null);
  const [pueDeviceId, setPueDeviceId] = useState(null);
  const [pcrDeviceId, setPcrDeviceId] = useState(null);
  const [dataTrafficDeviceId, setDataTrafficDeviceId] = useState(null);
  const [threshholdOption, setThreshholdOption] = useState('24 hours');
  const [pcrOption, setPcrOption] = useState('24 hours');

  const [pueOption, setPueOption] = useState('24 hours');
  const [pueOption2, setPueOption2] = useState('24 hours');
  const [sites, setSites] = useState();
  const [threshholdData, setThreshholdData] = useState();
  const [pcrData, setPcrData] = useState();

  const [pueData, setPueData] = useState();
  const [pueData2, setPueData2] = useState();
  const [loading, setLoading] = useState(false);
  const [pueLoading, setPueLoading] = useState(false);
  const [loadingPueD, setLoadingPueD] = useState(false);
  const [loadingEerD, setLoadingEerD] = useState(false);
  const [loadingPcr, setLoadingPcr] = useState(false);
  const [loadingCarbonE, setLoadingCarbonE] = useState(false);
  const [siteEnergyCosumption, setSiteEnergyCosumption] = useState();
  const [siteEnergyCosumptionLast24Hours, setSiteEnergyCosumptionLast24Hours] =
    useState();
  const [openModalScore, setOpenModalScore] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const access_token = localStorage.getItem('access_token');

  // const racks = useSelector((state) => state.racks?.racks);
  const kpiOptions = [
    {
      value: '24 hours',
      label: '24 hours',
    },
    {
      value: '7 Days',
      label: '7 Days',
    },

    {
      value: 'Last Month',
      label: 'Last Month',
    },
    {
      value: 'Current Month',
      label: 'Current Month',
    },
    { value: 'First Quarter', label: 'First Quarter' },
    { value: 'Second Quarter', label: 'Second Quarter' },
    { value: 'Third Quarter', label: 'Third Quarter' },
    {
      value: 'Last 3 Months',
      label: 'Last 3 Months',
    },
    {
      value: 'Last 6 Months',
      label: 'Last 6 Months',
    },
    {
      value: 'Last 9 Months',
      label: 'Last 9 Months',
    },
    {
      value: 'Last Year',
      label: 'Last Year',
    },
    {
      value: 'Current Year',
      label: 'Current Year',
    },
  ];

  const items = [
    {
      key: '1',
      label: <a href="#eer">Energy Efficiency Ratio</a>,
    },
    {
      key: '2',
      label: <a href="#pue">Power Usage Effectiveness</a>,
      // icon: <SmileOutlined />,
    },
    {
      key: '3',
      label: <a href="#em">Energy Mix</a>,
    },
    {
      key: '4',
      label: <a href="#eerdl">EER Device Level</a>,
    },
    {
      key: '5',
      label: <a href="#puedl">PUE Device Level</a>,
    },
    {
      key: '6',
      label: <a href="#pcr">Power Consumption Ratio</a>,
    },
    {
      key: '7',
      label: <a href="#c_emission">Device Level Carbon Emission</a>,
    },
    {
      key: '8',
      label: (
        <a href="#dataTraffic">Energy Efficiency Trends Across Data Traffic</a>
      ),
    },
    {
      key: '9',
      label: <a href="#dspca">Device-Specific Power Consumption Analysis</a>,
    },
    {
      key: '10',
      label: (
        <a href="#sitesecdw">Overall Site Energy Consumption By Day of Week</a>
      ),
    },
    {
      key: '11',
      label: (
        <a href="#sitesechd">Overall Site Energy Consumption By Hour of Day</a>
      ),
    },
    {
      key: '12',
      label: <a href="#powercost">Top 5 Devices Power Utilization and Cost </a>,
    },
    {
      key: '13',
      label: <a href="#sm">Summary Metrics</a>,
    },
    {
      key: '14',
      label: <a href="#hmr">Heat Map of Racks</a>,
    },
    {
      key: '15',
      label: <a href="#hl">Hardware Lifecycle</a>,
    },
    {
      key: '14',
      label: <a href="#map">Site Map</a>,
    },
  ];

  // const handleChange = (value, option) => {
  //   // setSiteName(option?.children);
  //   // setSiteId(value);
  //   setContextSite()
  // };

  // const handleChange = (value) => {
  //   const selectedSite = sites.find((site) => site.value === value);
  //   if (selectedSite) {
  //     setSiteId(selectedSite.value);
  //     setSiteName(selectedSite.label);
  //     localStorage.setItem('selectedSiteId', selectedSite.value);
  //     localStorage.setItem('selectedSiteName', selectedSite.label);
  //   }
  // };
  const handleChange = (value) => {
    const selectedSite = sites.find((site) => site.value === value);
    if (selectedSite) {
      setContextSite({
        siteId: selectedSite.value,
        siteName: selectedSite.label,
      });
    }
  };

  const siteNames = async () => {
    try {
      const sitesss = await fetchSiteNames();
      setSites(
        sitesss?.map((item) => {
          return {
            label: item?.site_name,
            value: item?.id,
          };
        })
      );

      // console.log('sites in dashbaord', sitesss);
    } catch (error) {
      console.log(' error', error);
    }
  };

  useEffect(() => {
    siteNames();
    // localStorage.setItem('selectedModule', 'Dashboard');
    // dispatch(fetchRacksAsync());
  }, []);

  // useEffect(() => {
  //   if (sites?.length > 0) {
  //     setSiteId(sites && sites[0]?.value);
  //     setSiteName(sites && sites[0]?.label);
  //   }
  // }, [sites]);
  // useEffect(() => {
  //   if (sites?.length > 0) {
  //     setContextSite({ siteId: sites[0].value, siteName: sites[0].label });
  //   }
  // }, [sites]);
  useEffect(() => {
    if (sites?.length > 0) {
      if (contextSite.siteId && contextSite.siteName) {
        setSiteId(contextSite.siteId);
        setSiteName(contextSite.siteName);
      } else {
        const defaultSite = sites[0];
        setContextSite({
          siteId: defaultSite.value,
          siteName: defaultSite.label,
        });
        setSiteId(defaultSite.value);
        setSiteName(defaultSite.label);
      }
    }
  }, [sites, contextSite]);
  // useEffect(() => {
  //   const storedName = localStorage.getItem('selectedSiteName');
  //   const storedId = localStorage.getItem('selectedSiteId');
  //   console.log('site from local::::', storedName);

  //   if (sites?.length > 0) {
  //     if (storedName && storedId) {
  //       setSiteName(storedName);
  //       setSiteId(storedId);
  //     } else {
  //       setSiteName(sites[0].label);
  //       setSiteId(sites[0].value);
  //     }
  //   }
  // }, [sites]);

  useEffect(() => {
    if (siteId) {
      // fetchCarbonEmissionData();
      dispatch(fetchDevicesData(siteId, access_token));
      dispatch(fetchMetricsChartData(siteId, access_token));
      dispatch(fetchPiChartData(siteId, access_token));
      dispatch(fetchDeviceSpecificChartData(siteId, access_token));
      dispatch(fetchRacksAsync(access_token));
    }
  }, [siteId, access_token]);
  const devices = useSelector((state) => state.devices?.data?.data);

  const fetchPue = async () => {
    setPueLoading(true);

    try {
      const data = await fetchAverageEnergyConsumptionMetrics(
        siteId,
        pueOption
      );
      if (data) {
        setPueData2(data);
      } else {
        setPueData2([]);
      }
    } catch (error) {
      setPueData2([]);
      console.error(
        'Failed to fetch average energy consumption metrics:',
        error
      );
    } finally {
      setPueLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchPue();
    }
  }, [siteId, pueOption]);

  const fetchSiteEnergyConsumptionLast7Days = async () => {
    setLoading(true);
    try {
      const data = await fetchLast7DaysEnergyMetrics(siteId);
      if (data) {
        setSiteEnergyCosumption(data);
      } else {
        setSiteEnergyCosumption([]);
      }
    } catch (error) {
      setSiteEnergyCosumption([]);
      console.error('Failed to fetch last 7 days energy metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteEnergyConsumptionLast24Hours = async () => {
    setLoading(true);

    try {
      const data = await fetchLast24HoursEnergyMetrics(siteId);
      if (data) {
        setSiteEnergyCosumptionLast24Hours(data);
      } else {
        setSiteEnergyCosumptionLast24Hours([]);
      }
    } catch (error) {
      setSiteEnergyCosumptionLast24Hours([]);
      console.error('Failed to fetch last 24 hours energy metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (siteId) {
      fetchSiteEnergyConsumptionLast7Days();
      fetchSiteEnergyConsumptionLast24Hours();
    }
  }, [siteId]);

  const updatedDevice = devices?.map((item) => {
    return {
      label: item?.device_name,
      value: item?.id,
    };
  });
  // const handleDeviceClick = (record) => {
  //   navigate('inventorydetail', {
  //     state: {
  //       ip: record.ip_address,
  //     },
  //   });
  // };
  useEffect(() => {
    if (devices) {
      setPueDeviceId(devices[2]?.id);
      setPueDeviceName(devices[2]?.device_name);
      setPcrDeviceId(devices[2]?.id);
      setPcrDeviceName(devices[2]?.device_name);
      setDataTrafficDeviceName(devices[2]?.device_name);
      setDataTrafficDeviceId(devices[2]?.id);
      setThreshholdDeviceId(devices[2]?.id);
      setThreshholdDeviceName(devices[2]?.device_name);
    }
  }, [devices]);

  const getPueDevice = async () => {
    try {
      setLoadingPueD(true);
      const response = await fetchPueDeviceData(
        siteId,
        pueDeviceId,
        pueOption2
      );
      if (response?.status === 200) {
        setLoadingPueD(false);
        setPueData(response?.data?.data);
      } else {
        setPueData([]);
      }
    } catch (error) {
      setLoadingPueD(false);
      setPueData([]);

      console.error('Failed to fetch carbon emission data:', error);
    }
  };
  useEffect(() => {
    if (siteId && pueDeviceId) {
      getPueDevice();
    }
  }, [pueDeviceId, siteId, pueOption2]);

  const getPcr = async () => {
    setLoadingPcr(true);

    try {
      const response = await fetchPcrData(siteId, pcrOption);
      // axiosInstance.get(
      //   baseUrl + `/sites/sites/all_devices_pcr/${siteId}?duration=${pcrOption}`
      // );

      if (response?.status === 200) {
        // console.log('data:::::', response);

        setLoadingPcr(false);
        setPcrData(response?.data?.data);
      } else {
        setLoadingPcr(false);
        setPcrData([]);
      }
    } catch (error) {
      setLoadingPcr(false);
      setPcrData([]);
      console.error('Failed to fetch carbon emission data:', error);
    }
  };
  useEffect(() => {
    if (siteId) {
      getPcr();
    }
  }, [pcrOption, siteId, pcrDeviceName]);
  // ============= threshhold =========
  const getThreshhold = async () => {
    setLoadingEerD(true);

    try {
      const response = await fetchThreshholdData(
        siteId,
        threshholdDeviceId,
        threshholdOption
      );
      if (response?.status === 200) {
        setLoadingEerD(false);
        setThreshholdData(response?.data?.data);
      } else {
        setThreshholdData([]);
      }
      // console.log('threshhold response', response);
    } catch (error) {
      setLoadingEerD(false);
      setThreshholdData([]);
      // console.error('Failed rrrrrrr:', error);
    }
  };
  useEffect(() => {
    if (siteId && threshholdDeviceId) {
      getThreshhold();
    }
  }, [threshholdDeviceId, siteId, threshholdOption]);
  // ==============

  // const electricityMapPiData = useSelector(
  //   (state) => state.electricityMapPiData
  // );

  const colorMap = {
    nuclear: '#1a78b8',
    geothermal: '#de7818',
    biomass: '#DAF7A6',
    coal: '#3d0f0c',
    wind: '#5615A2',
    solar: '#111933',
    hydro: '#0a5dab',
    gas: '#827675',
    oil: '#808080',
    unknown: '#7D3C98',
    battery_discharge: '#28B463',
  };
  const transformData = (data) => {
    if (!data) {
      return []; // Return an empty array if data is not available
    }
    return Object.entries(data).map(([key, value]) => ({
      value,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
      itemStyle: { color: colorMap[key] },
    }));
  };

  const detail = (id, duration, device_id) => {
    dispatch(setSelectedSiteId(siteId));
    navigate(`graph-detail/${id}`, {
      state: {
        siteId: siteId,
        time: duration,
        device_id: device_id,
      },
    });
  };

  const StyledButton = styled.button`
    background: none;
    border: none;
    color: ${theme?.palette?.main_layout?.secondary_text};
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    width: 100px;
    font-weight: 600;
    font-size: 0.8rem;
    padding: 10px 15px;
    border-radius: 9999px;
    transition: all 0.2s ease;
    margin-left: 10px;

    &:hover {
      background: ${theme?.name?.includes('Purple')
        ? 'linear-gradient(to right, #791b9c, #5454be)'
        : theme?.palette?.main_layout?.secondary_text};
      color: ${theme?.name?.includes('Purple')
        ? `${theme?.palette?.default_button?.primary_text}`
        : `${theme?.palette?.main_layout?.primary_text}`};
      outline: none;
    }
  `;

  const handleChangeThreshholddevice = (value, option) => {
    // console.log('devicesss', option);

    setThreshholdDeviceId(option?.value);
    setThreshholdDeviceName(option?.children);
  };
  const handleChangePueDevice = (value, option) => {
    setPueDeviceId(option?.value);
    setPueDeviceName(option?.children);
  };

  const handleChangePcrDevice = (value, option) => {
    setPcrDeviceId(option?.value);
    setPcrDeviceName(option?.children);
  };
  console.log('siteName:::::::::', siteName);

  return (
    <>
      <div style={{ padding: '0px 5px 0px 5px' }}>
        <div
          style={{
            padding: '10px 10px 0px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            marginTop: '10px',
          }}
        >
          <div style={{ color: theme?.palette?.default_select?.color }}>
            {siteName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <CustomDropdown
              dashboard="true"
              icon={<DownOutlined />}
              items={items}
              gradient="true"
            >
              Jump to Section
            </CustomDropdown>

            <DefaultSelector
              options={sites}
              onChange={handleChange}
              value={siteName}
              disabled={
                loadingCarbonE ||
                loadingEerD ||
                loadingPcr ||
                loadingPueD ||
                pueLoading
                  ? true
                  : false
              }
            />
          </div>
        </div>
        <DetailCards siteId={siteId} />

        <Row>
          <Col id="eer" xs={24} lg={24} xl={14} style={{ padding: '10px' }}>
            <SiteEnergyEfficiencyRatio
              theme={theme}
              siteName={siteName}
              kpiOptions={kpiOptions}
              siteId={siteId}
            />
          </Col>
          <Col id="pue" xs={24} lg={24} xl={10} style={{ padding: '10px' }}>
            <CustomSpin spinning={pueLoading}>
              <CustomCard
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  // backgroundColor: "#050C17",
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '7px',
                  // position: "relative",
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    // justifyContent: 'space-between',
                    flexDirection: 'column',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '2px',
                      marginTop: '0px',
                      fontSize: '16px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                    }}
                  >
                    <span
                      style={{
                        color: theme?.palette?.main_layout?.secondary_text,
                      }}
                    >
                      {siteName}{' '}
                    </span>{' '}
                    {pueOption} Energy & Cost Summary
                  </p>
                  {/* <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  > */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                    }}
                  >
                    <KpiSelector
                      options={kpiOptions}
                      setPueOption={setPueOption}
                      value={pueOption}
                      pueDash="true"
                    />
                    <StyledButton
                      // className="button button-animation"
                      // style={{
                      //   background: 'none',
                      //   width: '100px',
                      //   padding: '10px 15px',
                      //   border: 'none',
                      //   color: theme?.palette?.main_layout?.secondary_text,
                      //   cursor: 'pointer',
                      //   fontFamily: 'inter',
                      // }}
                      onClick={() => detail('3', pueOption)}
                    >
                      See Detail
                    </StyledButton>
                  </div>
                </div>

                <AntdTooltip
                  title={
                    <div>
                      {/* Hide by Saman Query */}
                      {/* <div style={{ borderBottom: '1px solid #36424E' }}>
                        <p
                          style={{
                            color: theme?.palette?.graph?.title,
                          }}
                        >
                          Site Name:{' '}
                          <span
                            style={{
                              color: `${theme?.palette?.main_layout?.secondary_text}`,
                              // color: '#2268D1',
                            }}
                          >
                            {siteName}
                          </span>
                        </p>
                        <p
                          style={{
                            color: theme?.palette?.graph?.title,
                          }}
                        >
                          Energy & Cost Summery:
                          <br />
                          {pueData2?.power_efficiency} Power Usage
                          Effectiveness:{' '}
                          <span
                            style={{
                              // dynamic color from the theme
                              color: `${theme?.palette?.main_layout?.secondary_text}`,
                              // dynamic color based on values
                              //   color:
                              //     pueData2?.power_efficiency >= 0.5 &&
                              //     pueData2?.power_efficiency <= 1
                              //       ? 'green'
                              //       : pueData2?.power_efficiency > 1 &&
                              //           pueData2?.power_efficiency <= 1.5
                              //         ? '#0490E7'
                              //         : 'red',
                            }}
                          >
                            (
                            {pueData2?.power_efficiency >= 0.5 &&
                            pueData2?.power_efficiency <= 1
                              ? 'efficient'
                              : pueData2?.power_efficiency > 1 &&
                                  pueData2?.power_efficiency <= 1.5
                                ? 'moderately efficient'
                                : 'inefficient'}
                            )
                          </span>
                        </p>
                      </div> */}
                      <span
                        style={{
                          color: theme?.palette?.graph?.title,
                          marginTop: '10px',
                          fontSize: '13px',
                        }}
                      >
                        total_cost (AED) = Total Power Input(kWh) * Energy Cost
                        per kWh (~0.32AED/kWh for UAE region)
                      </span>
                      {/* Effeciency Status for moderate, inEfficinet and Efficent */}
                      {/* <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          // alignItems: "center",
                          fontSize: '13px',

                          color: theme?.palette?.graph?.title,
                        }}
                      >
                        <div>
                          <p>
                            0.5 - 1 (
                            <span style={{ color: '#42AE46' }}>Efficient</span>{' '}
                            )
                          </p>
                          <p>
                            1.5 - above ({' '}
                            <span style={{ color: '#fb0200' }}>
                              Inefficient
                            </span>{' '}
                            )
                          </p>
                        </div>
                        <p>
                          1 - 1.5 ({' '}
                          <span
                            style={{
                              color: `${theme?.name?.includes('Purple') ? theme?.palette?.main_layout?.secondary_text : '#0490E7'}`,
                            }}
                          >
                            {' '}
                            Modeately Efficient{' '}
                          </span>{' '}
                          )
                        </p>
                      </div> */}
                    </div>
                  }
                  overlayInnerStyle={{
                    backgroundColor: theme?.palette?.graph?.toolTip_bg,
                    border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
                    width: '360px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      marginBottom: '0',
                      cursor: 'default',
                      marginTop: '14px',
                    }}
                  >
                    <SummaryMetricsBarChart
                      pueData={pueData2}
                      pue="true"
                      dashboard="true"
                    />

                    {/* <CustomProgress
                    pueValue={pueData2?.power_efficiency}
                    pue="true"
                    type="circle"
                    strokeWidth="8"
                    size={[188]}
                    style={{}}
                  /> */}
                    {/* <EChartsGauge
                    // cpu="true"
                    pue="true"
                    data={pueData2?.power_efficiency}
                  /> */}
                  </div>
                </AntdTooltip>

                {/* <AntdTooltip
                  title={
                    <div>
                      <div
                        style={{
                          color: theme?.palette?.graph?.title,
                        }}
                      >
                        The Power Usage Effectiveness (PUE) measures overall
                        energy efficiency in data centers, calculated as the
                        ratio of total power input to useful power output.
                        <span
                          style={{
                            color: `${theme?.palette?.main_layout?.secondary_text}`,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            navigate('/main_layout/about', {
                              state: {
                                title: 'pue',
                              },
                            })
                          }
                        >
                          see details
                        </span>
                      </div>
                    </div>
                  }
                  overlayInnerStyle={{
                    backgroundColor: theme?.palette?.graph?.toolTip_bg,
                    border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
                    width: '300px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginBottom: '-30px',
                      cursor: 'default',
                    }}
                  >
                    <p
                      style={{
                        width: '13px',
                        height: '13px',
                        background: theme?.palette?.graph?.graph_area?.line,
                        borderRadius: '100%',
                      }}
                    ></p>
                    <p
                      style={{
                        color: theme?.palette?.graph?.title,
                        fontSize: '13px',
                      }}
                    >
                      Power Usage Effectiveness
                    </p>
                  </div>
                </AntdTooltip> */}
              </CustomCard>
            </CustomSpin>
          </Col>
        </Row>

        <Row>
          <Col xs={24} style={{ padding: '10px' }}>
            <Co2EmissionCard kpiOptions={kpiOptions} siteId={siteId} />
          </Col>
        </Row>
        <Row>
          <Col id="eerdl" xs={24} lg={24} xl={14} style={{ padding: '10px' }}>
            <EnergyEfficiencyRatio
              loading={loadingEerD}
              kpiOptions={kpiOptions}
              setThreshholdOption={setThreshholdOption}
              threshholdDeviceName={threshholdDeviceName}
              threshholdOption={threshholdOption}
              handleChangeThreshholddevice={handleChangeThreshholddevice}
              threshholdData={threshholdData}
              siteId={siteId}
              threshholdDeviceId={threshholdDeviceId}
              siteName={siteName}
            />
          </Col>
          <Col id="puedl" xs={24} xl={10} style={{ padding: '10px' }}>
            <CustomSpin spinning={loadingPueD}>
              <CustomCard
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '7px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    // justifyContent: 'space-between',
                    flexDirection: 'column',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '5px',
                      marginTop: '0px',
                      fontSize: '16px',
                      fontWeight: 500,
                      fontFamily: 'inter',
                    }}
                  >
                    <span
                      style={{
                        color: theme?.palette?.main_layout?.secondary_text,
                      }}
                    >
                      {pueDeviceName}{' '}
                    </span>
                    {pueOption2} Energy & Cost Summary
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                    }}
                  >
                    <KpiSelector
                      options={kpiOptions}
                      setPueOption2={setPueOption2}
                      value={pueOption2}
                      pueDevice="true"
                    />

                    <DefaultSelector
                      options={updatedDevice}
                      onChange={handleChangePueDevice}
                      value={pueDeviceName}
                    />
                    <StyledButton
                      onClick={() => detail('5', pueOption2, pueDeviceId)}
                    >
                      See Detail
                    </StyledButton>
                  </div>
                </div>

                <AntdTooltip
                  title={
                    <div
                      style={{
                        color: theme?.palette?.main_layout?.primary_text,
                      }}
                    >
                      <span
                        style={{
                          color: theme?.palette?.graph?.title,
                          marginTop: '10px',
                          fontSize: '13px',
                        }}
                      >
                        total_cost (AED) = Total Power Input(kWh) * Energy Cost
                        per kWh (~0.32AED/kWh for UAE region)
                      </span>
                      {/* Hide by Saman Quesry */}
                      {/* <div
                        style={{
                          borderBottom: '1px solid #36424E',
                        }}
                      >
                        <p>
                          Site Name:{' '}
                          <span
                            style={{
                              color: `${theme?.palette?.main_layout?.secondary_text}`,
                            }}
                          >
                            {siteName}
                          </span>
                        </p>
                        <p>
                          Device Name:{' '}
                          <span
                            style={{
                              color: `${theme?.palette?.main_layout?.secondary_text}`,
                            }}
                          >
                            {pueDeviceName}
                          </span>
                        </p>
                        <p>
                          Power Usage Effectiveness: {pueData?.power_efficiency}{' '}
                          <span
                            style={{
                              color: `${theme?.palette?.main_layout?.secondary_text}`,
                              // color:
                              //   pueData2?.power_efficiency >= 0.5 &&
                              //   pueData2?.power_efficiency <= 1
                              //     ? 'green'
                              //     : pueData2?.power_efficiency > 1 &&
                              //         pueData2?.power_efficiency <= 1.5
                              //       ? '#0490E7'
                              //       : 'red',
                            }}
                          >
                            (
                            {pueData2?.power_efficiency >= 0.5 &&
                            pueData2?.power_efficiency <= 1
                              ? 'efficient'
                              : pueData2?.power_efficiency > 1 &&
                                  pueData2?.power_efficiency <= 1.5
                                ? 'moderately efficient'
                                : 'inefficient'}
                            )
                          </span>
                        </p>
                      </div> */}
                      {/* <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                        }}
                      >
                        <div>
                          <p>
                            0.5 - 1 (
                            <span style={{ color: '#42AE46' }}>Efficient</span>{' '}
                            )
                          </p>
                          <p>
                            1.5 - above ({' '}
                            <span style={{ color: '#fb0200' }}>
                              Inefficient
                            </span>{' '}
                            )
                          </p>
                        </div>
                        <p>
                          1 - 1.5 ({' '}
                          <span
                            style={{
                              color: `${theme?.name?.includes('Purple') ? theme?.palette?.main_layout?.secondary_text : '#0490E7'}`,
                            }}
                          >
                            {' '}
                            Modeately Efficient{' '}
                          </span>{' '}
                          )
                        </p>
                       
                      </div> */}
                    </div>
                  }
                  overlayInnerStyle={{
                    backgroundColor: theme?.palette?.graph?.toolTip_bg,
                    border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
                    width: '350px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '32px',
                      marginBottom: '0',
                    }}
                  >
                    <SummaryMetricsBarChart
                      pueData={pueData}
                      pue="true"
                      dashboard="true"
                    />
                  </div>
                </AntdTooltip>
                {/* <AntdTooltip
                  title={
                    <div>
                      <div
                        style={{
                          color: theme?.palette?.main_layout?.primary_text,
                        }}
                      >
                        The Power Usage Effectiveness (PUE) measures overall
                        energy efficiency in data centers, calculated as the
                        ratio of total power input to useful power output.
                        <span
                          style={{
                            color: `${theme?.palette?.main_layout?.secondary_text}`,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            navigate('/main_layout/about', {
                              state: {
                                title: 'pue',
                              },
                            })
                          }
                        >
                          see details
                        </span>
                      </div>
                    </div>
                  }
                  overlayInnerStyle={{
                    backgroundColor: theme?.palette?.graph?.toolTip_bg,
                    border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
                    width: '300px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginBottom: '-27px',
                      cursor: 'default',
                    }}
                  >
                    <p
                      style={{
                        width: '13px',
                        height: '13px',
                        background: theme?.palette?.graph?.graph_area?.line,
                        borderRadius: '100%',
                      }}
                    ></p>
                    <p
                      style={{
                        color: theme?.palette?.main_layout?.primary_text,
                        fontSize: '13px',
                      }}
                    >
                      Power Usage Effectiveness
                    </p>
                  </div>
                </AntdTooltip> */}
              </CustomCard>
            </CustomSpin>
          </Col>
        </Row>
        {/* <Row>
        <Col id="pcr" xs={24} style={{ padding: "10px" }}>
          <Spin spinning={loadingPcr}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: "7px",
                position: "relative",
                padding: "0px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "inter",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: theme?.palette?.main_layout?.primary_text,
                    marginBottom: "0px",
                    marginTop: "0px",
                  }}
                >
                  <span
                    style={{
                      color: theme?.palette?.main_layout?.secondary_text,
                    }}
                  >
                    {pcrDeviceName}{" "}
                  </span>
                  Power Consumption Ratio
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                  }}
                >
                  <KpiSelector
                    options={kpiOptions}
                    setPcrOption={setPcrOption}
                    value={pcrOption}
                    pcr="true"
                  />
                  <DefaultSelector
                    options={updatedDevice}
                    onChange={handleChangePcrDevice}
                    value={pcrDeviceName}
                  />
                </div>
              </div>
              {pcrData?.length > 0 ? (
                <PcrGraph
                  data={pcrData}
                  siteId={siteId}
                  pcrDeviceId={pcrDeviceId}
                  siteName={siteName}
                  deviceName={pcrDeviceName}
                />
              ) : null}
            </CustomCard>
          </Spin>
        </Col>
      </Row> */}
        <Row>
          <Col id="c_emission" xs={24} style={{ padding: '10px' }}>
            <DeviceLevelPCR
              siteName={siteName}
              siteId={siteId}
              pcrDeviceName={pcrDeviceName}
              kpiOptions={kpiOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col id="c_emission" xs={24} style={{ padding: '10px' }}>
            <DeviceLevelCO2
              siteName={siteName}
              kpiOptions={kpiOptions}
              siteId={siteId}
            />
          </Col>
        </Row>
        {/* <Row>
          <Col id="dataTraffic" xs={24} xl={12} style={{ padding: '10px' }}>
            <EnergyEfficiencyTrend
              detail={detail}
              kpiOptions={kpiOptions}
              updatedDevice={updatedDevice}
              siteId={siteId}
            />
          </Col>
          
          <Col id="dspca" xs={24} xl={12} style={{ padding: '10px' }}>
            <PowerConsumptionAnalysis siteId={siteId} />
          </Col>
        </Row> */}
        <Row style={{ display: 'flex', alignItems: 'stretch' }}>
          <Col
            id="dataTraffic"
            xs={24}
            xl={12}
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <EnergyEfficiencyTrend
              detail={detail}
              kpiOptions={kpiOptions}
              updatedDevice={updatedDevice}
              siteId={siteId}
            />
          </Col>

          <Col
            id="dspca"
            xs={24}
            xl={12}
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <PowerConsumptionAnalysis siteId={siteId} />
          </Col>
        </Row>
        <Row>
          {/* <Col id="sitesecdw" xs={24} xl={12} style={{ padding: "10px" }}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: "7px",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                color: theme?.palette?.main_layout?.primary_text,
                marginBottom: "0px",
                marginTop: "0px",
                fontFamily: "inter",
              }}
            >
              Overall{" "}
              <span
                style={{ color: theme?.palette?.main_layout?.secondary_text }}
              >
                {siteName}{" "}
              </span>
              Energy Consumption By Day of Week
            </p>
            {siteEnergyCosumption ? (
              <SiteEnergyConsumptionBarChart
                siteEnergyCosumption={siteEnergyCosumption}
                barWidth="40"
              />
            ) : (
              <div
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "249px",
                }}
              >
                <p>No data</p>
              </div>
            )}
          </CustomCard>
        </Col> */}
          {/* Hide by Saman Baji Quesry on 26 July */}
          {/* <Col id="sitesechd" xs={24} style={{ padding: '10px' }}>
            <CustomCard
              style={{
                // border: "1px solid #36424E",
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                // backgroundColor: "#050C17",
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                position: 'relative',
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
                Overall{' '}
                <span
                  style={{ color: theme?.palette?.main_layout?.secondary_text }}
                >
                  {siteName}{' '}
                </span>
                Energy Consumption By Hour of Day
              </p>

              {siteEnergyCosumptionLast24Hours ? (
                <CustomLineGraph
                  mainDashboard="true"
                  data={siteEnergyCosumptionLast24Hours}
                  tooltipPostfix="KW"
                />
              ) : (
                <div
                  style={{
                    color: theme?.palette?.main_layout?.primary_text,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '249px',
                  }}
                >
                  <p>No data</p>
                </div>
              )}
            </CustomCard>
          </Col> */}
        </Row>

        <Row>
          <Col id="powercost" xs={24} style={{ padding: '10px' }}>
            <Top5DevicesTable kpiOptions={kpiOptions} siteId={siteId} />
          </Col>

          {/* <Col id="sm" xs={24} xl={9} style={{ padding: "10px" }}>
          <Spin spinning={metricsChartData?.loading}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: "7px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: theme?.palette?.main_layout?.primary_text,
                    marginBottom: "0px",
                    marginTop: "0px",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: "inter",
                  }}
                >
                  Summary Metrics
                 
                </p>
               
                
              </div>
              {metricsChartData ? (
                <SummaryMetricsBarChart
                  summaryMetrics={metricsChartData?.data?.data}
                  dashboard="true"
                />
              ) : (
                <div
                  style={{
                    color: theme?.palette?.main_layout?.primary_text,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "318.5px",
                  }}
                >
                  <p>No data</p>
                </div>
              )}
            </CustomCard>
          </Spin>
        </Col> */}
        </Row>
        <Row>
          <Col id="hmr" xs={24} lg={12} style={{ padding: '10px' }}>
            <HeatMapRacks siteId={siteId} />
          </Col>
          <Col id="hl" xs={24} lg={12} style={{ padding: '10px' }}>
            <HardwareLifeCycle siteName={siteName} />
          </Col>
        </Row>
        {/* <Row id="tempGraph">
          <Col xs={24} lg={24} style={{ padding: '10px' }}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                // backgroundColor: "#050C17",
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                position: 'relative',
                padding: '0px 15px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
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
                  Humidity and Temperature Chart 
                </p>
                <CustomSelector options={months} />
              </div>
              <HumidityAndTemperature />
            </CustomCard>
          </Col>
        </Row> */}

        {/* <Row id="map">
          <Col xs={24} lg={14} style={{ padding: '10px' }}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                // backgroundColor: "#050C17",
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                position: 'relative',
                padding: '0px 15px',
              }}
            >
              <Dailyco
                heading="Emission"
                headericon={electric}
                siteId={siteId}
              />
            </CustomCard>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default Dashboard;
