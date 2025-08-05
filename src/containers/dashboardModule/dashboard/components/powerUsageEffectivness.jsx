import React from 'react';
import { Spin } from 'antd';
import CustomCard from 'path-to-custom-card';
import KpiSelector from 'path-to-kpi-selector';
import DefaultSelector from 'path-to-default-selector';
import AntdTooltip from 'path-to-antd-tooltip';
import SummaryMetricsBarChart from 'path-to-summary-metrics-bar-chart';

const PowerUsageEffectiveness = ({
  theme,
  loadingPueD,
  pueDeviceName,
  kpiOptions,
  setPueOption2,
  pueOption2,
  updatedDevice,
  handleChangePueDevice,
  detail,
  pueDeviceId,
  siteName,
  pueData,
  pueData2,
  navigate,
}) => {
  return (
    <Spin spinning={loadingPueD}>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
          borderRadius: '7px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: theme?.palette?.main_layout?.primary_text,
              marginBottom: '0px',
              marginTop: '0px',
              fontWeight: 500,
              fontFamily: 'inter',
            }}
          >
            <span
              style={{
                color: theme?.palette?.main_layout?.secondary_text,
              }}
            >
              {pueDeviceName}{' '}
            </span>
            Power Usage Effectiveness
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <KpiSelector
              options={kpiOptions}
              setPueOption2={setPueOption2}
              value={pueOption2}
              pueDevice="true"
            />

            <DefaultSelector
              options={updatedDevice}
              onChange={handleChangePueDevice}
              value={pueDeviceName}
            />
            <button
              className="button button-animation"
              style={{
                background: 'none',
                border: 'none',
                color: theme?.palette?.main_layout?.secondary_text,
                cursor: 'pointer',
                fontFamily: 'inter',
                fontSize: '12px',
              }}
              onClick={() => detail('5', pueOption2, pueDeviceId)}
            >
              See Detail
            </button>
          </div>
        </div>

        <AntdTooltip
          title={
            <div
              style={{
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div
                style={{
                  borderBottom: '1px solid #36424E',
                }}
              >
                <p>
                  Site Name:{' '}
                  <span
                    style={{
                      color: `${theme?.palette?.main_layout?.primary_text}`,
                    }}
                  >
                    {siteName}
                  </span>
                </p>
                <p>
                  Device Name:{' '}
                  <span
                    style={{
                      color: `${theme?.palette?.main_layout?.primary_text}`,
                    }}
                  >
                    {pueDeviceName}
                  </span>
                </p>
                <p>
                  Power Usage Effectiveness: {pueData?.power_efficiency}{' '}
                  <span
                    style={{
                      color:
                        pueData2?.power_efficiency >= 0.5 &&
                        pueData2?.power_efficiency <= 1
                          ? 'green'
                          : pueData2?.power_efficiency > 1 &&
                              pueData2?.power_efficiency <= 1.5
                            ? // ? '#0490E7'
                              `${theme?.palette?.main_layout?.primary_text}`
                            : 'red',
                    }}
                  >
                    (
                    {pueData2?.power_efficiency >= 0.5 &&
                    pueData2?.power_efficiency <= 1
                      ? 'efficient'
                      : pueData2?.power_efficiency > 1 &&
                          pueData2?.power_efficiency <= 1.5
                        ? 'moderately efficient'
                        : 'inefficient'}
                    )
                  </span>
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                }}
              >
                <div>
                  <p>0.5 - 1 (Efficient )</p>
                  <p>1.5 - above (Inefficient)</p>
                </div>
                <p>1 - 1.5 ( Modeately Efficient )</p>
              </div>
            </div>
          }
          overlayInnerStyle={{
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
            width: '350px',
            padding: '20px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginTop: '32px',
              marginBottom: '0',
            }}
          >
            <SummaryMetricsBarChart
              pueData={pueData}
              pue="true"
              dashboard="true"
            />
          </div>
        </AntdTooltip>
        <AntdTooltip
          title={
            <div>
              <div
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                }}
              >
                The Power Usage Effectiveness (PUE) measures overall energy
                efficiency in data centers, calculated as the ratio of total
                power input to useful power output.
                <span
                  style={{
                    color: '#2268D1',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate('/main_layout/about', {
                      state: {
                        title: 'pue',
                      },
                    })
                  }
                >
                  see details
                </span>
              </div>
            </div>
          }
          overlayInnerStyle={{
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
            width: '300px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '-27px',
              cursor: 'default',
            }}
          >
            <p
              style={{
                width: '13px',
                height: '13px',
                background: theme?.palette?.graph?.graph_area?.line,
                borderRadius: '100%',
              }}
            ></p>
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: '13px',
              }}
            >
              Power Usage Effectiveness
            </p>
          </div>
        </AntdTooltip>
      </CustomCard>
    </Spin>
  );
};

export default PowerUsageEffectiveness;
