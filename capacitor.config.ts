import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PowerSync Ionic Example',
  webDir: 'www',
  server: {
    allowNavigation: ['*'],
    cleartext: true, 
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: false
    }
  }
};

export default config;
