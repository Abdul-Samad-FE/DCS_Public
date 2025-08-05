import React, { useEffect, useState } from 'react';
import { Modal, Spin, Row, Col } from 'antd';
import ApcChart from '../../../components/apcChart';
import SummaryMetricsBarChart from '../../../components/summaryMetrics';
import KpisChart from '../../../components/kpisChart';
import DeviceSpecificConsuptionChart from '../../../components/deviceSpecificPConsumption';
import RealTimePowerConsuptionChart from '../../../components/realTimePcChart';
import ThreshholdAlerts from '../../../components/threshholdAlerts';
import EcForecastChart from '../../../components/ecForcastChart';
// import GenericPdfDownloader from "./genericPdfDownloader";
import { fetchMetricsData } from '../../../store/features/dashboardModule/actions/metricsChartAction';
// ===========

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../../utils/axios';
import { fetchSwitchesPowerUtilization } from '../../../services/reportModuleServices/reportModuleServices';
const ReportBuilder = ({
  handleClose,
  open,
  recordToEdit,
  siteId,
  kpiChartData,
  metricsChartData,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [sitePowerUtilization, setSitePowerUtilization] = useState([]);
  const dispatch = useDispatch();

  const data = [
    // { value: 1048, name: "RUH" },
    { value: 20, name: 'RUH', itemStyle: { color: '#5615A2' } },
    // { value: 735, name: "Direct" },
    { value: 20, name: 'DUH', itemStyle: { color: '#C89902' } },
    { value: 10, name: 'SUH', itemStyle: { color: '#A02823' } },
    { value: 50, name: 'SULA', itemStyle: { color: '#01A5DE' } },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(apiUrl);
      const fetchedData = await response.json();
      // setData(fetchedData);
    };

    fetchData();
  }, [apiUrl]);

  const getSwitchesPowerUtilization = async () => {
    try {
      // const response = await axios.post(
      //   baseUrl + `/sites/sitePowerutilization?site_id=${recordToEdit.site_id}`
      // );
      const response = await fetchSwitchesPowerUtilization(
        recordToEdit.site_id
      );
      setSitePowerUtilization(response.data);
      console.log(response.data, 'Report::switches power'); // Logging the response data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getSwitchesPowerUtilization();
  }, [recordToEdit]);
  return (
    <>
      {/* <Modal
        width="100%"
        style={{ top: 5 }}
        className="pdf_file_modal"
        open={open}
        onCancel={handleClose}
       
        footer={false}
      > */}
      {/* <div style={{ display: "flex", justifyContent: "end" }}>
        <GenericPdfDownloader
          downloadFileName={recordToEdit}
          rootElementId="testId"
        />
      </div> */}
      <Spin spinning={loading}>
        <div id="testId">
          <div style={{ width: '90%', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p>Power Utilization 2024</p>
            </div>
            <h1>Power Utilization Report </h1>
            <p style={{ fontWeight: 400, color: 'black' }}>
              The Power Utilization Overview Dashboard provides a comprehensive
              summary of key metrics and performance indicators related to power
              consumption within a specific system or environment.{' '}
            </p>
            <div style={{ marginBottom: '50px' }}>
              <Row>
                <Col
                  xs={14}
                  style={{
                    padding: '20px 40px 10px 40px',
                  }}
                >
                  <div
                    style={{
                      border: '2px solid lightgray',
                      borderRadius: '10px',
                      padding: '20px 40px 10px 40px',
                    }}
                  >
                    <SummaryMetricsBarChart summaryMetrics={metricsChartData} />
                  </div>
                </Col>
                <Col
                  xs={9}
                  style={{
                    padding: '20px 40px 10px 40px',
                  }}
                >
                  <div
                    style={{
                      background: 'lightgray',
                      borderRadius: '10px',
                      padding: '10px 0px 10px 30px',
                    }}
                  >
                    <h3 style={{ marginBottom: '0px' }}>
                      Metrics Visualization:
                    </h3>

                    <p
                      style={{
                        marginTop: '0px',
                        marginBottom: '0px',
                      }}
                    >
                      Average power consumption
                    </p>
                    <ApcChart data={data} />
                  </div>
                </Col>
              </Row>
            </div>
            <div style={{ marginBottom: '70px' }}>
              <h2 style={{ marginBottom: '0px' }}>
                Power Utilization Performance:
              </h2>

              <p>
                This section highlights performance metrics that provide
                insights into the efficiency and effectiveness of power
                utilization within the system.
              </p>
              <p>
                <strong>Power Efficiency</strong> shows how efficiently power is
                used. Higher values mean better utilization.
              </p>
              <p>
                <strong>Energy Consumption Trends</strong> show energy usage
                patterns over time, identifying areas for optimization.
              </p>
              <p style={{ marginBottom: '50px' }}>
                <strong>Power Usage Effectiveness (PUE)</strong> shows energy
                efficiency by comparing total energy consumption to that used by
                IT equipment. Lower values signify higher efficiency.
              </p>
              <div
                style={{
                  border: '2px solid lightgray',
                  borderRadius: '10px',

                  padding: '40px 40px 40px 10px',
                }}
              >
                <KpisChart kpisData={kpiChartData} />
              </div>
            </div>
            <div style={{ marginBottom: '50px' }}>
              <h2>Device-Specific Power Consumption Analysis:</h2>
              <p
                style={{
                  fontWeight: 400,
                  color: 'black',
                  marginBottom: '40px',
                }}
              >
                Provides insights into power usage patterns of individual
                devices, aiding in targeted optimization efforts and enhancing
                overall energy efficiency.
              </p>
              <div
                style={{
                  border: '2px solid lightgray',
                  borderRadius: '10px',
                  padding: '40px 40px 40px 10px',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    color: 'black',
                    marginBottom: '0px',
                    marginTop: '0px',
                  }}
                >
                  Top Device-Specific Power <br /> Consumption Analysis
                </p>

                <DeviceSpecificConsuptionChart />
              </div>
            </div>
            <div style={{ marginBottom: '50px' }}>
              <h2>Real-time Monitoring:</h2>
              <p
                style={{
                  fontWeight: 400,
                  color: 'black',
                  marginBottom: '40px',
                }}
              >
                Enables continuous monitoring of energy consumption metrics,
                providing immediate insights into current power usage trends and
                identifying any deviations from expected norms in real-time.
              </p>
              <div
                style={{
                  border: '2px solid lightgray',
                  borderRadius: '10px',
                  padding: '40px 40px 40px 10px',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    color: 'black',
                    marginBottom: '0px',
                    marginTop: '0px',
                  }}
                >
                  Real-time Power Consumption Monitoring
                </p>
                <RealTimePowerConsuptionChart />
              </div>
            </div>
          </div>
        </div>
      </Spin>
      {/* </Modal> */}
    </>
  );
};

export default ReportBuilder;
