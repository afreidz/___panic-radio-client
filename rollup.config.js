import path from 'path';
import serve from 'rollup-plugin-serve';
import alias from '@rollup/plugin-alias';
import svelte from 'rollup-plugin-svelte';
import rollupLess from 'rollup-plugin-less';
import { less } from 'svelte-preprocess-less';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtIns from 'rollup-plugin-node-builtins';

const serveropts = {
  open: true,
  port: 5001,
  contentBase: './public',
  headers: { 'Access-Control-Allow-Origin': '*' },
};

export default [{
  input: {
    main: path.resolve(process.cwd(), 'source', 'main.js')
  },
  plugins: [
    alias({
      entries: [
        { find: 'App', replacement: path.resolve(__dirname, 'source', 'App') },
        { find: 'Components', replacement: path.resolve(__dirname, 'source', 'Components') },
        { find: 'Utilities', replacement: path.resolve(__dirname, 'source', 'Utilities') },
        { find: 'Styles', replacement: path.resolve(__dirname, 'source', 'Styles') },
        { find: 'Assets', replacement: path.resolve(__dirname, 'public', 'assets') },
        { find: 'Config', replacement: path.resolve(__dirname, 'config.js') },
      ],
      resolve: ['.js', '.html', '.less', '.css', '.svg', '.svelte'],
    }),
    builtIns(),
    resolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
      extensions: ['.js', '.svelte', '.html', '.svg', '.less', '.css'],
    }),
    commonjs(),
    globals(),
    rollupLess({ insert: true, output: false }),
    svelte({
      dev: process.env.NODE_ENV !== 'production',
      extensions: ['.html', '.svg', '.svelte'],
      preprocess: {
        style: less()
      }
    }),
    process.env.NODE_ENV !== 'production' ? serve(serveropts) : null,
  ],
  output: {
    entryFileNames: '[name].js',
    chunkFileNames: '[name].[hash].js',
    dir: path.resolve(process.cwd(), 'public', 'static'),
    format: 'esm',
    sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
  }
}]