import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import CustomCard from '../../../../components/customCard.jsx';
import KpiSelector from '../kpiSelector.jsx';
import DevicesBarChart from '../../../../components/devicesBarChart.jsx';
import { useTheme } from '@mui/material/styles';
// import { fetchDevicesCarbonEmission } from '../services/services.js';
import { useNavigate } from 'react-router-dom';
import { fetchDevicesCarbonEmission } from '../../../../services/dashboardServices/dashboardServices.js';
import CustomSpin from '../../../../components/CustomSpin.jsx';

const DeviceLevelCO2 = ({ siteName, kpiOptions, siteId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  console.log('site:', siteName);

  const [deviceCarbonEmiisionOption, setDeviceCarbonEmiisionOption] =
    useState('24 hours');
  const [carbonEmissionDevices, setCarbonEmissionDevices] = useState();
  const [loadingCarbonE, setLoadingCarbonE] = useState(false);

  const devicesCarbonEmission = async () => {
    setLoadingCarbonE(true);

    try {
      const data = await fetchDevicesCarbonEmission(
        siteId,
        deviceCarbonEmiisionOption
      );
      // console.log('FFDD', data);

      if (data) {
        setCarbonEmissionDevices(data);
        // console.log('device Level Data', data);
      } else {
        setCarbonEmissionDevices([]);
      }
    } catch (error) {
      setCarbonEmissionDevices([]);
      console.error('Failed to fetch carbon emission data:', error);
    } finally {
      setLoadingCarbonE(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      devicesCarbonEmission();
    }
  }, [siteId, deviceCarbonEmiisionOption]);

  return (
    <CustomSpin spinning={loadingCarbonE}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          position: 'relative',
          padding: '0px',
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
              marginBottom: '30px',
              marginTop: '0px',
            }}
          >
            <span
              style={{
                color: theme?.palette?.main_layout?.secondary_text,
              }}
            >
              {siteName}{' '}
            </span>
            Device Level Carbon Emission
          </p>
          <KpiSelector
            options={kpiOptions}
            setDeviceCarbonEmiisionOption={setDeviceCarbonEmiisionOption}
            value={deviceCarbonEmiisionOption}
            deviceCarbonEmission="true"
          />
        </div>
        {carbonEmissionDevices?.length > 0 ? (
          <DevicesBarChart
            data={carbonEmissionDevices}
            onClick={(params) => {
              const device_id = params?.data[0];
              const time = params.name;
              navigate('device-co2-detail', {
                state: {
                  device_id,
                  siteId,
                  time,
                  duration: deviceCarbonEmiisionOption,
                },
              });
            }}
          />
        ) : null}
      </CustomCard>
    </CustomSpin>
  );
};

export default DeviceLevelCO2;
