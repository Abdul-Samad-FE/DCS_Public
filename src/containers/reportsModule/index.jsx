import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Card from '../../components/cards';
import HorizontalMenu from '../../components/horizontalMenu';
import HorizontalSubTabs from '../../components/ui/horizontalSubTabs/horizontalSubTabs';
import NewReport from './customReports/newReport';
import Devices from '../uamModule/inventory/devices/index';
import { FEATURE_FLAGS } from '../../utils/featureFlags';
import { AppContext } from '../../context/appContext';
import BackButton from '../../components/backButton';
import SubHorizontalMenu from '../../components/subHorizontalMenu';

const menuItems = [
  // {
  //   id: "Report Launch Pad",
  //   name: "Report Launch Pad",
  //   path: "report-launch-pad",
  // },
  { id: 'custom-reports', name: 'Reports', path: '' },

  // {
  //   id: "scheduled-run-results",
  //   name: "Scheduled Reports",
  //   path: "scheduled-run-results",
  // },
  {
    id: 'saved-report',
    name: 'View Reports ',
    path: 'saved-report-templates',
  },
];

function Index(props) {
  const { isMenuVisible } = useContext(AppContext);
  return (
    <div style={{ position: 'relative' }}>
      {isMenuVisible ? (
        <Card
          sx={{
            marginBottom: '10px',
            // height: '50px',
            boxShadow: 'unset !important',
          }}
        >
          {/* <HorizontalMenu
            menuItems={menuItems}
            parent="reportModule"
            defaultPage="custom-reports"
          />{' '} */}
          <SubHorizontalMenu menuItems={menuItems} />
        </Card>
      ) : (
        <BackButton style={{ margin: '15px 15px 0px 20px' }} />
      )}
      {/* <Card
        sx={{
          marginBottom: '10px',
          height: '50px',
          boxShadow: 'unset !important',
        }}
      >
        <HorizontalMenu menuItems={menuItems} />{' '}
      </Card> */}
      {/* <HorizontalSubTabs tabs={tabs} /> */}
      <Outlet />
    </div>
  );
}

export default Index;

const tabs = [
  { label: 'Generate PDF Report', content: <NewReport /> },
  { label: 'Generate CSV Report', content: <Devices /> },
];

export const ReportsSection = () =>
  FEATURE_FLAGS.Reports_Experimental ? (
    <HorizontalSubTabs tabs={tabs} />
  ) : (
    <NewReport />
  );
