// import React, { useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Row, Col } from "antd";
// import { DeleteOutlined } from "@ant-design/icons";
// import CustomAccordion from "../../../components/customAccordion";
// const Device = ({ id, name }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: "device",
//     item: { id, name },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return (
//     <div
//       ref={drag}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         cursor: "move",
//         fontSize: "15px",
//         fontWeight: 500,
//         borderBottom: id == 5 ? "" : "1px solid #36424E",
//       }}
//     >
//       <p style={{ padding: "15px", marginBottom: "0px", marginTop: "0px" }}>
//         + {name}
//       </p>
//     </div>
//   );
// };

// const SelectedDevice = ({ id, name, onRemove }) => {
//   return (
//     <div
//       style={{
//         fontSize: "15px",
//         fontWeight: 500,
//         borderBottom: id == 4 ? "" : "1px solid #36424E",
//         display: "flex",
//         justifyContent: "space-between",
//       }}
//     >
//       <p style={{ padding: "15px", marginBottom: "0px", marginTop: "0px" }}>
//         {name}
//       </p>

//       <DeleteOutlined
//         style={{ padding: "15px", color: "#720615" }}
//         onClick={() => onRemove(id)}
//       />
//     </div>
//   );
// };

// const DevicesList = () => {
//   const devices = [
//     { id: 1, name: "Power Utilization" },
//     { id: 2, name: "Data Traffic" },
//     { id: 3, name: "Cooling System" },
//     { id: 4, name: "Co2 Emission" },
//     { id: 5, name: "Enviromental Impact Assessment" },
//   ];

//   return (
//     <div
//       style={{
//         background: "#16212A",
//         // width: "100%",
//         height: "310px",
//         border: "1px solid #050C17",
//         // padding: "15px",
//       }}
//     >
//       <p
//         style={{
//           padding: "15px 15px",
//           fontSize: "16px",
//           fontWeight: 400,
//           color: "#E4E4E4",
//           background: "#050C17",
//           marginTop: "0px",
//           marginBottom: "0px",
//           borderBottom: "1px solid #14191F",
//         }}
//       >
//         Available Options
//       </p>
//       {devices.map((device) => (
//         <Device key={device.id} id={device.id} name={device.name} />
//       ))}
//     </div>
//   );
// };

// const SelectedDevices = ({ selectedOptions, setSelectedOptions }) => {
//   console.log(selectedOptions);
//   const [selectedDevices, setSelectedDevices] = useState([]);

//   const handleDrop = (id, name) => {
//     setSelectedOptions((prev) => [...prev, { id, name }]);
//   };

//   const handleRemove = (id) => {
//     setSelectedOptions((prev) => prev.filter((device) => device.id !== id));
//   };

//   const [, drop] = useDrop({
//     accept: "device",
//     drop: (item) => handleDrop(item.id, item.name),
//   });

//   return (
//     <div
//       style={{
//         background: "#16212A",
//         // width: "100%",

//         height: "310px",
//         border: "1px solid #050C17",
//         // padding: "15px",
//       }}
//       ref={drop}
//     >
//       <p
//         style={{
//           padding: "15px 15px",
//           fontSize: "16px",
//           fontWeight: 400,
//           color: "#E4E4E4",
//           background: "#050C17",
//           marginTop: "0px",
//           marginBottom: "0px",
//           borderBottom: "1px solid #14191F",
//         }}
//       >
//         Selected Options
//       </p>
//       {selectedOptions?.length !== 0 ? (
//         selectedOptions?.map((device) => (
//           <SelectedDevice
//             key={device.id}
//             id={device.id}
//             name={device.name}
//             onRemove={handleRemove}
//           />
//         ))
//       ) : (
//         <div
//           style={{
//             height: "310px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <p
//             style={{
//               textAlign: "center",
//               fontSize: "16px",
//               color: "#E4E4E4",
//               marginTop: "0px",
//             }}
//           >
//             To select a report, drag and drop it from the Available <br />{" "}
//             Options list
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// const DragAndDropDevices = ({ selectedOptions, setSelectedOptions }) => {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Row style={{ marginTop: "20px" }}>
//         <Col xs={24} md={12} style={{ padding: "10px 10px 10px 0px" }}>
//           <DevicesList />
//         </Col>
//         <Col xs={24} md={12} style={{ padding: "10px 0px 10px 10px" }}>
//           <SelectedDevices
//             selectedOptions={selectedOptions}
//             setSelectedOptions={setSelectedOptions}
//           />
//         </Col>
//       </Row>
//     </DndProvider>
//   );
// };

// export default DragAndDropDevices;

import { CaretRightOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Col, Collapse, theme, Row } from 'antd';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { color } from 'echarts';
const text2 = ['PUE Report'];

