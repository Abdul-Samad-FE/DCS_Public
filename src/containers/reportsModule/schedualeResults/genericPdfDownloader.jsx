import React, { useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const GenericPdfDownloader = ({
  rootElementId,
  downloadFileName,
  setLoading,
}) => {
  const downloadPdfDocument = async () => {
    setLoading(true);
    const input = document.getElementById(rootElementId);
    const scale = 2;
    const options = {
      scale: scale,
      useCORS: true,
      logging: true,
      scrollY: 0,
    };

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let totalPages = 1;
    let pageHeight = pdf.internal.pageSize.getHeight();

    let canvas = await html2canvas(input, options);
    let imgData = canvas.toDataURL("image/png");
    let imgWidth = 210; // A4 width in mm
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the first page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Calculate remaining pages if content exceeds single page height
    if (imgHeight > pageHeight) {
      totalPages = Math.ceil(imgHeight / pageHeight);
    }

    // Add remaining pages
    for (let i = 1; i < totalPages; i++) {
      pdf.addPage();
      let yPos = -(pageHeight * i);
      pdf.addImage(imgData, "PNG", 0, yPos, imgWidth, imgHeight);
    }

    pdf.save(`${downloadFileName}.pdf`);
    setLoading(false);
  };

  return (
    <Button
      style={{ background: "#0490E7" }}
      key="submit"
      type="primary"
      //   loading={loading}
      onClick={downloadPdfDocument}
    >
      <DownloadOutlined />
      Download
    </Button>
  );
};

export default GenericPdfDownloader;
