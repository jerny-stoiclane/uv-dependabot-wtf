import { ArmhrTheme } from '@armhr/ui';
import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import { LicenseInfo } from '@mui/x-license-pro';
import ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime';

import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

LicenseInfo.setLicenseKey('9933aa5af08905b51845bde334657a16Tz0xMDYwOTEsRT0xNzY4NjA3OTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=');

root.render(
  <ArmhrTheme>
    <App />
  </ArmhrTheme>
);

if (import.meta.env.PROD || import.meta.env.MODE === 'staging') {
  const site = 'datadoghq.com';
  const clientToken = 'pubdc1d250d2cb3e757e2b4cff42fc4e4e9';
  const applicationId = 'c328b763-6cc9-405c-bf1c-0774246f06bc'
  const service = 'armhr-hcm';
  const env = import.meta.env.MODE;

  datadogLogs.init({
    clientToken,
    site,
    service,
    env,
    forwardConsoleLogs: ['debug', 'warn', 'error'],
    sessionSampleRate: 100,
  });

  datadogRum.init({
    clientToken,
    site,
    service,
    env,
    applicationId,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: false, 
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    version: import.meta.env.VITE_APP_GIT_SHA || '',
    allowedTracingUrls: [import.meta.env.VITE_APP_BACKEND_BASE_URL, (url) => url.startsWith(import.meta.env.VITE_APP_BACKEND_BASE_URL)]
  });
  datadogRum.startSessionReplayRecording();
}
