import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = useState("Not Found");
  const [scannedCodes, setScannedCodes] = useState([]);

  const handleScan = (err, result) => {
    if (result) {
      setData(result.text);
      setScannedCodes((prevCodes) => [...prevCodes, result.text]);
    } else {
      setData("Not Found");
    }
  };

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={handleScan}
      />
      <p>Último código leído: {data}</p>
      <ul>
        {scannedCodes.map((code, index) => (
          <li key={index}>{code}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
