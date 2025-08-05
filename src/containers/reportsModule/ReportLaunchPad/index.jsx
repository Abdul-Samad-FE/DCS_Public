import React, { useState } from "react";
import { Row, Col } from "antd";

import CustomAccordion from "../../../components/customAccordion";
const text = [
  "Temprature and Humidity Monitoring",
  "Cooling System Efficiency Analysis",
  "Fault Detection and Diagnostics ",
  "Energy Consumption Monitoring",
  "Predictive Maintenance and Lifecycle Management",
];

const text1 = [
  " Energy Consumption and Carbon Footprint Analysis",
  "Renewable Energy Integration",
  "Cooling System Efficiency and Environmental Impact",
  "Carbon Offset and Mitigation Strategies",
  "Environmental Reporting and Compliance",
];
const text2 = [
  "Overall Power Utilization Trends",
  "Device-Specific Power Consumption",
  "Power Utilization Distribution Analysis",
  "Cost Analysis and Forecasting",
  "Real-time Monitoring and Alerts",
];
const text3 = [
  " Traffic Distribution Analysis",
  "Peak Hour Analysis",
  "Top-Consuming Devices and Applications",
  "Real-Time Monitoring and Alerts",
  "Historical Analysis and Trend Forecasting",
  "Segment-Specific Throughput Analysis",
];
const text4 = [
  "CO2 Emission Analysis and Carbon Footprint Reduction",
  "Renewable Energy Integration and Sustainability Practices",
  "Water Usage and Environmental Stewardship",
  "Sustainability Reporting and Compliance",
];
const text5 = [
  "802. 11n Summary",
  "Preferred Calls",
  "Wireless Network Executive Summary",
];
const ReportLaunchPad = () => {
  return (
    <>
      <Row>
        <Col lg={12} style={{ padding: "10px" }}>
          <CustomAccordion text={text2} title="Power Utilization" />

          <CustomAccordion text={text} title="Cooling System" />
          <CustomAccordion text={text1} title="Co2 Emission" />
        </Col>

        <Col lg={12} style={{ padding: "10px" }}>
          <CustomAccordion text={text3} title="Data Traffic" />
          <CustomAccordion
            text={text4}
            title="Environmental Impact Assessment"
          />
          {/* <CustomAccordion text={text5} title="Network Summary" /> */}
        </Col>
      </Row>
    </>
  );
};

export default ReportLaunchPad;
