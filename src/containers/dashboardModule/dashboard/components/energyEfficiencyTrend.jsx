import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import CustomCard from '../../../../components/customCard';
import AnomaliesChart from '../../../../components/anomaliesDetectionChart';
import KpiSelector from '../kpiSelector';
import DefaultSelector from '../../../../components/defaultSelector';
import { useTheme } from '@mui/material/styles';
import { fetchTrafficThroughputChartData } from '../../../../store/features/dashboardModule/actions/trafficThroughputAction';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CustomSpin from '../../../../components/CustomSpin';

const EnergyEfficiencyTrend = ({
  detail,
  kpiOptions,
  updatedDevice,
  siteId = null,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [dataTrafficDeviceName, setDataTrafficDeviceName] = useState();
  const [throuputOption, setThrouputOption] = useState('24 hours');

  const trafficThroughputChartData = useSelector(
    (state) => state.trafficThroughPutChartData?.data?.data
  );
  const ttLoader = useSelector(
    (state) => state.trafficThroughPutChartData.loading
  );

  useEffect(() => {
    if (siteId && dataTrafficDeviceName) {
      dispatch(
        fetchTrafficThroughputChartData(
          siteId,
          dataTrafficDeviceName,
          throuputOption
        )
      );
    }
  }, [siteId, dataTrafficDeviceName, throuputOption]);

  useEffect(() => {
    if (updatedDevice && updatedDevice.length > 0) {
      setDataTrafficDeviceName(updatedDevice[0].label);
    }
  }, [updatedDevice]);

  const dataTrafficChange = (value, option) => {
    // setDataTrafficDeviceId(option?.value);
    setDataTrafficDeviceName(option?.children);
  };

  // console.log('MyCode: data traffic::::::::', trafficThroughputChartData);
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

    // &:hover {
    //   background: ${theme?.palette?.main_layout?.secondary_text};
    //   color: ${theme?.palette?.main_layout?.primary_text};
    //   outline: none;
    // }
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
  return (
    <CustomSpin spinning={ttLoader}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          position: 'relative',
          height: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'inter',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: theme?.palette?.main_layout?.primary_text,
              marginBottom: '0px',
              marginTop: '0px',
            }}
          >
            Energy Efficiency Trends Across <br /> Data Traffic
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              gap: '10px',
              marginBottom: '25px',
            }}
          >
            <StyledButton onClick={() => detail('4')}>See Detail</StyledButton>
            {/* <button
              className="button button-animation"
              style={{
                background: 'none',
                border: 'none',
                color: theme?.palette?.main_layout?.secondary_text,
                cursor: 'pointer',
                fontFamily: 'inter',
                width: '100px',
              }}
              onClick={() => detail('4')}
            >
              See Detail
            </button> */}
            <KpiSelector
              options={kpiOptions}
              setThrouputOption={setThrouputOption}
              value={throuputOption}
              throughPut="true"
            />
            {updatedDevice && (
              <DefaultSelector
                options={updatedDevice}
                onChange={dataTrafficChange}
                value={dataTrafficDeviceName}
                allowClear={false}
              />
            )}
          </div>
        </div>

        {trafficThroughputChartData?.length > 0 ? (
          <AnomaliesChart dashboard="true" data={trafficThroughputChartData} />
        ) : (
          <div
            style={{
              color: theme?.palette?.main_layout?.primary_text,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '247px',
            }}
          >
            <p>No data</p>
          </div>
        )}
      </CustomCard>
    </CustomSpin>
  );
};

export default EnergyEfficiencyTrend;
