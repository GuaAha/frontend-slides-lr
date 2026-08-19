import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const studioRoot = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  root: studioRoot,
  base: './',
  server: { fs: { allow: [projectRoot] } },
  build: {
    outDir: fileURLToPath(new URL('../dist-studio', import.meta.url)),
    emptyOutDir: true,
  },
});
