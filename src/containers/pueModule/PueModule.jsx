import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Col,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Tabs,
  Tooltip,
} from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import DefaultCard from '../../components/cards';
import DetailCards from '../dashboardModule/dashboard/detailCards';
import { useTheme } from '@mui/material';
import SiteEnergyEfficiencyRatio from '../dashboardModule/dashboard/components/siteEnergyEfficiencyRatio';
import { fetchAverageEnergyConsumptionMetrics } from '../../services/dashboardServices/dashboardServices';
import KpiSelector from '../dashboardModule/dashboard/kpiSelector';
import SummaryMetricsBarChart from '../../components/summaryMetrics';
import CustomCard from '../../components/customCard';
import Co2EmissionCard from '../dashboardModule/dashboard/components/co2EmissionCard';
import Top5DevicesTable from '../dashboardModule/dashboard/components/top5Devices';
import CustomSpin from '../../components/CustomSpin';
import DefaultSelector from '../../components/defaultSelector';
import { CustomInput } from '../../components/customInput';
import { Height } from '@mui/icons-material';
import CustomSlider from '../../components/CustomSlider';
import { fetchSiteNames } from '../../services/services';
import { AppContext } from '../../context/appContext';
import PowerTrendChart from './components/PowerTrendChart';
import CostEstimation from './components/CostEstimation';
import {
  FaArrowAltCircleLeft,
  FaCaretDown,
  FaCaretUp,
  FaChevronDown,
  FaFileExport,
} from 'react-icons/fa';
import { FaCodeCompare } from 'react-icons/fa6';
import ComparisonCards from './components/ComparisonCards';
import TrafficUtilizationChart from './components/TrafficUtilizationChart';
import PueCards from './components/PueCards';
import { duration } from 'moment';
import { fetchPueCalculatorData } from '../../services/pueCalculatorModule/pueServices';
import { setOptions } from 'leaflet';
import { AiOutlineExport } from 'react-icons/ai';
import { MdOutlineCompareArrows } from 'react-icons/md';
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

const ThemedSlider = styled(Slider)`
  .ant-slider-track {
    background-color: ${({ theme }) =>
      theme?.palette?.main_layout?.secondary_text || '#1890ff'} !important;
  }

  .ant-slider-rail {
    background-color: ${({ theme }) =>
      theme?.palette?.available_options
        ?.border_bottom} !important; // Optional: unfilled part styling
  }

  .ant-slider-handle {
    background-color: ${({ theme }) =>
      theme?.palette?.main_layout?.secondary_text} !important;
    border-color: ${({ theme }) =>
      theme?.palette?.main_layout?.secondary_text} !important;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px
      ${({ theme }) => theme?.palette?.main_layout?.secondary_text} !important;
    margin-top: -2.5px; /* vertically center the smaller handle */
  }

  .ant-slider-handle::before,
  .ant-slider-handle::after {
    display: none !important; /* remove extra focus rings if undesired */
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    // flex-direction: column;
  }
`;

const TabCard = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    width: 40%;
  }
`;
const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme?.palette?.main_layout?.secondary_text};
  height: 100% !important;
  width: auto;
  min-width: 48px; /* You can tweak this */
  flex: 0 0 auto; /* Don't grow or shrink */
  border: none;
  padding: 8px 12px !important;
  border-radius: 4px;
  color: #fff;
  outline: none !important;
  box-sizing: border-box !important;
`;

const TabIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme?.palette?.default_select?.background};
  border: 1px solid ${({ theme }) => theme?.palette?.default_card?.border};
  padding: 0px 4px;
  margin-top: 30px;
  border-radius: 6px;
  flex: 0 0 auto;
  min-width: 48px;
  height: auto;

  @media (max-width: 768px) {
    width: 96%;
    margin: 0px auto;
  }
`;
const LabeledInputWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 13px;
    font-weight: 500;
    padding-left: 2px;
    color: #7f7f7f;
  }

  .input-wrapper {
    border: ${({ theme, currency, site, duration }) =>
      currency || site || duration
        ? `none`
        : `1px solid ${theme?.palette?.default_input?.border}`} !important;

    border-radius: 6px;

    background-color: transparent;
  }

  .input-row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
  }

  .selector-wrapper {
    position: relative;
    flex-shrink: 0;
  }
`;

