import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Typography } from '@mui/material';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure: (error: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false // verbose
    );

    scanner.render(onScanSuccess, (error) => {
      // console.warn(`QR error = ${error}`);
    });

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5-qrcode-scanner.", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>Scan QR Code</Typography>
      <div id="qr-reader" style={{ width: '100%' }}></div>
    </Box>
  );
};

export default QrScanner;
