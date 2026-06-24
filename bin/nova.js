#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes('--activate')) {
  const { activate } = await import('../src/index.js');
  await activate().catch((err) => {
    console.error('\n  ✗ ' + err.message + '\n');
    process.exit(1);
  });
} else {
  console.log('\n  Usage: nova --activate\n');
  process.exit(0);
}
