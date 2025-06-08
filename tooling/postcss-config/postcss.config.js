require('dotenv').config();

const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssCombine = require('postcss-combine-duplicated-selectors');
const postcssRename = require('postcss-rename');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = (ctx) => {
  return {
    plugins: [
      postcssImport,
      postcssNested,
      postcssCombine,
      postcssRename({
        strategy: (className) => {
          if (!process.env.LIB) {
            throw new Error('LIB environment variable is required for CSS class renaming');
          }
          return className.replace('xy', process.env.LIB);
        },
      }),
      autoprefixer,
      ctx.env === 'production' && cssnano,
    ],
  };
};
