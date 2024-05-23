import * as fs from 'fs';
import * as path from 'path';

export function loadCategoriesFromFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const categories = JSON.parse(data);
          resolve(categories);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}
