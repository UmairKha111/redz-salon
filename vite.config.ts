import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'save-cms-plugin',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/save-cms' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body);
                  const filePath = path.resolve(process.cwd(), 'src/data/cmsData.ts');
                  
                  // Read current file to preserve structure but update the exported variables
                  let content = fs.readFileSync(filePath, 'utf-8');
                  
                   // Helper function to replace variable value in file content deterministically (no regex backtracking)
                  const replaceVar = (varName: string, newValue: any) => {
                    const possibleStarts = [
                      `export const ${varName}:`,
                      `export const ${varName} =`,
                      `export const ${varName} :`
                    ];
                    
                    let startIndex = -1;
                    for (const startStr of possibleStarts) {
                      startIndex = content.indexOf(startStr);
                      if (startIndex !== -1) break;
                    }
                    
                    if (startIndex === -1) return;
                    
                    // Find the equals sign and the start of the value
                    const equalsIndex = content.indexOf('=', startIndex);
                    if (equalsIndex === -1) return;
                    
                    const searchFrom = equalsIndex + 1;
                    const possibleEnds = [
                      'export const',
                      'export function',
                      '// Static exports',
                      '// Reactive custom hook'
                    ];
                    
                    let nextDeclIndex = -1;
                    for (const endStr of possibleEnds) {
                      const idx = content.indexOf(endStr, searchFrom);
                      if (idx !== -1 && (nextDeclIndex === -1 || idx < nextDeclIndex)) {
                        nextDeclIndex = idx;
                      }
                    }
                    
                    if (nextDeclIndex === -1) {
                      nextDeclIndex = content.length;
                    }
                    
                    // Find the last semicolon before the next declaration
                    let semiIndex = content.lastIndexOf(';', nextDeclIndex);
                    if (semiIndex === -1 || semiIndex < searchFrom) {
                      semiIndex = nextDeclIndex;
                    }
                    
                    const jsonStr = JSON.stringify(newValue, null, 2);
                    
                    // Perform the precise slicing and replacement
                    const prefix = content.substring(0, equalsIndex + 1) + " ";
                    const suffix = content.substring(semiIndex);
                    content = prefix + jsonStr + suffix;
                  };

                  if (parsed.brandInfo) replaceVar('DEFAULT_BRAND_INFO', parsed.brandInfo);
                  if (parsed.heroSection) replaceVar('DEFAULT_HERO_SECTION', parsed.heroSection);
                  if (parsed.highlights) replaceVar('DEFAULT_HIGHLIGHTS', parsed.highlights);
                  if (parsed.portfolioItems) replaceVar('DEFAULT_PORTFOLIO_ITEMS', parsed.portfolioItems);
                  if (parsed.services) replaceVar('DEFAULT_SERVICES', parsed.services);
                  if (parsed.testimonials) replaceVar('DEFAULT_TESTIMONIALS', parsed.testimonials);
                  if (parsed.FAQs) replaceVar('DEFAULT_FAQS', parsed.FAQs);

                  fs.writeFileSync(filePath, content, 'utf-8');
                  
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ status: 'success' }));
                } catch (error) {
                  console.error('Save CMS error:', error);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Failed to write file' }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
