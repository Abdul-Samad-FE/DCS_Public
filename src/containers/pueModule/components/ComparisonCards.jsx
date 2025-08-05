import React from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';
import { useTheme } from '@mui/material';
import { MdBolt, MdShowChart, MdTrendingUp } from 'react-icons/md';
import { FaTree } from 'react-icons/fa';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';

const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BarWrapper = styled.div`
  background-color: ${({ theme }) => theme?.palette?.slider?.rail};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ComparisonCards = ({
  showComperison,
  currentData = {},
  updatedData = {},
  differenceData = {},
  selectedCurrency,
}) => {
  const theme = useTheme();
  console.log('Diff::::', differenceData);

  const cards = [
    {
      icon: <MdBolt size={20} color="#1890ff" />,
      label: 'Average PUE',
      field: 'pue',
      diffKey: 'pue_percent_change',
      max: 5.0,
    },
    {
      icon: <MdShowChart size={20} color="#17B794" />,
      label: 'Energy Efficiency',
      field: 'eer_per',
      diffKey: 'eer_percent_change',
      max: 100,
      unit: '%',
    },
    {
      icon: <MdTrendingUp size={20} color="#722ed1" />,
      label: 'Cost Estimations',
      field: 'cost_estimation',
      diffKey: 'cost_estimation_percent_change',
      max: 3000,
      unit: selectedCurrency,
    },
    {
      icon: <FaTree color="#52c41a" />,
      label: 'Co2 Emission',
      field: 'co2_em_kg',
      diffKey: 'co2_em_kg_percent_change',
      max: 1000,
      unit: ' kg',
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ margin: '10px 0px' }}>
      {cards.map((card, index) => {
        const current = currentData[card.field] ?? 0;
        const updated = updatedData[card.field] ?? 0;

        // for the progress bar
        const currentPercentage = (current / card.max) * 100;
        const updatedPercentage = (updated / card.max) * 100;

        const diffValue = showComperison && differenceData?.[card.diffKey];
        // const showArrow =
        //   showComperison && typeof diffValue === 'number' && diffValue !== 0;
        // const isImproved = diffValue > 0;
        const showArrow = showComperison && typeof diffValue === 'number';
        const isImproved = diffValue > 0 || diffValue === 0;

        return (
          <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
            <Card
              style={{
                background: theme?.palette?.available_options?.card_bg,
                borderRadius: 8,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {card.icon}
                  <h3
                    style={{
                      fontSize: 14,
                      margin: 0,
                      color: theme?.palette?.main_layout?.primary_text,
                    }}
                  >
                    {card.label}
                  </h3>
                </div>
                {showArrow && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* {diffValue >= 0 ? (
                      <IoIosArrowRoundUp style={{ color: 'green' }} size={20} />
                    ) : (
                      <IoIosArrowRoundDown style={{ color: 'red' }} size={20} />
                    )} */}
                    {/* {card?.field === 'eer_per' ? (
                      diffValue >= 0 ? (
                        <IoIosArrowRoundUp
                          style={{ color: 'green' }}
                          size={20}
                        />
                      ) : (
                        <IoIosArrowRoundDown
                          style={{ color: 'red' }}
                          size={20}
                        />
                      )
                    ) : diffValue >= 0 ? (
                      <IoIosArrowRoundDown style={{ color: 'red' }} size={20} />
                    ) : (
                      <IoIosArrowRoundUp style={{ color: 'green' }} size={20} />
                    )} */}
                    <span
                      // style={{
                      //   color: diffValue >= 0 ? 'green' : 'red',
                      //   fontSize: '13px',
                      // }}
                      style={{
                        color:
                          card?.field == 'eer_per'
                            ? diffValue === 0
                              ? 'blue'
                              : diffValue > 0
                                ? 'green'
                                : 'red'
                            : diffValue == 0
                              ? 'blue'
                              : diffValue > 0
                                ? 'red'
                                : 'green',
                        fontSize: '13px',
                      }}
                    >
                      {Math.abs(diffValue)}%
                    </span>
                  </div>
                )}
                {/* {showArrow ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isImproved ? (
                      <IoIosArrowRoundUp style={{ color: 'green' }} size={20} />
                    ) : (
                      <IoIosArrowRoundDown style={{ color: 'red' }} size={20} />
                    )}
                    <span
                      style={{
                        color: isImproved ? 'green' : 'red',
                        fontSize: '13px',
                      }}
                    >
                      {Math.abs(diffValue)}%
                    </span>
                  </div>
                ) : (
                  <div />

                )} */}
              </div>

              <ProgressBarContainer>
                {/* Current */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginBottom: 10,
                      color: theme?.palette?.default_card?.color,
                    }}
                  >
                    <span>
                      Current{' '}
                      {card.label === 'Average PUE' &&
                        currentData?.pue_evaluation && (
                          <span
                            style={{
                              fontWeight: 500,
                              color:
                                currentData?.pue_evaluation === 'Efficient'
                                  ? 'green'
                                  : currentData?.pue_evaluation ===
                                      'Inefficient'
                                    ? 'red'
                                    : 'blue',
                            }}
                          >
                            ({currentData?.pue_evaluation})
                          </span>
                        )}
                      {card.label === 'Energy Efficiency' &&
                        currentData?.eer_evaluation && (
                          <span
                            style={{
                              fontWeight: 500,
                              color:
                                currentData?.eer_evaluation === 'Efficient'
                                  ? 'green'
                                  : currentData?.eer_evaluation ===
                                      'Inefficient'
                                    ? 'red'
                                    : 'blue',
                            }}
                          >
                            ({currentData?.eer_evaluation})
                          </span>
                        )}
                    </span>
                    <span>
                      {current} {card.unit || ''}
                    </span>
                  </div>
                  <BarWrapper theme={theme}>
                    <Bar
                      style={{
                        width: `${currentPercentage}%`,
                        backgroundColor: '#1890ff',
                      }}
                    />
                  </BarWrapper>
                </div>

                {/* Updated */}
                {showComperison && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        marginBottom: 10,
                        color: theme?.palette?.default_card?.color,
                      }}
                    >
                      <span>
                        Updated{' '}
                        {card.label === 'Average PUE' &&
                          updatedData?.pue_evaluation && (
                            <span
                              style={{
                                fontWeight: 500,
                                color:
                                  updatedData?.pue_evaluation === 'Efficient'
                                    ? 'green'
                                    : updatedData?.pue_evaluation ===
                                        'Inefficient'
                                      ? 'red'
                                      : 'blue',
                              }}
                            >
                              ({updatedData?.pue_evaluation})
                            </span>
                          )}
                        {card.label === 'Energy Efficiency' &&
                          updatedData?.eer_evaluation && (
                            <span
                              style={{
                                fontWeight: 500,
                                color:
                                  updatedData?.eer_evaluation === 'Efficient'
                                    ? 'green'
                                    : updatedData?.eer_evaluation ===
                                        'Inefficient'
                                      ? 'red'
                                      : 'blue',
                              }}
                            >
                              ({updatedData?.eer_evaluation})
                            </span>
                          )}
                      </span>
                      <span>
                        {updated} {card.unit || ''}
                      </span>
                    </div>
                    <BarWrapper theme={theme}>
                      <Bar
                        style={{
                          width: `${updatedPercentage}%`,
                          backgroundColor: '#844DCD',
                        }}
                      />
                    </BarWrapper>
                  </div>
                )}
              </ProgressBarContainer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ComparisonCards;
