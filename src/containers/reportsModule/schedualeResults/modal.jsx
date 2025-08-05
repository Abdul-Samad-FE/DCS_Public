import React, { useEffect, useState } from "react";
import { Modal, Spin, Row, Col, Table } from "antd";
import SummaryMetricsBarChart from "../../../components/summaryMetrics";
import KpisChart from "../../../components/kpisChart";
import DeviceSpecificConsuptionChart from "../../../components/deviceSpecificPConsumption";
import RealTimePowerConsuptionChart from "../../../components/realTimePcChart";
import ThreshholdAlerts from "../../../components/threshholdAlerts";
import EcForecastChart from "../../../components/ecForcastChart";
import AnomaliesChart from "../../../components/anomaliesDetectionChart.jsx";
import GenericPdfDownloader from "./genericPdfDownloader";
import HardwareLifeCycleGraph from "../../../components/hardwareLifeCycleGraph.jsx";
import { fetchMetricsData } from "../../../store/features/dashboardModule/actions/metricsChartAction";
// ===========
import { fetchKpiChartData } from "../../../store/features/dashboardModule/actions/kpiChartAction.js";
import { fetchMetricsChartData } from "../../../store/features/dashboardModule/actions/metricsChartAction.js";
import { fetchTopDevicesPowerCostData } from "../../../store/features/dashboardModule/actions/topDevicesPowerCostAction.js";
import { fetchDeviceSpecificChartData } from "../../../store/features/dashboardModule/actions/deviceSpecificChartAction.js";
import { fetchTrafficThroughputChartData } from "../../../store/features/dashboardModule/actions/trafficThroughputAction.js";
import { fetchPiChartData } from "../../../store/features/dashboardModule/actions/piChartAction.js";
import DefaultTable from "../../../components/tables.jsx";
import CustomCard from "../../../components/customCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { baseUrl, BaseUrl } from "../../../utils/axios";
import { duration } from "moment";
import { fetchDevicesData } from "../../../store/features/dashboardModule/actions/devicesAction.js";
import { fetchRacksAsync } from "../../../store/features/uamModule/racks/slices/racksSlice.js";
import DetailCards from "../../dashboardModule/dashboard/detailCards.jsx";
import car from "../../../resources/images/car.png";
import airplane from "../../../resources/images/airplane.png";
import { fetchElectricityMapPiData } from "../../../store/features/dashboardModule/actions/electricityMapPi.js";
import ApcChart from "../../../components/apcChart";
import EnergyEfficiencyOverall from "../../../components/energyEfficiencyOverall.jsx";
import CustomProgress from "../../../components/customProgress.jsx";
import DevicesBarChart from "../../../components/devicesBarChart.jsx";
// hjdgshjsdj
const PdfModal = ({ handleClose, open, recordToEdit, siteId }) => {
  const access_token = localStorage.getItem("access_token");

  console.log(recordToEdit, "recordToEditrecordToEdit");
  console.log(access_token, "access_token");
  const [kpiOption, setKpiOption] = useState("24 hours");

  const [loading, setLoading] = useState(false);
  const [sitePowerUtilization, setSitePowerUtilization] = useState([]);

  const [piOption, setPiOption] = useState("24 hours");
  const [carbonData, setCarbonData] = useState();
  const [pueData, setPueData] = useState();
  const [carbonEmissionDevices, setCarbonEmissionDevices] = useState();

  const electricityMapPiData = useSelector(
    (state) => state.electricityMapPiData
  );
  const kpiChartData = useSelector((state) => state.kpiChartData?.data?.data);

  const dispatch = useDispatch();
  const fetchCarbonEmissionData = async () => {
    try {
      const response = await axios.get(
        baseUrl +
          `/sites/sites/carbon_emission_details/${recordToEdit?.site_id}?duration=${piOption}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setCarbonData(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch carbon emission data:", error);
    }
  };

  const fetchPue = async () => {
    // setPueLoading(true);

    try {
      const response = await axios.get(
        baseUrl +
          `/sites/sites/average_energy_consumption_metrics/${recordToEdit?.site_id}?duration=${recordToEdit?.duration}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response?.status === 200) {
        console.log("pue::::", response);

        setPueData(response?.data?.data);
        // setPueLoading(false);
      } else {
        setPueData([]);
      }
    } catch (error) {
      setPueData([]);
      // setPueLoading(false);
      console.error("Failed to fetch carbon emission data:", error);
    }
  };
  const devicesCarbonEmission = async () => {
    try {
      const response = await axios.get(
        baseUrl +
          `/sites/sites/all_devices_carbon_emission/${recordToEdit?.site_id}?duration=${recordToEdit?.duration}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response?.status === 200) {
        setCarbonEmissionDevices(response?.data?.data);
        console.log("response all devices co2 emm", response);
      } else {
        setPueData([]);
      }
    } catch (error) {
      setPueData([]);
      console.error("Failed to fetch carbon emission data:", error);
    }
  };
  useEffect(() => {
    // dispatch(fetchMetricsChartData(recordToEdit?.site_id));
    // dispatch(fetchKpiChartData(recordToEdit?.site_id));
    // dispatch(fetchTopDevicesPowerCostData(recordToEdit?.site_id));
    if (recordToEdit?.site_id && access_token) {
      devicesCarbonEmission();
      fetchPue();
      dispatch(fetchDevicesData(recordToEdit?.site_id, access_token));
      dispatch(fetchRacksAsync());
      fetchCarbonEmissionData();
      dispatch(
        fetchElectricityMapPiData(recordToEdit?.site_id, piOption, access_token)
      );
      dispatch(fetchMetricsChartData(recordToEdit?.site_id, access_token));
      dispatch(
        fetchKpiChartData(
          recordToEdit?.site_id,
          (duration = recordToEdit?.duration),
          access_token
        )
      );
      dispatch(
        fetchDeviceSpecificChartData(recordToEdit?.site_id, access_token)
      );
      dispatch(
        fetchTopDevicesPowerCostData(
          recordToEdit?.site_id,
          (duration = recordToEdit?.duration),
          access_token
        )
      );
      dispatch(
        fetchTrafficThroughputChartData(
          recordToEdit?.site_id,
          "",
          (duration = recordToEdit?.duration),
          access_token
        )
      );
      dispatch(fetchPiChartData(recordToEdit?.site_id, access_token));
    }
  }, [recordToEdit?.site_id, access_token]);
  const kpiChartLoader = useSelector((state) => state.kpiChartData.loading);

  const trafficThroughputChartData = useSelector(
    (state) => state.trafficThroughPutChartData?.data?.data
  );
  console.log(trafficThroughputChartData, "trafficThroughputChartData");
  const topDevicesPowerCostData = useSelector(
    (state) => state.topDevicesPowerCostData?.data?.top_devices
  );
  const metricsChartData = useSelector(
    (state) => state.metricsChartData?.data?.data
  );
  // const kpiChartData = useSelector((state) => state.kpiChartData?.data);
  const deviceSpecificChartData = useSelector(
    (state) => state.deviceSpecificData?.data
  );
  const piData = useSelector((state) => state.pi?.data);
  const chartData = [
    { value: piData?.hardware_eos_count, name: "End of Sale" },
    { value: piData?.hardware_eol_count, name: "End of Life" },
    { value: 1, name: "End of Support" },
  ];

  // const siteId = useSelector((state) => state);

  const columns = [
    {
      title: "Name",
      dataIndex: "device_name",
      key: "device_name",
      // ...getColumnSearchProps("device_name"),
      render: (text, record) => {
        return (
          <p
            // onClick={() => handleDeviceClick(record)}
            style={{ color: "#0490E7", fontSize: "14px" }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: "Total Power Consumption",
      dataIndex: "total_power",
      key: "total_power",
      // ...getColumnSearchProps("total_power"),
      render: (record) => {
        return (
          <div
            style={{
              background: "#4C791B",
              color: "#E0E0E0",
              width: "65px",
              height: "25px",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {record}kw
          </div>
        );
      },
    },
    {
      title: "Average Power Consumption",
      dataIndex: "average_power",
      key: "average_power",
      // ...getColumnSearchProps("average_power"),
      render: (record) => {
        return (
          <div
            style={{
              background: "#4C791B",
              color: "#E0E0E0",
              width: "65px",
              height: "25px",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {record}kw
          </div>
        );
      },
    },
    {
      title: "Power Cost",
      dataIndex: "cost_of_power",
      key: "cost_of_power",
      // ...getColumnSearchProps("cost_of_power"),
      render: (record) => {
        return (
          <div
            style={{
              background: "#4C791B",
              color: "#E0E0E0",
              width: "150px",
              height: "25px",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {record} AED
          </div>
        );
      },
    },
  ];

  // const getSwitchesPowerUtilization = async () => {
  //   try {
  //     const response = await axios.post(
  //       BaseUrl + `/sites/sitePowerutilization?site_id=${recordToEdit.site_id}`
  //     );
  //     setSitePowerUtilization(response.data);
  //     console.log(response.data, "switches power");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // useEffect(() => {
  //   getSwitchesPowerUtilization();
  // }, [recordToEdit]);
  const devices = useSelector((state) => state.devices?.data?.data);
  const racks = useSelector((state) => state.racks?.racks);

  const colorMap = {
    nuclear: "#1a78b8",
    geothermal: "#de7818",
    biomass: "#DAF7A6",
    coal: "#3d0f0c",
    wind: "#5615A2",
    solar: "#111933",
    hydro: "#0a5dab",
    gas: "#827675",
    oil: "#808080",
    unknown: "#7D3C98",
    battery_discharge: "#28B463",
  };
  const transformData = (data) => {
    if (!data) {
      return []; // Return an empty array if data is not available
    }
    return Object.entries(data).map(([key, value]) => ({
      value,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      itemStyle: { color: colorMap[key] },
    }));
  };

  const electricityMapPiModified = transformData(
    electricityMapPiData?.data?.data?.consumption_percentages
  );

  return (
    <>
      <Modal
        width="100%"
        style={{ top: 5 }}
        className="pdf_file_modal"
        open={open}
        onCancel={handleClose}
        // footer={[
        //   <GenericPdfDownloader
        //     downloadFileName="CustomPdf"
        //     rootElementId="testId"
        //   />,
        // ]}
        footer={false}
      >
        <div style={{ display: "flex", justifyContent: "end" }}>
          <GenericPdfDownloader
            downloadFileName={recordToEdit?.report_title}
            rootElementId="testId"
            setLoading={setLoading}
          />
        </div>
        <Spin size="large" spinning={loading}>
          <div id="testId">
            <div style={{ width: "95%", margin: "0 auto" }}>
              <div>
                <p>Power Utilization 2024</p>

                <h1>Power Utilization Report </h1>
                <p
                  style={{
                    fontWeight: 400,
                    color: "black",
                    marginBottom: "50px",
                  }}
                >
                  The Energy Utilization Overview Dashboard provides a
                  comprehensive summary of key metrics and performance
                  indicators related to power consumption within a specific
                  system or environment.
                </p>
              </div>
              {/* ----------------------------- */}
              <div
                style={{
                  marginBottom: "50px",
                }}
              >
                <DetailCards report="true" devices={devices} racks={racks} />
              </div>
              {/* -------------------------- */}
              <Row gutter={[10]}>
                <Col xs={24} lg={16}>
                  <div style={{ marginBottom: "170px" }}>
                    <h2 style={{ marginBottom: "10px" }}>
                      Overall{" "}
                      {/* <span style={{ color: "#2268D1" }}>{siteName} </span> */}
                      Energy Efficiency Ratio
                    </h2>

                    {/* <p>
                  This graph shows the Energy Efficiency Ratio (EER) and Power
                  Usage Effectiveness (PUE) over time, also it has time interval
                  selection to see specific time statistics. These metrics are
                  crucial for assessing the operational efficiency of the data
                  center and for benchmarking against industry standards.
                </p> */}

                    <Spin spinning={kpiChartLoader}>
                      <CustomCard
                        style={{
                          border: "1px solid #36424E",
                          backgroundColor: "",
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
                          {/* <p
                        style={{
                          fontSize: "16px",
                          color: "#E4E5E8",
                          marginBottom: "0px",
                          marginTop: "0px",
                          fontFamily: "inter",
                        }}
                      >
                        Overall{" "}
                        <span style={{ color: "#2268D1" }}>{siteName} </span>
                        Energy Efficiency Ratio
                      </p> */}
                        </div>
                        <EnergyEfficiencyOverall
                          kpiOption={kpiOption}
                          data={kpiChartData}
                          siteId={recordToEdit?.site_id}
                          // siteName={siteName}
                        />
                      </CustomCard>
                    </Spin>
                    {/* <p>
                  <strong>Conclusion: </strong>
                  {kpiChartData?.message}
                </p> */}
                  </div>
                </Col>
                <Col id="pue" xs={24} xl={8}>
                  {/* <Spin spinning={pueLoading}> */}
                  <h2 style={{ marginBottom: "10px" }}>
                    Power Usage Effectiveness
                  </h2>
                  <CustomCard
                    style={{
                      border: "1px solid #36424E",
                      backgroundColor: "",
                      borderRadius: "7px",
                      // position: "relative",
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
                          color: "#E4E5E8",
                          marginBottom: "0px",
                          marginTop: "0px",
                          fontSize: "16px",
                          fontWeight: 500,
                          fontFamily: "inter",
                        }}
                      >
                        <span style={{ color: "#2268D1" }}></span> Power Usage{" "}
                        <br /> Effectiveness
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "0",
                        cursor: "default",
                        marginTop: "25px",
                      }}
                    >
                      <CustomProgress
                        pueValue={pueData?.power_efficiency}
                        report="true"
                        type="circle"
                        strokeWidth="8"
                        size={[177]}
                        style={{}}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        marginBottom: "-30px",
                        cursor: "default",
                      }}
                    >
                      <p
                        style={{
                          width: "13px",
                          height: "13px",
                          background: "green",
                          borderRadius: "100%",
                        }}
                      ></p>
                      <p
                        style={{
                          color: "#E4E5E8",
                          fontSize: "13px",
                        }}
                      >
                        Power Usage Effectiveness
                      </p>
                    </div>
                  </CustomCard>
                  {/* </Spin> */}
                </Col>
              </Row>
              {/* -------------------------- */}
              <div style={{ marginBottom: "100px" }}>
                <Spin spinning={electricityMapPiData?.loading}>
                  <CustomCard
                    style={{
                      border: "1px solid #36424E",
                      backgroundColor: "",
                      borderRadius: "7px",
                      position: "relative",
                      padding: "0 10px 10px 10px",
                    }}
                  >
                    <Row id="em">
                      <Col xs={24} lg={7}>
                        <div>
                          <p
                            style={{
                              fontSize: "16px",
                              color: "gray",
                              marginBottom: "0px",
                              marginTop: "0px",
                              fontFamily: "inter",
                              fontWeight: 500,
                            }}
                          >
                            Emission for {piOption}
                          </p>
                          <strong
                            style={{ color: "#2268D1", fontSize: "22px" }}
                          >
                            {carbonData?.carbon_emission} kg CO2e
                          </strong>
                          <p
                            style={{
                              color: "gray",
                              marginBottom: "45px",
                              // marginTop: "0px",
                              fontFamily: "inter",
                            }}
                          >
                            Estimated{" "}
                            <span
                              style={{ color: "#2268D1", fontWeight: "bold" }}
                            >
                              {piOption}
                            </span>{" "}
                            carbon dioxide equivalent <br />
                            emissions(based on energy usage).
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "15px",
                              color: "gray",
                              marginBottom: "45px",
                              fontFamily: "inter",
                            }}
                          >
                            <img width="46px" height="46px" src={car} alt="" />
                            <p
                              style={{
                                marginBottom: "0px",
                                marginTop: "0px",
                              }}
                            >
                              {/* Equivalent of 416 car trips of 1070 km <br /> each in a
                        gas-powered passenger vehicle */}
                              {carbonData?.carbon_effect_car}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "15px",
                              color: "gray",
                              fontFamily: "inter",
                            }}
                          >
                            <img
                              width="46px"
                              height="46px"
                              src={airplane}
                              alt=""
                            />
                            <p
                              style={{
                                marginBottom: "0px",
                                marginTop: "0px",
                              }}
                            >
                              {/* 33 Airplane Flights of 1 hour, 50 minutes each */}
                              {carbonData?.carbon_effect_flight}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} lg={10}>
                        <div
                          style={{
                            marginLeft: "50px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "16px",
                              color: "black",
                              marginBottom: "0px",
                              marginTop: "0px",
                              fontFamily: "inter",
                            }}
                          >
                            Energy Mix
                          </p>
                        </div>
                        <div
                          style={{
                            padding: "0 20px 0px 0px",
                          }}
                        >
                          <ApcChart
                            report="true"
                            data={electricityMapPiModified}
                          />
                        </div>
                      </Col>
                      <Col xs={24} lg={7}>
                        <div style={{ color: "black", marginBottom: "30px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "5px",
                              marginTop: "0px",
                            }}
                          >
                            Consolidation and Decommissioning:
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              marginTop: "0px",
                              color: "gray",
                            }}
                          >
                            • {carbonData?.carbon_solution?.consolidation}
                          </p>
                        </div>
                        <div style={{ color: "black", marginBottom: "30px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "5px",
                              // marginTop: "0px",
                            }}
                          >
                            High-Efficiency Power Supplies:
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              marginTop: "0px",
                              color: "gray",
                            }}
                          >
                            • {carbonData?.carbon_solution?.high_efficiency}
                          </p>
                        </div>
                        <div style={{ color: "black", marginBottom: "30px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "5px",
                              // marginTop: "0px",
                            }}
                          >
                            Plant Trees to Offset Emissions:
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              marginTop: "0px",
                              color: "gray",
                            }}
                          >
                            • {carbonData?.carbon_solution?.plant_trees}
                          </p>
                        </div>
                        <div style={{ color: "black" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "5px",
                              // marginTop: "0px",
                            }}
                          >
                            Regular Maintenance:
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              marginTop: "0px",
                              marginBottom: "0px",
                              color: "gray",
                            }}
                          >
                            • {carbonData?.carbon_solution?.regular_maintenance}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </CustomCard>
                </Spin>
              </div>
              {/* --------------------------- */}
              <div>
                <h2 style={{ marginBottom: "0px" }}>
                  Device Level Carbon Emission
                </h2>
                <Row>
                  <Col xs={24}>
                    <CustomCard
                      style={{
                        border: "1px solid #36424E",
                        backgroundColor: "",
                        borderRadius: "7px",
                        position: "relative",
                        padding: "0px",
                      }}
                    >
                      {carbonEmissionDevices?.length > 0 ? (
                        <DevicesBarChart
                          report="true"
                          data={carbonEmissionDevices}
                        />
                      ) : null}
                    </CustomCard>
                  </Col>
                </Row>
              </div>
              {/* --------------------------- */}
              <div style={{ marginBottom: "100px" }}>
                <h2 style={{ marginBottom: "0px" }}>Summary Metrics</h2>

                <p>
                  This section details the total power consumption, peak usage,
                  and average power utilization over the last month. It offers
                  insights into energy trends and helps identify periods of high
                  energy demand.
                </p>

                <Row>
                  <Col
                    xs={15}
                    style={{
                      padding: "20px 10px 10px 0px",
                    }}
                  >
                    <div
                      style={{
                        border: "2px solid lightgray",
                        borderRadius: "10px",
                        padding: "20px 40px 10px 40px",
                      }}
                    >
                      <SummaryMetricsBarChart
                        report="true"
                        summaryMetrics={metricsChartData}
                      />
                    </div>
                  </Col>
                  {/* <Col
                    xs={9}
                    style={{
                      padding: "20px 0px 10px 10px",
                    }}
                  >
                    <div
                      style={{
                        border: "2px solid lightgray",
                        // background: "lightgray",
                        borderRadius: "10px",
                        padding: "0px 0px 10px 20px",
                      }}
                    >
                      <h3 style={{ marginBottom: "0px" }}>
                        Metrics Visualization:
                      </h3>

                      <p
                        style={{
                          marginTop: "0px",
                          marginBottom: "0px",
                        }}
                      >
                        Average power consumption
                      </p>
                      <ApcChart report="true" data={data} />
                    </div>
                  </Col> */}
                </Row>
              </div>
              {/* --------------------------- */}

              {/* <div style={{ marginBottom: "80px" }}>
                <h2 style={{ marginBottom: "0px" }}>
                  Energy Efficiency Trends Across Data Traffic:
                </h2>

                <p>
                  This graph visualizes the correlation between device data
                  traffic and energy efficiency over selected time intervals of
                  selected device. It helps in understanding how data demand
                  impacts energy usage.
                </p>
                <CustomCard
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: "7px",
                    position: "relative",
                    marginBottom: "20px",
                    width: "100%",
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
                        color: "black",
                        marginBottom: "0px",
                        marginTop: "0px",
                      }}
                    >
                      Energy Efficiency Trends Across Data Traffic
                    </p>
                  </div>

                
                  {trafficThroughputChartData?.length > 0 ? (
                    <AnomaliesChart
                      report="true"
                      data={trafficThroughputChartData}
                    />
                  ) : (
                    <div
                      style={{
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "265px",
                      }}
                    >
                      <p>No data</p>
                    </div>
                  )}
                </CustomCard>
              </div> */}

              {/* <div style={{ marginBottom: "80px" }}>
                <h2>Device-Specific Power Consumption Analysis:</h2>
                <p
                  style={{
                    fontWeight: 400,
                    color: "black",
                  }}
                >
                  This analysis breaks down power consumption for two specific
                  devices over selected time intervals, aiding in pinpointing
                  devices that may be using energy inefficiently.
                </p>
                <div
                  style={{
                    border: "2px solid lightgray",
                    borderRadius: "10px",
                    padding: "10px 20px 10px 20px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "black",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    Device-Specific Power <br />
                    Consumption Analysis
                  </p>

                  <DeviceSpecificConsuptionChart
                    deviceSpecificChartData={deviceSpecificChartData}
                  />
                </div>
              </div> */}

              {/* --------------------------- */}
              <div style={{ marginBottom: "80px" }}>
                <h2>
                  Top Five Devices by Energy Consumption and Associated Costs:
                </h2>
                <p
                  style={{
                    fontWeight: 400,
                    color: "black",
                  }}
                >
                  This list identifies the top five devices in terms of total
                  and average power consumption highlighting the primary
                  contributors to energy usage within the data center.
                  Additionally, the list illustrates the cost implications of
                  the energy consumption for these devices, offering a financial
                  perspective on the monthly energy expenditures.
                </p>
                <CustomCard
                  style={{
                    border: "2px solid lightgray",
                    borderRadius: "7px",
                    marginBottom: "20px",
                    marginTop: "40px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        marginBottom: "0px",
                        marginTop: "0px",
                        fontFamily: "inter",
                      }}
                    >
                      Top Five Devices by Energy Consumption and Associated
                      Costs
                    </p>
                  </div>

                  <Table
                    columns={columns}
                    dataSource={topDevicesPowerCostData}
                    pagination={false}
                  />
                </CustomCard>
              </div>
              {/* ------------------------ */}
              <div style={{ marginBottom: "80px" }}>
                <h2>Hardware Life Cycle Management:</h2>
                <p
                  style={{
                    fontWeight: 400,
                    color: "black",
                    // marginBottom: "40px",
                  }}
                >
                  This section provides comprehensive information on hardware
                  inventory, including statuses such as End-of-Life (EOL),
                  End-of-Service (EOS), and End-of-Support (EOS). These details
                  are crucial for strategic planning regarding hardware upgrades
                  and effective lifecycle cost management.
                </p>
                <CustomCard
                  style={{
                    border: "1px solid lightgray",
                    // backgroundColor: "#050C17",
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
                        color: "black",
                        marginBottom: "0px",
                        marginTop: "0px",
                        fontFamily: "inter",
                      }}
                    >
                      Hardware Life Cycle Management
                    </p>
                  </div>
                  <HardwareLifeCycleGraph report="true" chartData={chartData} />
                </CustomCard>
              </div>
              {/* ------------------------ */}
              <div style={{ textAlign: "center" }}>
                <p>
                  This report comprehensively analyzes key energy utilization
                  metrics, hardware lifecycle, and device power comparisons
                  within our Data Center. To optimize operational efficiency and
                  reduce costs, it is essential to continue monitoring these
                  metrics and updating our hardware strategy accordingly.
                </p>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default PdfModal;
