const fs = require('fs');
const path = require('path');

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowerFirst(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function loadTemplate(templatePath: string, replacements: Record<string, string>) {
  let content = fs.readFileSync(templatePath, 'utf8');
  for (const key in replacements) {
    const regex = new RegExp(`__${key}__`, 'g');
    content = content.replace(regex, replacements[key]);
  }
  return content.trim();
}

function getTemplatePath(...segments: string[]): string {
  return path.join(__dirname, 'templates', ...segments);
}

function writeGeneratedFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
}

function getDirByTarget(target: string): string {
  switch (target) {
    case 'store':
      return path.resolve('src/stores/@miniApp');
    case 'interface':
      return path.resolve('src/interfaces/mini-app');
    case 'service':
      return path.resolve('src/services/mini-app');
    case 'page':
      return path.resolve('src/components/templates/@miniApp');
    default:
      return process.cwd();
  }
}

function generateInterface(name: string, lowerName: string) {
  const dir = getDirByTarget('interface');
  const filePath = path.join(dir, `${lowerName}.interfaces.ts`);
  const content = loadTemplate(getTemplatePath('interface.ts.tpl'), { Name: name, lowerName });
  writeGeneratedFile(filePath, content);
}

function generateStore(name: string, lowerName: string) {
  const dir = getDirByTarget('store');
  const filePath = path.join(dir, `use${name}Store.store.ts`);
  const content = loadTemplate(getTemplatePath('store.ts.tpl'), { Name: name, lowerName });
  writeGeneratedFile(filePath, content);
}

function generateService(name: string, lowerName: string) {
  const dir = getDirByTarget('service');
  const filePath = path.join(dir, `${lowerName}.api.ts`);
  const content = loadTemplate(getTemplatePath('service.ts.tpl'), { Name: name, lowerName });
  writeGeneratedFile(filePath, content);
}

function generatePage(name: string, lowerName: string) {
  const basePath = path.join(getDirByTarget('page'), `${name}Template`);
  const partialsDir = path.join(basePath, 'partials');

  writeGeneratedFile(
    path.join(basePath, 'index.tsx'),
    loadTemplate(getTemplatePath('page', 'index.tsx.tpl'), { Name: name, lowerName }),
  );
  writeGeneratedFile(
    path.join(basePath, `${lowerName}Detail.tsx`),
    loadTemplate(getTemplatePath('page', 'detail.tsx.tpl'), { Name: name, lowerName }),
  );

  writeGeneratedFile(
    path.join(partialsDir, 'index.tsx'),
    loadTemplate(getTemplatePath('page', 'partials-index.tsx.tpl'), { Name: name, lowerName }),
  );
  writeGeneratedFile(
    path.join(partialsDir, `${name}Table.tsx`),
    loadTemplate(getTemplatePath('page', 'partials-table.tsx.tpl'), { Name: name, lowerName }),
  );
  writeGeneratedFile(
    path.join(partialsDir, `CreateUpdate${name}Modal.tsx`),
    loadTemplate(getTemplatePath('page', 'partials-modal-create-update.tsx.tpl'), {
      Name: name,
      lowerName,
    }),
  );
}

function generateEntry(target: string, rawName: string) {
  const name = capitalize(rawName);
  const lowerName = lowerFirst(rawName);

  switch (target) {
    case 'interface':
      generateInterface(name, lowerName);
      break;
    case 'store':
      generateStore(name, lowerName);
      break;
    case 'service':
      generateService(name, lowerName);
      break;
    case 'page':
      generatePage(name, lowerName);
      break;
    case 'all':
      generateInterface(name, lowerName);
      generateStore(name, lowerName);
      generateService(name, lowerName);
      generatePage(name, lowerName);
      break;
    default:
      console.error(`❌ Target '${target}' không được hỗ trợ.`);
  }
}

module.exports = { generate: generateEntry };