const TaglineSection = styled.div`
  display: flex;
  // justify-content: space-between;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 10px 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TaglineText = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  margin: 0;

  font-size: 16px;

  @media (max-width: 1024px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    text-align: center;
    width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    text-align: center;
    width: 100%;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: ${({ theme }) =>
      theme?.palette?.main_layout?.background} !important;
    color: ${({ theme }) =>
      theme?.palette?.main_layout?.primary_text} !important;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme?.palette?.default_card?.border};
  }

  .ant-modal-header {
    background-color: ${({ theme }) =>
      theme?.palette?.main_layout?.background} !important;
    border-bottom: none;
  }

  .ant-modal-title {
    color: red;
    text-align: center;
    font-weight: bold;
  }

  .ant-modal-footer {
    background-color: ${({ theme }) =>
      theme?.palette?.main_layout?.background} !important;
    border-top: none;
    display: flex;
    justify-content: center;
  }
  .ant-modal-close {
    color: red; /* ✅ red close button */
  }

  .ant-modal-close:hover {
    color: #ff4d4f; /* a brighter red on hover (optional) */
  }
`;

const kpiOptions = [
  {
    value: '24 hours',
    label: '24 hours',
  },
  {
    value: '7 Days',
    label: '7 Days',
  },

  {
    value: 'Last Month',
    label: 'Last Month',
  },
  {
    value: 'Current Month',
    label: 'Current Month',
  },
  { value: 'First Quarter', label: 'First Quarter' },
  { value: 'Second Quarter', label: 'Second Quarter' },
  { value: 'Third Quarter', label: 'Third Quarter' },
  {
    value: 'Last 3 Months',
    label: 'Last 3 Months',
  },
  {
    value: 'Last 6 Months',
    label: 'Last 6 Months',
  },
  {
    value: 'Last 9 Months',
    label: 'Last 9 Months',
  },
  {
    value: 'Last Year',
    label: 'Last Year',
  },
  {
    value: 'Current Year',
    label: 'Current Year',
  },
];
// selectors Wrapper:

