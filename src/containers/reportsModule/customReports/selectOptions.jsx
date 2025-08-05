import { CaretRightOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Col, Collapse, theme, Row, Checkbox } from 'antd';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
// icons"
import { FiZap } from 'react-icons/fi';
import { FiActivity } from 'react-icons/fi';
import { IoLeafOutline } from 'react-icons/io5';
import { FiDatabase } from 'react-icons/fi';
import { FaChartLine } from 'react-icons/fa';
const text2 = ['PUE Report'];
const energyText = ['Energy Consumption Report', 'Energy Efficiency Report'];
const text1 = ['Co2eq Emission Report'];
const text3 = [
  'Traffic Distribution Analysis',
  'Peak Hour Analysis',
  'Top-Consuming Devices and Applications',
  'Real-Time Monitoring and Alerts',
  'Historical Analysis and Trend Forecasting',
  'Segment-Specific Throughput Analysis',
];
const text4 = [
  'CO2 Emission Analysis and Carbon Footprint Reduction',
  'Renewable Energy Integration and Sustainability Practices',
  'Water Usage and Environmental Stewardship',
  'Sustainability Reporting and Compliance',
];

const CustomAccordion = ({
  text,
  title,
  onChange,
  selectedOptions,
  icon = '',
}) => {
  // const { token } = ee.useToken();
  const theme = useTheme();
  const panelStyle = {
    marginBottom: 9,
    // borderRadius: token.borderRadiusLG,
  };

  const StyledCollapse = styled(Collapse)`
    background: ${theme?.palette?.available_options?.options_bg} !important;

    color: ${theme?.palette?.available_options?.primary_text} !important;

    .ant-collapse-item {
      background: ${theme?.palette?.available_options?.options_bg} !important;
    }

    .ant-collapse-header {
      color: ${theme?.palette?.available_options?.primary_text} !important;
      background: ${theme?.palette?.available_options?.options_bg} !important;
      .ant-collapse-arrow {
        color: ${theme?.palette?.available_options?.primary_text} !important;
      }
    }

    .ant-collapse-content {
      background: ${theme?.palette?.available_options?.background} !important;
      color: ${theme?.palette?.available_options?.primary_text} !important;
    }
  `;
  // old code
  // const StyledCheckbox = styled(Checkbox)`
  //   color: ${theme?.palette?.available_options?.primary_text} !important;

  //   .ant-checkbox-inner {
  //     border-color: ${theme?.palette?.available_options
  //       ?.primary_text} !important;
  //   }

  //   .ant-checkbox-checked .ant-checkbox-inner {
  //     background-color: ${theme?.palette?.available_options
  //       ?.checkbox_bg} !important;
  //     border-color: ${theme?.palette?.available_options?.border} !important;
  //   }
  //   &&.ant-checkbox-wrapper[disabled] {
  //     color: ${theme?.palette?.available_options?.primary_text ||
  //     '#888'} !important;
  //     opacity: 0.7; // makes it look subtly disabled but readable
  //   }
  // `;

  // with disbaled some select options
  const StyledCheckbox = styled(Checkbox)`
    color: ${theme?.palette?.available_options?.primary_text} !important;

    .ant-checkbox-inner {
      border-color: ${theme?.palette?.available_options
        ?.primary_text} !important;
    }

    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${theme?.palette?.available_options
        ?.checkbox_bg} !important;
      border-color: ${theme?.palette?.available_options?.border} !important;
    }

    // ✨ Fix disabled label color
    .ant-checkbox-disabled .ant-checkbox-inner {
      background-color: transparent !important;
      border-color: ${theme?.palette?.available_options
        ?.primary_text} !important;
      opacity: 0.5;
    }

    .ant-checkbox-disabled + span {
      color: ${theme?.palette?.available_options?.primary_text} !important;
      opacity: 0.5;
    }
  `;
  return (
    <div>
      <StyledCollapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{
          marginBottom: '0px',
        }}
        items={[
          {
            key: '1',
            label: (
              <p
                style={{
                  margin: '0px',
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                {icon}
                {/* <span
                  style={{
                    padding: '5px',
                    marginTop: '3px',
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                  }}
                >
                  
                </span>{' '} */}
                <span>{title}</span>
              </p>
            ),
            children: (
              <ul
                style={{
                  listStyle: 'none',
                  paddingLeft: '20px',
                  background: theme?.palette?.available_options?.options_bg,
                }}
              >
                {/* old code that has nothing for disable options */}
                {/* {text.map((item, index) => (
                  <li key={index} style={{ marginBottom: '0px' }}>
                    <StyledCheckbox
                      style={{
                        padding: '10px 0',
                        marginLeft: '20px',
                      }}
                      checked={selectedOptions.includes(item)}
                      onChange={() => onChange(item)}
                    >
                      {item}
                    </StyledCheckbox>
                  </li>
                ))} */}
                {text.map((item, index) => {
                  const isDataTraffic = title === 'Data Traffic';

                  const isDisabled =
                    (isDataTraffic && index !== 0) ||
                    title == 'Environmental Impact Assessment';

                  return (
                    <li key={index} style={{ marginBottom: '0px' }}>
                      <StyledCheckbox
                        style={{
                          padding: '10px 0',
                          marginLeft: '20px',
                        }}
                        checked={selectedOptions.includes(item)}
                        onChange={() => onChange(item)}
                        disabled={isDisabled}
                      >
                        {item}
                      </StyledCheckbox>
                    </li>
                  );
                })}
              </ul>
            ),
            style: panelStyle,
          },
        ]}
      />
    </div>
  );
};

const DropTarget = ({ selectedOptions, removeItem, theme }) => (
  <div
    style={{
      background: theme?.palette?.available_options?.card_bg,
      width: '100%',
      minHeight: '336px',
      border: `1px solid ${theme?.palette?.available_options?.border}`,
    }}
  >
    <p
      style={{
        padding: '15px 15px',
        fontSize: '16px',
        fontWeight: 400,
        color: theme?.palette?.available_options?.primary_text,
        background: theme?.palette?.available_options?.options_bg,
        marginTop: '0px',
        marginBottom: '0px',
        borderBottom: `1px solid ${theme?.palette?.available_options?.border}`,
      }}
    >
      Selected Options
    </p>
    <ul
      style={{
        listStyle: 'none',
        paddingLeft: 0,
        padding: '10px 15px',
      }}
    >
      {selectedOptions.length !== 0 ? (
        selectedOptions.map((item, index) => (
          <li
            key={index}
            style={{
              color: theme?.palette?.available_options?.primary_text,
              borderBottom: `1px solid ${theme?.palette?.available_options?.border_bottom}`,
              width: '100%',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{item}</span>
            <CloseOutlined
              onClick={() => removeItem(index)}
              style={{ cursor: 'pointer' }}
            />
          </li>
        ))
      ) : (
        <div
          style={{
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: theme?.palette?.available_options?.primary_text,
              fontSize: '16px',
              textAlign: 'center',
            }}
          >
            To select a report, check the box from the Available <br /> Options
            list
          </p>
        </div>
      )}
    </ul>
  </div>
);

const SelectOption = ({ selectedOptions, setSelectedOptions }) => {
  //   const [selectedOptions, setSelectedOptions] = useState([]);
  const theme = useTheme();

  const handleCheckboxChange = (item) => {
    if (selectedOptions.includes(item)) {
      setSelectedOptions((prev) => prev.filter((option) => option !== item));
    } else {
      setSelectedOptions((prev) => [...prev, item]);
    }
  };

  const removeItem = (index) => {
    setSelectedOptions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Row>
      <Col xs={24} md={12} style={{ padding: '10px 10px 10px 0px' }}>
        <div
          style={{
            background: theme?.palette?.available_options?.card_bg,
            width: '100%',
            height: 'auto',
            border: `1px solid ${theme?.palette?.available_options?.border}`,
          }}
        >
          <p
            style={{
              padding: '15px 15px',
              fontSize: '16px',
              fontWeight: 400,
              color: theme?.palette?.available_options?.primary_text,
              background: theme?.palette?.available_options?.options_bg,
              marginTop: '0px',
              marginBottom: '8px',
              borderBottom: `1px solid ${theme?.palette?.available_options?.border}`,
            }}
          >
            Available Options
          </p>
          <CustomAccordion
            theme={theme}
            text={text2}
            title="Power Utilization "
            onChange={handleCheckboxChange}
            selectedOptions={selectedOptions}
            // icon={<FiZap size={16} />}
            icon={
              <FiZap
                style={{
                  width: '18px',
                  height: '18px',
                  background: `${theme?.palette?.default_card?.icon_bg}`,
                  color: '#ca8a04',
                  padding: '3px',
                  borderRadius: '2px',
                }}
              />
            }
          />
          <CustomAccordion
            theme={theme}
            text={energyText}
            title="Energy"
            onChange={handleCheckboxChange}
            selectedOptions={selectedOptions}
            icon={
              <FiActivity
                style={{
                  width: '18px',
                  height: '18px',
                  background: `${theme?.palette?.default_card?.icon_bg}`,
                  color: '#16a34a',
                  padding: '3px',
                  borderRadius: '2px',
                }}
              />
            }
          />
          <CustomAccordion
            theme={theme}
            text={text1}
            title="Co2 Emission"
            onChange={handleCheckboxChange}
            selectedOptions={selectedOptions}
            icon={
              <IoLeafOutline
                style={{
                  width: '18px',
                  height: '18px',
                  background: `${theme?.palette?.default_card?.icon_bg}`,
                  color: '#9333ea',
                  padding: '3px',
                  borderRadius: '2px',
                }}
              />
            }
          />
          <CustomAccordion
            theme={theme}
            text={text3}
            title="Data Traffic"
            onChange={handleCheckboxChange}
            selectedOptions={selectedOptions}
            icon={
              <FiDatabase
                style={{
                  width: '18px',
                  height: '18px',
                  background: `${theme?.palette?.default_card?.icon_bg}`,
                  color: '#2563eb',
                  padding: '3px',
                  borderRadius: '2px',
                }}
              />
            }
          />
          <CustomAccordion
            theme={theme}
            text={text4}
            title="Environmental Impact Assessment"
            onChange={handleCheckboxChange}
            selectedOptions={selectedOptions}
            icon={
              <FaChartLine
                style={{
                  width: '18px',
                  height: '18px',
                  background: `${theme?.palette?.default_card?.icon_bg}`,
                  color: '#059669',
                  padding: '3px',
                  borderRadius: '2px',
                }}
              />
            }
          />
        </div>
      </Col>
      <Col xs={24} md={12} style={{ padding: '10px 10px 10px 0px' }}>
        <DropTarget
          selectedOptions={selectedOptions}
          removeItem={removeItem}
          theme={theme}
        />
      </Col>
    </Row>
  );
};

export default SelectOption;
