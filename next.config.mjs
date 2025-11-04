// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = createNextIntlPlugin(
  {
    // Плагины и кастомизация Webpack
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': './src',
        '@components': './src/components',
        '@messages': './src/messages',
        '@utils': './src/utils'
      };
      return config;
    },

    i18n: {
      // Указываем доступные локали
      locales: ['ru', 'en'],
      // Убираем префикс из URL
      defaultLocale: 'ru',
      localeDetection: true
    },

    experimental: {
      externalDir: true
    }
  },
  {
    // Конфигурация next-intl
    // ВАЖНО: отключаем префикс локали
    runtime: 'edge', // или 'node' если используешь node-мидлвар
    localizedRouting: false
  }
);

export default nextConfig;
