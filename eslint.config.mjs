// Temporary minimal config to allow publishing
// The @n8n/node-cli/eslint has a known module import issue
export default [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.js', '**/*.d.ts'],
  },
];
