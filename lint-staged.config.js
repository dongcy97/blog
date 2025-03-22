/** @type {import('lint-staged').Config} */
export default {
  '*.md': (stagedFiles) => `node ./scripts/time.js ${stagedFiles.join(' ')}`,
  '*.{js,jsx,ts,tsx,vue}': ['eslint', 'prettier --write'],
  '*.{json,css,scss,yml,yaml}': ['prettier --write']
}
