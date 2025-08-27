import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import { globSync } from 'glob'
import vituum from 'vituum'
import pages from 'vituum/plugins/pages.js'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import viteImagemin from '@vheemstra/vite-plugin-imagemin'
import imageminWebp from 'imagemin-webp'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import pug from '@vituum/vite-plugin-pug'
import postcssWillChange from 'postcss-will-change'
import autoprefixer from 'autoprefixer'
import { svgSpritemap } from 'vite-plugin-svg-spritemap'

const COMPONENTS_DIR = path.resolve(__dirname, 'src/pug/components')
const PUG_FOLDERS = ['blocks', 'elements', 'forms', 'modals', 'sections', 'ui', 'utils', 'widgets']

function generateAllIncludes() {
  const out = path.join(COMPONENTS_DIR, '_auto-import.pug')
  let content = ''

  PUG_FOLDERS.forEach(folder => {
    const dir = path.join(COMPONENTS_DIR, folder)
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.pug'))
      .sort()
    if (files.length) {
      content += `//- ${folder}\n`
      content += files.map(f => `include ./${folder}/${f}`).join('\n') + '\n'
    }
  })

  fs.writeFileSync(out, content)
}

function pugComponentsAutoInclude() {
  return {
    name: 'vite-pug-components-autoinclude',
    buildStart() {
      generateAllIncludes()
    },
    configureServer(server) {
      server.watcher.on('unlink', (file) => {
        if (file.endsWith('.pug') && file.includes('components')) {
          generateAllIncludes()
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.pug') && file.includes('components')) {
        generateAllIncludes()
        server.ws.send({ type: 'full-reload' })
      }
    }
  }
}

const disableWebp = () => {
  return {
    apply: 'serve',
    name: 'disable-webp',
    transformIndexHtml(html) {
      return html.replaceAll(
        /<source type=\"image\/webp\" (.*?)>/g,
        `<!-- <source type="image/webp"> disable webp for "serve" mode -->`,
      )
    }
  }
}

export default defineConfig(() => {
  return {
    base: './',
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['mixed-decls']
        }
      },
      postcss: {
        plugins: [
          postcssWillChange(),
          autoprefixer()
        ]
      }
    },
    build: {
      outDir: 'docs',
      minify: false,
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: globSync('./src/pug/pages/*.pug', { posix: true }),
        output: {
          chunkFileNames: (info) => `assets/[name].js`,
          assetFileNames: (info) => `assets/[name].[ext]`
        }
      },
    },
    experimental: {
      renderBuiltUrl: (filename, { type }) => {
        if (type === 'asset') {
          return `./${filename}`
        } else {
          return {
            relative: true,
          };
        }
      },
    },
    server: {
      open: true,
      port: 9000
    },
    plugins: [
      disableWebp(),
      viteImagemin({
        // verbose: false,
        include: ['docs/img/**/*.(png|jpg|svg)'],
        exclude: ['docs/*.(png|jpg|svg)', '**/node_modules/**', '*/*/sprite.svg'],
        plugins: {
          jpg: imageminMozjpeg({ quality: 80 }),
          jpeg: imageminMozjpeg({ quality: 80 }),
          png: imageminPngquant({ quality: [0.8, 0.9] }),
          svg: imageminSvgo()
        },
        makeWebp: {
          formatFilePath: (file) => `${file.slice(0, file.lastIndexOf('.'))}.webp`,
          skipIfLargerThan: false,
          plugins: {
            jpg: imageminWebp({ quality: 80 }),
            jpeg: imageminWebp({ quality: 80 }),
            png: imageminWebp({ quality: 80 })
          }
        },
      }),
      svgSpritemap({
        pattern: 'src/icns/*.svg',
        currentColor: true,
        filename: 'img/sprite.svg'
      }),
      vituum(),
      sassGlobImports(),
      pug({
        root: './src/pug/pages'
      }),
      pages({
        dir: './src/pug/pages',
        normalizeBasePath: true
      }),
      pugComponentsAutoInclude()
    ]
  }
})
