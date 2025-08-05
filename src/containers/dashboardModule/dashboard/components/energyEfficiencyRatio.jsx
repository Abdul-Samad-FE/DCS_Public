import React from 'react';
import { Spin } from 'antd';
import CustomCard from '../../../../components/customCard.jsx';
import ThreshholdAlerts from '../../../../components/threshholdAlerts.jsx';
import { useTheme } from '@mui/material/styles';
import KpiSelector from '../kpiSelector.jsx';
import DefaultSelector from '../../../../components/defaultSelector.jsx';
import { useSelector } from 'react-redux';
import CustomSpin from '../../../../components/CustomSpin.jsx';

const EnergyEfficiencyRatio = ({
  loading,
  threshholdDeviceName,
  kpiOptions,
  setThreshholdOption,
  threshholdOption,
  handleChangeThreshholddevice,
  threshholdData,
  siteId,
  threshholdDeviceId,
  siteName,
}) => {
  const theme = useTheme();

  const devices = useSelector((state) => state.devices?.data?.data);

  const updatedDevice = devices?.map((item) => {
    return {
      label: item?.device_name,
      value: item?.id,
    };
  });
  return (
    <CustomSpin spinning={loading}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          // position: 'relative',
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
            <span
              style={{
                color: theme?.palette?.main_layout?.secondary_text,
              }}
            >
              {threshholdDeviceName}{' '}
            </span>
            Energy Efficiency Ratio
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              gap: '10px',
              marginBottom: '0px',
            }}
          >
            <KpiSelector
              options={kpiOptions}
              setThreshholdOption={setThreshholdOption}
              value={threshholdOption}
              threshhold="true"
            />

            <DefaultSelector
              options={updatedDevice}
              onChange={handleChangeThreshholddevice}
              value={threshholdDeviceName}
            />
          </div>
        </div>
        {threshholdData?.length > 0 ? (
          <ThreshholdAlerts
            data={threshholdData}
            siteId={siteId}
            threshholdDeviceId={threshholdDeviceId}
            siteName={siteName}
            deviceName={threshholdDeviceName}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '271px',
            }}
          >
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              No data
            </p>
          </div>
        )}
      </CustomCard>
    </CustomSpin>
  );
};

export default EnergyEfficiencyRatio;
