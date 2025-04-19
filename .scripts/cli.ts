#!/usr/bin/env ts-node

const { generate } = require('./generator');

const [, , target, entityName, ...rest] = process.argv;

if (!target || !entityName) {
  console.error('❌ Dùng đúng cú pháp: pnpm generate [target] [name]');
  process.exit(1);
}
generate(target, entityName);

//package.json
//"generate": "ts-node .scripts/cli.ts"