const currencyOptions = [
  { label: 'AED', value: 'AED' },
  { label: 'USD', value: 'USD' },
  { label: 'PKR', value: 'PKR' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
];

function PueModule() {
  const theme = useTheme();
  const [isCurrencyChange, setIsCurrencyChange] = useState(false);
  const [lockedCurrency, setLockedCurrency] = useState(
    currencyOptions[0].value
  );
  // const [pueOption, setPueOption] = useState('24 hours');
  const [currentData, setCurrentData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [differenceData, setDifferenceData] = useState(null);
  const [conclusion, setConclusion] = useState('');
  const [pueLoading, setPueLoading] = useState(false);
  const [siteOptions, setSitesOptions] = useState([]);
  const [calculate, setCalculate] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formState, setFormState] = useState({
    siteId: 1,
    siteName: '',
    duration: '24 hours',
    rangeValue: 0,
    co2Emission: 0,
    powerInput: 0,
    powerOutput: 0,
    costInput: 0,
    currency: 'AED',
  });

  const [sercondaryOptions, setSecondaryOption] = useState(false);
  const [showComperison, setShowComperison] = useState(false);
  const [inputError, setInputError] = useState('');

  // const getPueData = async (isCalculate = false, isComparisonMode = false) => {
  //   setPueLoading(true);

  //   const payload = isCalculate
  //     ? {
  //         site_id: formState.siteId,
  //         duration: formState.duration,
  //         pue: formState.rangeValue,
  //         co_em_factor: formState.co2Emission,
  //         input_power_kw: formState.powerInput,
  //         output_power_kw: formState.powerOutput,
  //         cost_factor: formState.costInput,
  //         cost_unit: formState.currency,
  //       }
  //     : {
  //         site_id: formState.siteId,
  //         duration: formState.duration,
  //       };

  //   try {
  //     const res = await fetchPueCalculatorData(payload);

  //     if (res?.status === 200) {
  //       const { updated, current, difference_percent, conclusion } =
  //         res?.data?.data;
  //       setConclusion(conclusion);
  //       if (!isCalculate) {
  //         // Case 1: Initial load
  //         setFormState({
  //           ...formState,
  //           rangeValue: current?.pue,
  //           powerInput: current?.input_power_kw || 0,
  //           powerOutput: current?.output_power_kw || 0,
  //           co2Emission: current?.co_em_factor || 0,
  //           costInput: current?.cost_factor || 0,
  //         });

  //         setCurrentData(current);
  //         setUpdatedData(null);
  //       } else if (isCalculate && !isComparisonMode) {
  //         // Case 2: Only calculate, no comparison
  //         setFormState({
  //           ...formState,
  //           rangeValue: updated?.pue,
  //           powerInput: updated?.input_power_kw || 0,
  //           powerOutput: updated?.output_power_kw || 0,
  //           co2Emission: updated?.co_em_factor || 0,
  //           costInput: updated?.cost_factor || 0,
  //         });
  //         setCurrentData(current);
  //         // setUpdatedData(null);
  //         // setConclusion(conclusion);
  //       } else if (isCalculate && isComparisonMode) {
  //         // Case 3: Compare mode
  //         setFormState({
  //           ...formState,
  //           rangeValue: updated?.pue,
  //           powerInput: updated?.input_power_kw || 0,
  //           powerOutput: updated?.output_power_kw || 0,
  //           co2Emission: updated?.co_em_factor || 0,
  //           costInput: updated?.cost_factor || 0,
  //         });
  //         setCurrentData(current);
  //         setUpdatedData(updated);
  //         setDifferenceData(difference_percent);
  //       }
  //     }
  //   } catch (err) {
  //     console.error('PUE fetch error:', err);
  //   } finally {
  //     setPueLoading(false);
  //   }
  // };

  const getPueDataForCalculation = async (changedPayload = {}) => {
    setPueLoading(true);

    const payload = {
      site_id: formState.siteId,
      duration: formState.duration,
      ...changedPayload,
    };
    // const payload = {
    //   site_id: formState.siteId,
    //   duration: formState.duration,
    //   // Map rangeValue to correct key if needed:
    //   ...(changedPayload.rangeValue !== undefined
    //     ? { pue: changedPayload.rangeValue }
    //     : {}),
    // };

    try {
      const res = await fetchPueCalculatorData(payload);

      if (res?.status === 200) {
        const dataError = res?.data?.data?.error_message;
        if (dataError) {
          setErrorMessage(dataError);
          setErrorVisible(true);
        }
        const { current, conclusion } = res.data.data;
        console.log('ERRR:::', res?.data?.data?.error_message);
        setConclusion(conclusion);
        setCurrentData(current);
        setUpdatedData(null);
        setDifferenceData(null);

        // Optional: pre-fill form with returned current data
        setFormState((prev) => ({
          ...prev,
          rangeValue: current?.pue ?? prev.rangeValue,
          powerInput: current?.input_power_kw ?? prev.powerInput,
          powerOutput: current?.output_power_kw ?? prev.powerOutput,
          co2Emission: current?.co_em_factor ?? prev.co2Emission,
          costInput: current?.cost_factor ?? prev.costInput,
        }));
      }
    } catch (err) {
      console.error('Calculation fetch error:', err);
    } finally {
      setPueLoading(false);
    }
  };

  const getPueDataForComparison = async (changedPayload = {}) => {
    setPueLoading(true);

    // const payload = {
    //   site_id: formState.siteId,
    //   duration: formState.duration,
    //   comparison: 1,

    //   ...changedPayload,
    // };
    const isChangedPayloadEmpty = Object.keys(changedPayload).length === 0;
    const payload = {
      site_id: formState.siteId,
      duration: formState.duration,
      comparison: 1,
      ...(isChangedPayloadEmpty
        ? {
            pue: formState.rangeValue,
            co_em_factor: formState.co2Emission,
            input_power_kw: formState.powerInput,
            output_power_kw: formState.powerOutput,
            cost_factor: formState.costInput,
            cost_unit: formState.currency,
          }
        : changedPayload),
    };

    try {
      const res = await fetchPueCalculatorData(payload);

      if (res?.status === 200) {
        const dataError = res?.data?.data?.error_message;
        if (dataError) {
          setErrorMessage(dataError);
          setErrorVisible(true);
        }
        const { current, updated, difference_percent, conclusion } =
          res.data.data;

        // setConclusion(conclusion);
        setCurrentData(current);
        setUpdatedData(updated);
        setDifferenceData(difference_percent);
        if (conclusion) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            // icon: 'success',
            title: `<span style="font-weight: 300">${conclusion}</span>`,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,

            didOpen: (toast) => {
              Object.assign(toast.style, {
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              });
            },
          });
        }
      }
    } catch (err) {
      console.error('Comparison fetch error:', err);
    } finally {
      setPueLoading(false);
    }
  };

  const handleChange = (value) => {
    const selectedSite = siteOptions?.find((site) => site.value === value);
    setFormState({
      ...formState,
      siteId: selectedSite?.value,
      siteName: selectedSite?.label,
    });
  };
  const siteNames = async () => {
    try {
      const sitesss = await fetchSiteNames();
      const optiondata = sitesss?.map((item) => {
        return {
          label: item?.site_name,
          value: item?.id,
        };
      });
      setSitesOptions(optiondata);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (showComperison) {
      setShowComperison(false);
    }
    siteNames(); // This just sets `sites`
  }, []);

  useEffect(() => {
    if (siteOptions?.length) {
      const siteDate = siteOptions?.[0];
      setFormState({ ...formState, siteName: siteDate?.label });
    }
  }, [siteOptions]);

  useEffect(() => {
    if (!formState.siteId || !formState.duration) return;

    // if (showComperison) {
    //   getPueDataForComparison();
    // } else {
    if (showComperison) {
      setShowComperison(false);
    }
    getPueDataForCalculation(); // No changedPayload — sends only site_id and duration
    // setCalculate(true);
    setIsCurrencyChange(true);
    setLockedCurrency(formState.currency);
    // }
  }, [formState?.siteId, formState?.duration]);

  const handlePueChange = (value) => {
    setFormState({ ...formState, duration: value });
  };

  const handleCurrencyChange = (value) => {
    setFormState({ ...formState, currency: value });
  };

  return (
    <div style={{ padding: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {' '}
        <TabCard theme={theme} style={{ flex: '0', minWidth: 'auto' }}>
          <LabeledInputWrapper theme={theme} site duration>
            <div className="label">Select Site</div>
            <div className="input-wrapper">
              <DefaultSelector
                options={siteOptions}
                onChange={handleChange}
                value={formState.siteId}
              />
            </div>
          </LabeledInputWrapper>
        </TabCard>
        <TabCard theme={theme} style={{ flex: '0', minWidth: '150px' }}>
          <LabeledInputWrapper theme={theme} site duration>
            <div className="label">Select Duration</div>
            <div className="input-wrapper">
              <KpiSelector
                options={kpiOptions}
                value={formState?.duration}
                onChangePue={handlePueChange}
                pue="true"

                // report
              />
            </div>
          </LabeledInputWrapper>
        </TabCard>
      </div>
      <CustomSpin theme={theme} spinning={pueLoading}>
        <div
          style={{
            padding: '10px',
            margin: '10px',
            border: `1px solid ${theme?.palette?.available_options?.border}`,
            background: theme?.palette?.default_card?.background,

            borderRadius: '8px',
          }}
        >
          {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {' '}
          <TabCard theme={theme} style={{ flex: '0' }}>
            <LabeledInputWrapper theme={theme} site duration>
              <div className="label">Select Site</div>
              <div className="input-wrapper">
                <DefaultSelector
                  options={siteOptions}
                  onChange={handleChange}
                  value={formState.siteId}
                  width="100%"
                  height="40px"
                />
              </div>
            </LabeledInputWrapper>
          </TabCard>
          <TabCard theme={theme} style={{ flex: '0' }}>
            <LabeledInputWrapper theme={theme} site duration>
              <div className="label">Select Duration</div>
              <div className="input-wrapper">
                <KpiSelector
                  options={kpiOptions}
                  value={formState?.duration}
                  onChangePue={handlePueChange}
                  pue="true"

                  // report
                />
              </div>
            </LabeledInputWrapper>
          </TabCard>
        </div> */}
          <TabsWrapper>
            {/* old sites */}

            {/* <TabCard theme={theme}>
            <LabeledInputWrapper theme={theme} site duration>
              <div className="label">Select Site</div>
              <div className="input-wrapper">
                <DefaultSelector
                  options={siteOptions}
                  onChange={handleChange}
                  value={formState.siteId}
                  width="100%"
                  height="40px"
                />
              </div>
            </LabeledInputWrapper>
          </TabCard>

         
          <TabCard theme={theme}>
            <LabeledInputWrapper theme={theme} site duration>
              <div className="label">Select Duration</div>
              <div className="input-wrapper">
                <KpiSelector
                  options={kpiOptions}
                  value={formState?.duration}
                  onChangePue={handlePueChange}
                  pue="true"

                  // report
                />
              </div>
            </LabeledInputWrapper>
          </TabCard> */}

            <TabCard theme={theme}>
              <LabeledInputWrapper theme={theme}>
                <div className="label">PUE </div>
                <div
                  className="input-wrapper"
                  style={{
                    background: theme?.palette?.default_input?.background,
                  }}
                >
                  <CustomSlider
                    value={formState.rangeValue}
                    // onChange={(val) =>
                    //   setFormState({ ...formState, rangeValue: val })
                    // }
                    disabled={pueLoading}
                    onChange={(val) => {
                      setFormState((prev) => ({ ...prev, rangeValue: val }));
                      // getPueDataForCalculation({ rangeValue: val });
                    }}
                  />
                </div>
              </LabeledInputWrapper>
            </TabCard>
            <TabCard theme={theme}>
              <LabeledInputWrapper theme={theme}>
                <div className="label" style={{ left: '50%' }}>
                  CO2 Emission Factor (kg CO₂/kWh)
                </div>
                <div className="input-row">
                  <div className="input-wrapper" style={{ flex: '1' }}>
                    <Tooltip
                      placement="top"
                      title="Based on 0.4041 kg CO₂/kWh — typical for UAE grid mix"
                      overlayInnerStyle={{
                        backgroundColor:
                          theme?.palette?.main_layout?.primary_text, // custom background color
                        color: theme?.mode === 'dark' ? 'black' : 'white',
                        fontSize: '12px',
                        fontFamily: 'Inter',
                      }}
                    >
                      <CustomInput
                        type="number"
                        value={formState?.co2Emission}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            co2Emission: e.target.value,
                          })
                        }
                        placeholder="Enter Co2 Emission "
                        pueMode={true}
                      />
                    </Tooltip>
                  </div>
                </div>
              </LabeledInputWrapper>
            </TabCard>
            <TabCard theme={theme}>
              <LabeledInputWrapper theme={theme} currency={true}>
                <div className="label">Estimation Cost</div>
                <Tooltip
                  placement="top"
                  title="Based on 0.37 AED/kWh for UAE region"
                  overlayInnerStyle={{
                    backgroundColor: theme?.palette?.main_layout?.primary_text, // custom background color
                    color: theme?.mode === 'dark' ? 'black' : 'white',
                    fontSize: '12px',
                    fontFamily: 'Inter',
                  }}
                >
                  <div
                    className="input-row"
                    style={{
                      background: theme?.palette?.default_input?.background,
                      alignItems: 'self-start',
                      border: `1px solid ${theme?.palette?.default_card?.border}`,
                      borderRadius: '4PX',
                    }}
                  >
                    <div className="selector-wrapper">
                      <KpiSelector
                        options={currencyOptions}
                        onCurrencyChange={handleCurrencyChange}
                        value={formState?.currency}
                        currency="true"
                        pueMode="true"
                      />
                    </div>
                    <div className="input-wrapper" style={{ flex: 1 }}>
                      <CustomInput
                        type="number"
                        value={formState?.costInput}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            costInput: e.target.value,
                          })
                        }
                        placeholder="Enter Estimated Cost"
                        currency
                        pueMode
                      />
                    </div>
                  </div>
                </Tooltip>
              </LabeledInputWrapper>
            </TabCard>
            <Tooltip
              placement="left"
              title={
                sercondaryOptions
                  ? 'Click to Hide more input Fields.'
                  : 'Click to show more input Fields.'
              }
              overlayInnerStyle={{
                backgroundColor: theme?.palette?.main_layout?.primary_text, // custom background color
                color: theme?.mode === 'dark' ? 'black' : 'white',
                fontSize: '12px',
                fontFamily: 'Inter',
              }}
            >
              <TabIconButton
                theme={theme}
                onClick={() => {
                  setSecondaryOption((prev) => !prev);
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    // height: '40px',
                    background: 'none',
                    borderRadius: '6px',
                    padding: '5px',
                    cursor: 'pointer',
                    color: theme?.palette?.main_layout?.secondary_text,
                  }}
                >
                  {sercondaryOptions ? (
                    <FaCaretUp size={30} />
                  ) : (
                    <FaCaretDown size={30} />
                  )}
                </div>
              </TabIconButton>
            </Tooltip>
          </TabsWrapper>
          {/* secondary columns */}
          {sercondaryOptions && (
            <TabsWrapper>
              <TabCard
                theme={theme}
                style={{
                  background: 'transperant !important',
                  // width: '27% !important',
                  // flex: '0 0 30%',
                }}
                lable={true}
              >
                <LabeledInputWrapper
                  theme={theme}
                  style={{ background: 'transperant' }}
                >
                  <div className="label">Input Power (kW)</div>
                  <div className="input-wrapper">
                    <CustomInput
                      type="number"
                      value={formState?.powerInput}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          powerInput: e.target.value,
                        })
                      }
                      placeholder="Enter Input Power"
                      pueMode={true}
                    />
                  </div>
                </LabeledInputWrapper>
              </TabCard>
              <TabCard theme={theme}>
                <LabeledInputWrapper theme={theme}>
                  <div className="label">Output Power (kW) (IT Load)</div>
                  <Tooltip
                    placement="top"
                    title="Here Output power is used for calculation as 100% of the output power is considered as IT load power"
                    overlayInnerStyle={{
                      backgroundColor:
                        theme?.palette?.main_layout?.primary_text, // custom background color
                      color: theme?.mode === 'dark' ? 'black' : 'white',
                      fontSize: '12px',
                      fontFamily: 'Inter',
                    }}
                  >
                    <div className="input-wrapper">
                      <CustomInput
                        type="number"
                        value={formState.powerOutput}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            powerOutput: e.target.value,
                          })
                        }
                        placeholder="Enter Output Power"
                        pueMode={true}
                      />
                    </div>
                  </Tooltip>
                </LabeledInputWrapper>
              </TabCard>

              {/* <TabCard theme={theme}>
              <LabeledInputWrapper theme={theme} currency={true}>
                <div className="label">Estimation Cost</div>
                <Tooltip
                  placement="top"
                  title="Based on 0.37 AED/kWh for UAE region"
                  overlayInnerStyle={{
                    backgroundColor: theme?.palette?.main_layout?.primary_text, // custom background color
                    color: theme?.mode === 'dark' ? 'black' : 'white',
                    fontSize: '12px',
                    fontFamily: 'Inter',
                  }}
                >
                  <div
                    className="input-row"
                    style={{
                      background: theme?.palette?.default_input?.background,
                      alignItems: 'self-start',
                      border: `1px solid ${theme?.palette?.default_card?.border}`,
                      borderRadius: '4PX',
                    }}
                  >
                    <div className="selector-wrapper">
                      <KpiSelector
                        options={currencyOptions}
                        onCurrencyChange={handleCurrencyChange}
                        value={formState?.currency}
                        currency="true"
                        pueMode="true"
                      />
                    </div>
                    <div className="input-wrapper" style={{ flex: 1 }}>
                      <CustomInput
                        type="number"
                        value={formState?.costInput}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            costInput: e.target.value,
                          })
                        }
                        placeholder="Enter Estimated Cost"
                        currency
                        pueMode
                      />
                    </div>
                  </div>
                </Tooltip>
              </LabeledInputWrapper>
            </TabCard> */}
            </TabsWrapper>
          )}
          {inputError && (
            <p style={{ color: 'red' }}>
              Output Power cannot be greater than Input Power
            </p>
          )}
        </div>
      </CustomSpin>
      <TaglineSection>
        {/* <TaglineText theme={theme}>
          {conclusion}
          High Efficiency Achieved — Your Data Center is Optimized.
        </TaglineText> */}

        <ButtonGroup>
          {/* <TabButton
            theme={theme}
            onClick={() => {
              if (inputError) setInputError(false);

              const input = parseFloat(formState.powerInput);
              const output = parseFloat(formState.powerOutput);

              if (isNaN(input) || isNaN(output) || output > input) {
                setInputError(true);
                return;
              }

              const changedPayload = {
                pue: formState.rangeValue,
                co_em_factor: formState.co2Emission,
                input_power_kw: formState.powerInput,
                output_power_kw: formState.powerOutput,
                cost_factor: formState.costInput,
                cost_unit: formState.currency,
              };

              getPueDataForCalculation(changedPayload);
              setCalculate(true);
              setIsCurrencyChange(true);
              setShowComperison(false);
              setLockedCurrency(formState.currency);
            }}
            style={{
              background: theme?.palette?.default_select?.background,
              color: theme?.palette?.main_layout?.primary_text,
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              cursor: 'pointer',
              // opacity: !showComperison ? 1 : 0.5,
              // border: 'none',
            }}
          >
            <div
              style={{
                padding: '6px 8px',
                textAlign: 'center',
                // opacity: !showComperison ? 1 : 0.5,
              }}
            >
              <span
                style={{
                  fontWeight: 500,
                }}
              >
                Calculate
              </span>
            </div>
          </TabButton> */}

          <TabButton
            // Enable only after Calculate
            onClick={() => {
              const changedPayload = {
                pue: formState.rangeValue,
                co_em_factor: formState.co2Emission,
                input_power_kw: formState.powerInput,
                output_power_kw: formState.powerOutput,
                cost_factor: formState.costInput,
                cost_unit: formState.currency,
              };

              getPueDataForComparison(changedPayload);
              setShowComperison(true); // optional: only if you use this for rendering UI
            }}
            style={{
              cursor: 'pointer',
              // opacity: calculate ? 1 : 0.5,
            }}
            theme={theme}
          >
            {/* <div
              style={{
                background: 'none',
                borderRadius: '6px',
                padding: '4px 10px 0px 5px',
                textAlign: 'center',
                color: theme?.palette?.main_layout?.secondary_text,
              }}
            >
              <MdOutlineCompareArrows color="#fff" size={20} />
            </div> */}
            <span
              style={{
                fontWeight: 500,
              }}
            >
              {/* Show Comparison */}
              Calculate
            </span>
          </TabButton>
        </ButtonGroup>
      </TaglineSection>

      {/* <DetailCards siteId={1} isPueMode={true} loading={pueLoading} /> */}

      {/* <ComparisonCards showComperison={showComperison} /> */}
      <CustomSpin theme={theme} spinning={pueLoading}>
        <ComparisonCards
          showComperison={showComperison}
          currentData={currentData ?? {}}
          updatedData={showComperison ? (updatedData ?? {}) : {}}
          differenceData={differenceData}
          selectedCurrency={
            isCurrencyChange ? lockedCurrency : currencyOptions[0].value
          }
        />

        {/* Trends and Cost Estimation Charts */}
        <Row>
          <Col xs={24} lg={12} xl={12} style={{ padding: '10px' }}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                paddingBottom: '0px',
              }}
            >
              <PowerTrendChart
                currentData={[
                  {
                    label: 'Input Power',
                    value: currentData?.input_power_kw,
                  },
                  {
                    label: 'Output Power',
                    value: currentData?.output_power_kw,
                  },
                  { label: 'Energy Efficiency', value: currentData?.eer_per },
                ]}
                updatedData={[
                  {
                    label: 'Input Power',
                    value: updatedData?.input_power_kw,
                  },
                  {
                    label: 'Output Power',
                    value: updatedData?.output_power_kw,
                  },
                  { label: 'Energy Efficiency', value: updatedData?.eer_per },
                ]}
                showComparison={showComperison}
              />
            </CustomCard>

            {/* </Spin> */}
          </Col>
          <Col xs={24} lg={12} xl={12} style={{ padding: '10px' }}>
            {/* <Spin spinning={pueLoading}> */}

            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                // backgroundColor: "#050C17",
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                // position: "relative",
              }}
            >
              <CostEstimation
                currentData={[
                  { label: 'Daily', value: currentData?.cost_estimation_daily },
                  {
                    label: 'Monthly',
                    value: currentData?.cost_estimation_monthly,
                  },
                  {
                    label: 'Yearly',
                    value: currentData?.cost_estimation_yearly,
                  },
                ]}
                updatedData={[
                  { label: 'Daily', value: updatedData?.cost_estimation_daily },
                  {
                    label: 'Monthly',
                    value: updatedData?.cost_estimation_monthly,
                  },
                  {
                    label: 'Yearly',
                    value: updatedData?.cost_estimation_yearly,
                  },
                ]}
                showComparison={showComperison}
                selectedCurrency={
                  isCurrencyChange ? lockedCurrency : currencyOptions[0].value
                }
              />
            </CustomCard>

            {/* </Spin> */}
          </Col>
        </Row>
        {/* Cards and Traffic Utilization */}
        <Row>
          <Col xs={24} lg={12} xl={12} style={{ padding: '10px' }}>
            <CustomSpin theme={theme} spinning={pueLoading}>
              <CustomCard
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '7px',
                  paddingBottom: '0px',
                }}
              >
                <h5
                  style={{
                    color: theme?.palette?.graph?.title,
                    margin: '0px 10px',
                    fontSize: 16,
                    fontFamily: 'Inter',
                  }}
                >
                  Traffic-Power Utilization Ratio
                </h5>
                <PueCards
                  siteId={siteId}
                  showComparison={showComperison}
                  currentCards={[
                    {
                      title: 'Power Consumption Ratio (W/GB)',
                      value: currentData?.pcr_kw_per_gb,
                    },
                    {
                      title: 'Traffic Throughput (GB/W)',
                      value: currentData?.traffic_throughput_gb_per_watt,
                    },
                  ]}
                  updatedCards={[
                    {
                      title: 'Power Consumption Ratio (W/GB)',
                      value: updatedData?.pcr_kw_per_gb,
                    },
                    {
                      title: 'Traffic Throughput (GB/W)',
                      value: updatedData?.traffic_throughput_gb_per_watt,
                    },
                  ]}
                />
              </CustomCard>
            </CustomSpin>
            {/* </Spin> */}
          </Col>
          <Col xs={24} lg={12} xl={12} style={{ padding: '10px' }}>
            {/* <Spin spinning={pueLoading}> */}
            <CustomSpin theme={theme} spinning={pueLoading}>
              <CustomCard
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  // backgroundColor: "#050C17",
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '7px',
                  // position: "relative",
                }}
              >
                {/* <h5
                  style={{
                    color: theme?.palette?.graph?.title,
                    margin: '0px 10px',
                    fontSize: 16,
                    fontFamily: 'Inter',
                  }}
                >
                  Traffic Utilization Trends
                </h5> */}

                <TrafficUtilizationChart
                  currentData={[
                    {
                      label: 'Traffic Consumed(GB)',
                      value: currentData?.datatraffic_consumed_gb,
                    },
                    {
                      label: 'Traffic Allocated(GB)',
                      value: currentData?.datatraffic_allocated_gb,
                    },
                    {
                      label: 'Data Utilization(%)',
                      value: currentData?.datautilization_per,
                    },
                  ]}
                  updatedData={[
                    {
                      label: 'Traffic Consumed(GB)',
                      value: updatedData?.datatraffic_consumed_gb,
                    },
                    {
                      label: 'Traffic Allocated(GB)',
                      value: updatedData?.datatraffic_allocated_gb,
                    },
                    {
                      label: 'Data Utilization(%)',
                      value: updatedData?.datautilization_per,
                    },
                  ]}
                  showComparison={showComperison}
                />
              </CustomCard>
            </CustomSpin>
            {/* </Spin> */}
          </Col>
        </Row>
        <StyledModal
          theme={theme}
          title={
            <div style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              Error{' '}
            </div>
          }
          open={errorVisible}
          onCancel={() => {
            setErrorVisible(false);
          }}
          centered
          footer={[
            <div
              key="center-btn"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setErrorVisible(false);
                  // getPueDataForCalculation();
                }}
              >
                OK
              </Button>
            </div>,
          ]}
        >
          <p>{errorMessage}</p>
        </StyledModal>
      </CustomSpin>
    </div>
  );
}

export default PueModule;
