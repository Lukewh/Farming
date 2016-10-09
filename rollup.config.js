//import rollupPluginCommonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/main.ts',
  format: 'iife',
  dest: 'static/main.js',
  plugins: [
    typescript()
    /*rollupPluginCommonjs({
     namedExports: {
     'src/js/Classes/vendor/Victor.js': ['Victor']
     }
     })*/
  ]
};
