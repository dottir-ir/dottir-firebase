import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Common type names that should be imported with 'type'
const TYPE_NAMES = new Set([
  'FC',
  'ReactNode',
  'User',
  'UserRole',
  'UserProfile',
  'Case',
  'CaseMetadata',
  'CaseUpload',
  'CaseFormData',
  'Comment',
  'CommentWithAuthor',
  'Like',
  'Save',
  'Notification',
  'VerificationRequest',
  'VerificationRequestWithUser',
  'DocumentData',
  'UserCredential',
  'FieldValues',
  'UseFormProps',
  'SubmitHandler',
  'DefaultValues',
  'InputProps',
  'SelectChangeEvent',
  'StepProps',
]);

// Common unused imports that should be removed
const UNUSED_IMPORTS = new Set([
  'React',
  'query',
  'where',
  'orderBy',
  'getDoc',
  'deleteDoc',
  'increment',
  'Timestamp',
  'CollectionReference',
  'ServiceError',
  'firebaseUpdateProfile',
  'updateProfile',
  'useParams',
  'Link',
  'authError',
  'errors',
  'register',
  'theme',
  'path',
]);

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let inImportBlock = false;
  let importBlock = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Start of import block
    if (line.startsWith('import ')) {
      inImportBlock = true;
      importBlock = [line];
      continue;
    }

    // End of import block
    if (inImportBlock && !line.startsWith('import ')) {
      inImportBlock = false;
      
      // Process import block
      const processedImports = processImportBlock(importBlock);
      newLines.push(...processedImports);
      newLines.push(line);
      continue;
    }

    // Inside import block
    if (inImportBlock) {
      importBlock.push(line);
      continue;
    }

    // Regular line
    newLines.push(line);
  }

  // Write back to file
  fs.writeFileSync(filePath, newLines.join('\n'));
}

function processImportBlock(importBlock) {
  const processedImports = [];
  const importMap = new Map();

  for (const line of importBlock) {
    const match = line.match(/import\s+{([^}]*)}\s+from\s+['"]([^'"]+)['"]/);
    if (!match) {
      processedImports.push(line);
      continue;
    }

    const [, imports, source] = match;
    const importItems = imports.split(',').map(item => item.trim());
    const typeImports = [];
    const valueImports = [];

    for (const item of importItems) {
      const [name, alias] = item.split(' as ').map(s => s.trim());
      const baseName = alias || name;

      if (UNUSED_IMPORTS.has(baseName)) {
        continue;
      }

      if (TYPE_NAMES.has(baseName)) {
        typeImports.push(item);
      } else {
        valueImports.push(item);
      }
    }

    if (typeImports.length > 0) {
      processedImports.push(`import type { ${typeImports.join(', ')} } from '${source}';`);
    }
    if (valueImports.length > 0) {
      processedImports.push(`import { ${valueImports.join(', ')} } from '${source}';`);
    }
  }

  return processedImports;
}

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['src/scripts/fix-type-imports.js', '**/node_modules/**', '**/dist/**']
});

// Process each file
files.forEach((file) => {
  console.log(`Processing ${file}...`);
  processFile(file);
});

console.log('Done!'); 