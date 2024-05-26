import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run ngc:serve:development',
        production: 'nx run ngc:serve:production',
      },
      ciWebServerCommand: 'nx run ngc:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
