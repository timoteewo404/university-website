// Configuration for different environments
const config = {
  development: {
    portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3002',
    websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000'
  },
  production: {
    portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.eiu.ac.ug',
    websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://eiu.ac.ug'
  }
};

// Get current environment
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Export current config
export const currentConfig = config[environment];

// Helper function to get portal URL
export const getPortalUrl = (path = '') => {
  return `${currentConfig.portalUrl}${path}`;
};

// Helper function to get website URL
export const getWebsiteUrl = (path = '') => {
  return `${currentConfig.websiteUrl}${path}`;
};