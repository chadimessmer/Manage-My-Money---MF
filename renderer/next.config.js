module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
  reactStrictMode: false,
  i18n: {
    locales: ["fr", "de"],
    defaultLocale: "fr",
  },
};
