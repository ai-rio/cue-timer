module.exports = {
  // TypeScript/JavaScript files
  '*.{ts,tsx,js,jsx}': ['eslint --fix --config eslint.config.js', 'prettier --write'],

  // MDX and markdown files
  '*.{md,mdx}': [
    'prettier --write',
    // Content validation
    'remark --frail --quiet',
  ],

  // Style files
  '*.{css,scss,less,sass}': ['prettier --write'],

  // Config and data files
  '*.{json,yml,yaml,toml}': ['prettier --write'],

  // Public files (validate but don't format)
  'public/**/*.{html,xml,svg}': [
    // Add HTML validation if needed
  ],

  // Config files (with specific formatting)
  '*.{config.js,config.mjs,config.cjs,config.ts}': [
    'eslint --fix --config eslint.config.js',
    'prettier --write',
  ],

  // Type definition files
  '*.d.ts': ['prettier --write'],

  // Test files
  '*.{test,spec}.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // Story files
  '*.stories.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // Supabase migration files
  'supabase/migrations/*.sql': [
    // SQL formatting (if a formatter is added)
    // 'sql-formatter --fix',
  ],
};
