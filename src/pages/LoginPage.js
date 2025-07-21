import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [otp, setOtp] = useState('');

  const handleLogin = () => {
    // TODO: call api.login(credentials) then step 2
    setStep(2);
  };

  const handleVerifyOtp = () => {
    // TODO: call api.verifyOtp(otp) and redirect on success
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      {step === 1 ? (
        <>
          <Typography variant="h5" mb={2}>Login</Typography>
          <TextField
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            margin="normal"
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
            Next
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" mb={2}>Enter OTP</Typography>
          <TextField
            fullWidth
            label="OTP Code"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleVerifyOtp}>
            Verify
          </Button>
        </>
      )}
    </Box>
  );
}
