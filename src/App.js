import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = useState("Not Found");
  const [scannedCodes, setScannedCodes] = useState([]);
  
  const [flashlightOn, setFlashlightOn] = useState(false);

  const toggleFlashlight = () => {
    setFlashlightOn((prev) => !prev);
    // Acceder a la API de Web para manejar la linterna
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        const track = stream.getVideoTracks()[0];
        track.applyConstraints({
          advanced: [{ torch: flashlightOn }],
        });
      })
      .catch((error) => console.error("Error al acceder a la linterna:", error));
  };


  const handleScan = (err, result) => {
    if (result) {
      setData(result.text);
      setScannedCodes((prevCodes) => [...prevCodes, result.text]);
  
      // Crear un objeto FormData y agregar el código de barras
      const formData = new FormData();
      formData.append("codigo_barras", result.text);
  
      // Enviar el código de barras mediante una solicitud POST
      fetch("https://nivel99.com/tiketera/procesarTicket.php", {
        method: "POST",
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          // Manejar la respuesta del servidor si es necesario
          alert(JSON.stringify(data));
        })
        .catch(error => {
          // Manejar errores en la solicitud
          console.error("Error al enviar la solicitud POST:", error);
        });
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
      <button onClick={toggleFlashlight}>
        {flashlightOn ? "Apagar linterna" : "Encender linterna"}
      </button>
    </>
  );
}

export default App;