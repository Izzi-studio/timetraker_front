import path from 'path'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
    plugins: [
        vue(),
        VueI18nPlugin({
            include: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
            runtimeOnly: false
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/images/icons')],
            symbolId: 'icon-[name]',
            svgoOptions: {
                plugins: [
                    'preset-default',
                    {
                        name: "removeAttrs",
                        params: {
                            attrs: "(fill|stroke)"
                        }
                    },
                ],
            }
        }),
    ],
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})