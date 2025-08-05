import React from 'react';
import { Spin } from 'antd';
import CustomCard from '../../../../components/customCard';
import DeviceSpecificConsuptionChart from '../../../../components/deviceSpecificPConsumption';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CustomSpin from '../../../../components/CustomSpin';

const PowerConsumptionAnalysis = ({ siteId, loading = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const deviceSpecificChartData = useSelector(
    (state) => state.deviceSpecificData?.data
  );

  const comparison = () => {
    navigate(`device-specific-comparison`, {
      state: {
        siteId,
      },
    });
  };

  // mycode:
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

    &:hover {
      background: ${theme?.name?.includes('Purple')
        ? 'linear-gradient(to right, #791b9c, #5454be)'
        : theme?.palette?.main_layout?.secondary_text};
      color: ${theme?.name?.includes('Purple')
        ? `${theme?.palette?.default_button?.primary_text}`
        : `${theme?.palette?.main_layout?.primary_text}`};
      outline: none;
    }
    // &:hover {
    //   background: ${theme?.palette?.main_layout?.secondary_text};
    //   color: ${theme?.palette?.main_layout?.primary_text};
    //   outline: none;
    // }
    // &:active {
    //   border: 2px solid ${theme?.palette?.main_layout?.secondary_text};
    //   color: ${theme?.palette?.main_layout?.secondary_text};
    // }
  `;
  return (
    <CustomSpin spinning={loading}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Device-Specific Power Consumption Analysis
          </p>

          {/* <button
            className="button button-animation"
            style={{
              background: 'none',
              border: 'none',
              color: theme?.palette?.main_layout?.secondary_text,
              cursor: 'pointer',
              fontFamily: 'inter',
            }}
            onClick={comparison}
          >
            Compare
          </button> */}
          <StyledButton onClick={comparison}>Compare</StyledButton>
        </div>
        {deviceSpecificChartData ? (
          <DeviceSpecificConsuptionChart
            deviceSpecificChartData={deviceSpecificChartData}
            dashboard="true"
          />
        ) : (
          <div
            style={{
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '271px',
            }}
          >
            <p>No data</p>
          </div>
        )}
      </CustomCard>
    </CustomSpin>
  );
};

export default PowerConsumptionAnalysis;
