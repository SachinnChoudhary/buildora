import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        cancel: resolve(__dirname, 'cancel.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        contact: resolve(__dirname, 'contact.html'),
        custom: resolve(__dirname, 'custom.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        discover: resolve(__dirname, 'discover.html'),
        freelancerDashboard: resolve(__dirname, 'freelancer-dashboard.html'),
        freelancerUpload: resolve(__dirname, 'freelancer-upload.html'),
        login: resolve(__dirname, 'login.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        project: resolve(__dirname, 'project.html'),
        refund: resolve(__dirname, 'refund.html'),
        signup: resolve(__dirname, 'signup.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
});
