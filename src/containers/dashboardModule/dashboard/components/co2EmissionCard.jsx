import React, { useEffect, useState } from 'react';
import { Spin, Row, Col } from 'antd';
import { useTheme } from '@mui/material/styles';
import car from '../../../../resources/images/car.png';
import airplane from '../../../../resources/images/airplane.png';
import CustomCard from '../../../../components/customCard.jsx';
import KpiSelector from '../kpiSelector.jsx';
import ApcChart from '../../../../components/apcChart.jsx';
import axiosInstance from '../../../../utils/axios/axiosInstance.js';
import { fetchElectricityMapPiData } from '../../../../store/features/dashboardModule/actions/electricityMapPi.js';
import { baseUrl } from '../../../../utils/axios/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { kpiOptions } from './constants.js';
import { fetchCarbonEmissionData } from '../../../../services/dashboardServices/dashboardServices.js';
import styled from 'styled-components';
import CustomSpin from '../../../../components/CustomSpin.jsx';

const colors = {
  nuclear: '#40C767',
  geothermal: '#de7818',
  biomass: '#DAF7A6',
  // coal: '#3d0f0c',
  coal: '#6568ed',
  // wind: '#5615A2',
  wind: '#E1931E',

  solar: '#FDCF2B',
  hydro: '#DD3C36',
  gas: '#29E5B8',
  oil: '#808080',
  unknown: '#7D3C98',
  battery_discharge: '#28B463',
};

// const CustomSpin = styled(Spin)`
//   .ant-spin-dot-item {
//     background-color: ${(props) =>
//       props?.theme?.palette?.main_layout?.secondary_text};
//   }
// `;
const Co2EmissionCard = ({
  siteId = null,
  colorMap = colors,
  initialOption = '24 hours',
  onResponse = () => {},
  isPue = false,
  spinnerLoading,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [carbonData, setCarbonData] = useState();
  const [piOption, setPiOption] = useState(initialOption);

  // const transformData = (data) => {
  //   if (!data) {
  //     return []; // Return an empty array if no data
  //   }
  //   return Object.entries(data).map(([key, value]) => ({
  //     value,
  //     name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
  //     itemStyle: { color: colorMap[key] },
  //   }));
  // };

  const transformData = (data) => {
    if (!data) {
      return []; // Return an empty array if no data
    }

    return Object.entries(data).map(([key, value]) => {
      let itemColor = colorMap[key];

      // Apply gradient specifically for 'coal' in Purple theme
      if (key === 'coal' && theme?.name?.includes('Purple')) {
        itemColor = {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#791b9c' },
            // { offset: 0.5, color: '#791b9c' },
            { offset: 1, color: '#5454be' },
          ],
        };
      }

      return {
        value,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        itemStyle: { color: itemColor },
      };
    });
  };

  const electricityMapPiData = useSelector(
    (state) => state.electricityMapPiData
  );
  const electricityMapPiModified = transformData(
    electricityMapPiData?.data?.data?.consumption_percentages
  );

  const getCarbonEmissionData = async () => {
    try {
      const response = await fetchCarbonEmissionData(siteId, piOption);
      onResponse();
      setCarbonData(response?.data?.data);
    } catch (error) {
      console.error('Failed to fetch carbon emission data:', error);
    }
  };
  useEffect(() => {
    if (siteId) {
      dispatch(fetchElectricityMapPiData(siteId, piOption));
      getCarbonEmissionData();
    }
  }, [siteId, piOption]);

  return (
    // <Spin spinning={isPue ? spinnerLoading : electricityMapPiData?.loading}>
    <CustomSpin
      spinning={isPue ? spinnerLoading : electricityMapPiData?.loading}
    >
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
          position: 'relative',
          padding: '0 10px 10px 10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <KpiSelector
            emmision="true"
            options={kpiOptions}
            setPiOption={setPiOption}
            value={piOption}
          />
        </div>
        <Row id="em">
          <Col xs={24} lg={7}>
            <div>
              <p
                style={{
                  fontSize: '16px',
                  color: theme?.palette?.main_layout?.primary_text,
                  marginBottom: '0px',
                  marginTop: '0px',
                  fontFamily: 'inter',
                  fontWeight: 500,
                }}
              >
                Emission for {piOption}
              </p>
              <strong
                // style={{

                //   // color: theme?.palette?.main_layout?.secondary_text,
                //   fontSize: '22px',
                // }}
                style={
                  theme?.name?.includes('Purple')
                    ? {
                        background:
                          'linear-gradient(to right,  #9619B5,#6568ed)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '22px',
                      }
                    : {
                        color: theme?.palette?.main_layout?.secondary_text,
                        fontSize: '22px',
                      }
                }
              >
                {carbonData?.carbon_emission} CO2e
              </strong>
              <p
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                  marginBottom: '45px',
                  fontFamily: 'inter',
                }}
              >
                Estimated {piOption} carbon dioxide equivalent <br />
                emissions(based on energy usage).
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  color: '#E4E5E8',
                  marginBottom: '45px',
                  fontFamily: 'inter',
                }}
              >
                <img width="46px" height="46px" src={car} alt="" />
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    color: theme?.palette?.main_layout?.primary_text,
                  }}
                >
                  {carbonData?.carbon_effect_car}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  color: '#E4E5E8',
                  fontFamily: 'inter',
                }}
              >
                <img width="46px" height="46px" src={airplane} alt="" />
                <p
                  style={{
                    marginBottom: '0px',
                    marginTop: '0px',
                    color: theme?.palette?.main_layout?.primary_text,
                  }}
                >
                  {carbonData?.carbon_effect_flight}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <div
              style={{
                marginLeft: '50px',
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
                Energy Mix
              </p>
            </div>
            <div
              style={{
                padding: '0 20px 0px 0px',
              }}
            >
              <ApcChart data={electricityMapPiModified} />
            </div>
          </Col>
          <Col xs={24} lg={7}>
            <div
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                marginBottom: '30px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '5px',
                  marginTop: '0px',
                }}
              >
                Consolidation and Decommissioning:
              </p>
              <p
                style={{
                  fontSize: '12px',
                  marginTop: '0px',
                }}
              >
                • {carbonData?.carbon_solution?.consolidation}
              </p>
            </div>
            <div
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                marginBottom: '30px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '5px',
                }}
              >
                High-Efficiency Power Supplies:
              </p>
              <p
                style={{
                  fontSize: '12px',
                  marginTop: '0px',
                }}
              >
                • {carbonData?.carbon_solution?.high_efficiency}
              </p>
            </div>
            <div
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                marginBottom: '30px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '5px',
                }}
              >
                Plant Trees to Offset Emissions:
              </p>
              <p
                style={{
                  fontSize: '12px',
                  marginTop: '0px',
                }}
              >
                • {carbonData?.carbon_solution?.plant_trees}
              </p>
            </div>
            <div
              style={{
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '5px',
                }}
              >
                Regular Maintenance:
              </p>
              <p
                style={{
                  fontSize: '12px',
                  marginTop: '0px',
                  marginBottom: '0px',
                }}
              >
                • {carbonData?.carbon_solution?.regular_maintenance}
              </p>
            </div>
          </Col>
        </Row>
      </CustomCard>
      {/* </Spin> */}
    </CustomSpin>
  );
};

export default Co2EmissionCard;
