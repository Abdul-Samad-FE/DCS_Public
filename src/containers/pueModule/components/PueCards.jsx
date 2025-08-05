import React from 'react';
import styled from 'styled-components';
import { IoIosTrendingUp } from 'react-icons/io';
import { useTheme } from '@mui/material';

const Wrapper = styled.div`
  background-color: transparent;
  border-radius: 12px;
  padding: 10px 20px;
  color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme?.palette?.graph?.title};
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Tag = styled.span`
  color: ${(props) => (props.type === 'current' ? '#2268d1' : '#844DCD')};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  margin-bottom: 15px;
`;

// const CardGrid = styled.div`
//   display: flex;
//   gap: ${({ showComparison }) => (showComparison ? '24px' : '0')};
//   margin-bottom: 20px;
//   justify-content: center;
// `;

// const Column = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: ${({ showComparison }) => (showComparison ? '100%' : '70%')};
//   gap: ${({ showComparison }) => (showComparison ? '30px' : '30px')};
//   align-items: center;
// `;
// const Card = styled.div`
//   //   background-color: ${({ bg }) => bg || '#101c2b'};
//   border: 1px solid #1f2a3b;
//   border-radius: 10px;
//   padding: 12px 16px;
//   width: 100%;
//   max-width: ${({ showComparison }) => (showComparison ? '280px' : '100%')};
//   text-align: center;
// `;
const CardGrid = styled.div`
  display: flex;
  gap: ${({ showComparison }) => (showComparison ? '24px' : '0')};
  // margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ showComparison }) => (showComparison ? '100%' : '70%')};
  gap: 25px;
  align-items: center;

  @media (max-width: 1200px) {
    width: 100%;
    gap: 16px;
  }
`;
const Card = styled.div`
  border: 1px solid #1f2a3b;
  border-radius: 10px;
  padding: 12px 16px;
  width: 100%;
  max-width: ${({ showComparison }) => (showComparison ? '280px' : '100%')};
  text-align: center;
  @media (max-width: 1200px) {
    max-width: 100%;
    width: 90%;
  }
  @media (max-width: 780px) {
    max-width: 100%;
  }
`;
const Count = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: ${({ color }) => color || '#40a9ff'};
`;

const Label = styled.p`
  margin: 4px 0 12px;
  font-size: 16px;
  color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
`;

const SubText = styled.p`
  font-size: 12px;
  color: #3cd856;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding-bottom: 5px;
`;

const PueCards = ({ showComparison = true, currentCards, updatedCards }) => {
  const theme = useTheme();

  return (
    <Wrapper>
      {/* <Header>
        <Title theme={theme}>Traffic-Power Utilization Ratio</Title>
      </Header> */}

      <CardGrid showComparison={showComparison}>
        {/* Current Column */}
        <ColumnWrapper style={{ marginTop: showComparison ? 0 : '38px' }}>
          {showComparison ? (
            <Tag
              type="current"
              style={{
                backgroundColor: `${theme?.mode === 'dark' ? '#4256AE40' : '#EEF2FF'}`,
              }}
            >
              Current
            </Tag>
          ) : (
            ''
          )}
          <Column showComparison={showComparison}>
            {currentCards.map((card) => (
              <Card
                key={card.title}
                showComparison={showComparison}
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: `${theme?.mode === 'dark' ? theme?.palette?.main_layout?.background : '#EEF2FF'}`,
                  //   backgroundColor: `${theme?.mode === 'dark' ? '#101c2b' : '#4256AE40'}`,
                  borderRadius: '7px',
                  paddingBottom: '0px',
                }}
              >
                <Count>{card.value}</Count>
                <Label theme={theme}>{card.title}</Label>
                {/* <SubText>
                  <IoIosTrendingUp /> +12 vs last month
                </SubText> */}
              </Card>
            ))}
          </Column>
        </ColumnWrapper>

        {/* Updated Column */}
        {showComparison && (
          <ColumnWrapper>
            <Tag
              type="updated"
              style={{
                backgroundColor: `${theme?.mode === 'dark' ? '#8518A133' : '#8518A11F'}`,
              }}
            >
              Updated
            </Tag>
            <Column showComparison={showComparison}>
              {updatedCards.map((card) => (
                <Card
                  key={card.title}
                  //   bg="#0f2a1e"
                  showComparison={showComparison}
                  style={{
                    border: `1px solid ${theme?.palette?.default_card?.border}`,
                    backgroundColor: `${theme?.mode === 'dark' ? '#8518A114' : '#EEE4F7'}`,
                    borderRadius: '7px',
                    paddingBottom: '0px',
                  }}
                >
                  <Count color="#844DCD">{card.value}</Count>
                  <Label theme={theme}>{card.title}</Label>
                  {/* <SubText>
                    <IoIosTrendingUp /> +12 vs last month
                  </SubText> */}
                </Card>
              ))}
            </Column>
          </ColumnWrapper>
        )}
      </CardGrid>
    </Wrapper>
  );
};

export default PueCards;
