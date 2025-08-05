// import * as React from "react";
// import { styled } from "@mui/material/styles";
// import Tooltip from "@mui/material/Tooltip";
// import Stack from "@mui/material/Stack";
// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

// const ProSpan = styled("span")({
//   display: "inline-block",
//   height: "1em",
//   width: "100%",
//   verticalAlign: "middle",
//   marginLeft: "0.3em",
//   marginBottom: "0.08em",
//   backgroundSize: "contain",
//   backgroundRepeat: "no-repeat",
//   backgroundImage: "url(https://mui.com/static/x/pro.svg)",
// });

// function Label({ componentName, valueType, isProOnly, label }) {
//   const content = (
//     <span style={{ color: "#F2EEEE", fontSize: "12px" }}>{label}</span>
//   );

//   if (isProOnly) {
//     return (
//       <Stack direction="row" spacing={0.5} component="span">
//         {content}
//       </Stack>
//     );
//   }

//   return content;
// }

// export default function CustomDatePicker({ label }) {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={["DatePicker"]}>
//         <DemoItem
//           label={
//             <Label componentName="DatePicker" valueType="date" label={label} />
//           }
//         >
//           <DatePicker />
//         </DemoItem>
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// }
