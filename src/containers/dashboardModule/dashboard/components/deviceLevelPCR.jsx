import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import CustomCard from '../../../../components/customCard.jsx';
import DevicesBarChart from '../../../../components/devicesBarChart.jsx';
import KpiSelector from '../kpiSelector.jsx';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../../../../utils/axios/axiosInstance.js';
import { useNavigate } from 'react-router-dom';
import { Height } from '@mui/icons-material';
import { fetchPcrData } from '../../../../services/dashboardServices/dashboardServices.js';
import CustomSpin from '../../../../components/CustomSpin.jsx';

const DeviceLevelPCR = ({
  siteName,
  kpiOptions,
  siteId = null,
  pcrDeviceName,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [pcrOption, setPcrOption] = useState('24 hours');
  const [loadingPcr, setLoadingPcr] = useState(false);
  const [pcrData, setPcrData] = useState();

  const fetchPcr = async () => {
    setLoadingPcr(true);

    try {
      const response = await fetchPcrData(siteId, pcrOption);
      // axiosInstance.get(
      //   `/sites/sites/all_devices_pcr/${siteId}?duration=${pcrOption}`
      // );
      if (response?.status === 200) {
        // console.log('DDDPPPdata:::::', response);

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
      fetchPcr();
    }
  }, [pcrOption, siteId, pcrDeviceName]);

  return (
    <CustomSpin spinning={loadingPcr}>
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
            Device Level Power Consumption Ratio
          </p>

          <KpiSelector
            options={kpiOptions}
            setPcrOption={setPcrOption}
            value={pcrOption}
            pcr="true"
          />
        </div>
        {pcrData?.length > 0 ? (
          <DevicesBarChart
            data={pcrData}
            pcr="true"
            onClick={(params) => {
              const device_id = params?.data[0];
              navigate('device-pue-detail', {
                state: {
                  device_id,
                  siteId,
                  duration: pcrOption,
                },
              });
            }}
          />
        ) : null}
      </CustomCard>
    </CustomSpin>
  );
};

export default DeviceLevelPCR;