const energyText = ['Energy Consumption Report', 'Energy Efficiency Report'];
const text1 = ['Co2eq Emission Report'];
const text3 = [
  ' Traffic Distribution Analysis',
  'Peak Hour Analysis',
  'Top-Consuming Devices and Applications',
  'Real-Time Monitoring and Alerts',
  'Historical Analysis and Trend Forecasting',
  'Segment-Specific Throughput Analysis',
];
const text4 = [
  'CO2 Emission Analysis and Carbon Footprint Reduction',
  'Renewable Energy Integration and Sustainability Practices',
  'Water Usage and Environmental Stewardship',
  'Sustainability Reporting and Compliance',
];
const text5 = [
  '802. 11n Summary',
  'Preferred Calls',
  'Wireless Network Executive Summary',
];
const getItems = (panelStyle, text, title) => [
  {
    key: '1',
    label: (
      <p
        style={{
          color: '#E4E4E4',
          margin: '0px',
          //   borderBottom: "1px solid #36424E",
        }}
      >
        {title}
      </p>
    ),
    children: text?.map((item, index) => (
      <>
        <DraggableItem key={index} text={item} />
      </>
    )),

    style: panelStyle,
  },
];

const DraggableItem = ({ text }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'accordionItem',
    item: { text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <p
      ref={drag}
      style={{
        color: '#E4E4E4',
        margin: '0px',
        borderBottom: '1px solid #36424E',
        padding: '10px',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {text}
    </p>
  );
};

const DropTarget = ({ droppedItems, setDroppedItems, setSelectedOptions }) => {
  const [, drop] = useDrop({
    accept: 'accordionItem',
    drop: (item) => {
      setDroppedItems((prevItems) => [...prevItems, item.text]);
      setSelectedOptions((prevItems) => [...prevItems, item.text]);
    },
  });

  const removeItem = (index) => {
    setDroppedItems((prevItems) => prevItems.filter((_, i) => i !== index));
    setSelectedOptions((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <>
      <div
        ref={drop}
        style={{
          background: '#16212A',
          width: '100%',
          minHeight: '320px',
          border: '1px solid #050C17',
          // padding: "15px",
        }}
      >
        <p
          style={{
            padding: '15px 15px',
            fontSize: '16px',
            fontWeight: 400,
            color: '#E4E4E4',
            background: '#050C17',
            marginTop: '0px',
            marginBottom: '0px',
            borderBottom: '1px solid #14191F',
          }}
        >
          Selected Options
        </p>
        <ul
          style={{
            listStyle: 'none',
            paddingLeft: 0,
            // width: "100%",
            padding: '10px 15px',
          }}
        >
          {droppedItems.length !== 0 ? (
            droppedItems.map((item, index) => (
              <li
                key={index}
                style={{
                  color: '#E4E4E4',
                  borderBottom: '1px solid #36424E',
                  width: '100%',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span> {item}</span>
                <CloseOutlined
                  onClick={() => removeItem(index)}
                  style={{ cursor: 'pointer' }}
                />
              </li>
            ))
          ) : (
            <div
              style={{
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  color: '#E4E4E4',
                  fontSize: '16px',
                  textAlign: 'center',
                }}
              >
                To select a report, drag and drop it from the Available <br />{' '}
                Options list
              </p>
            </div>
          )}
        </ul>
        {/* {devices.map((device) => (
        <Device key={device.id} id={device.id} name={device.name} />
      ))} */}
      </div>
    </>
    // <div
    //   ref={drop}
    //   style={{
    //     border: "1px dashed #36424E",
    //     padding: "10px",
    //     marginBottom: "30px",
    //     backgroundColor: "#09101B",
    //   }}
    // >
    //   <p style={{ color: "#E4E4E4" }}>Dropped Items:</p>
    //   <ul style={{ listStyle: "none", paddingLeft: 0 }}>
    //     {droppedItems.map((item, index) => (
    //       <li key={index} style={{ color: "#E4E4E4" }}>
    //         {item}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

const CustomAccordion = ({ text, title }) => {
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 8,
    background: '#050C17',
    borderRadius: token.borderRadiusLG,
  };

  return (
    <div>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{
          background: '#09101B',
          marginBottom: '0px',
        }}
        items={getItems(panelStyle, text, title)}
      />
    </div>
  );
};

const DragAndDrop = ({ setSelectedOptions }) => {
  const [droppedItems, setDroppedItems] = useState([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Row>
        <Col xs={24} md={12} style={{ padding: '10px 10px 10px 0px' }}>
          <div
            style={{
              background: '#16212A',
              width: '100%',
              height: 'auto',
              border: '1px solid #050C17',
            }}
          >
            <p
              style={{
                padding: '15px 15px',
                fontSize: '16px',
                fontWeight: 400,
                color: '#E4E4E4',
                background: '#050C17',
                marginTop: '0px',
                marginBottom: '8px',
                borderBottom: '1px solid #14191F',
              }}
            >
              Available Options
            </p>
            <CustomAccordion text={text2} title="Power Utilization" />
            {/* <CustomAccordion text={text} title="Cooling System" /> */}
            <CustomAccordion text={energyText} title="Energy" />
            <CustomAccordion text={text1} title="Co2 Emission" />
            <CustomAccordion text={text3} title="Data Traffic" />
            <CustomAccordion
              text={text4}
              title="Environmental Impact Assessment"
            />
          </div>
        </Col>
        <Col xs={24} md={12} style={{ padding: '10px 10px 10px 0px' }}>
          <DropTarget
            droppedItems={droppedItems}
            setDroppedItems={setDroppedItems}
            setSelectedOptions={setSelectedOptions}
          />
        </Col>
      </Row>
    </DndProvider>
  );
};

export default DragAndDrop;
