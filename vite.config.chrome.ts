import { resolve } from 'path';
import { mergeConfig, defineConfig } from 'vite';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import baseConfig, { baseManifest, baseBuildOptions } from './vite.config.base'

const outDir = resolve(__dirname, 'dist_chrome');

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      crx({
        manifest: {
          ...baseManifest,
          background: {
            service_worker: 'src/pages/background/index.ts',
            type: 'module'
          },
          content_scripts: [
          {
            matches: ['<all_urls>'],
            js: ['src/pages/content/index.tsx'],
            css: ['contentStyle.css']
          }
        ]
        } as ManifestV3Export,
        browser: 'chrome',
        contentScripts: {
          injectCss: true,
        }
      })
    ],
    build: {
      ...baseBuildOptions,
      outDir
    },
  })
)