const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common imports that might be missing
const importMappings = {
  'useState': "import React, { useState, useEffect, useRef } from 'react';",
  'useEffect': "import React, { useState, useEffect, useRef } from 'react';",
  'Link': "import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';",
  'Routes': "import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';",
  'collection': "import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';",
  'getDocs': "import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';",
  'CaseService': "import { CaseService } from '@/services/CaseService';",
  'UserService': "import { UserService } from '@/services/UserService';",
};

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}');

// Process each file
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for missing imports
  let updatedContent = content;
  let importsToAdd = new Set();
  
  Object.keys(importMappings).forEach(key => {
    if (content.includes(key) && !content.includes(`import`) && !content.includes(`from`)) {
      importsToAdd.add(importMappings[key]);
    }
  });
  
  // Add missing imports at the top of the file
  if (importsToAdd.size > 0) {
    const imports = Array.from(importsToAdd).join('\n');
    updatedContent = imports + '\n\n' + content;
    fs.writeFileSync(file, updatedContent);
    console.log(`Updated ${file}`);
  }
}); 