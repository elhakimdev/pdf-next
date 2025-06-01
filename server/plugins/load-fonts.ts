// server/plugins/load-fonts.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { fontsRegistry } from '~/lib/pdf/core/fonts'; // adjust as needed

export default defineNitroPlugin(async () => {
  const fontsDir = path.resolve('./assets/fonts/roboto');
  const files = await fs.readdir(fontsDir);

  for (const file of files) {
    if (file.endsWith('.ttf') || file.endsWith('.otf')) {
      const fontBuffer = await fs.readFile(path.join(fontsDir, file));
      const name = path.basename(file, path.extname(file)); // Roboto-BoldItalic
      console.log(`✅ Fonts loaded: ${name}`);
      fontsRegistry.registerFromBuffer(name, new Uint8Array(fontBuffer));
    }
  }
  console.log(`✅ All Fonts success fully loaded: ${files.length}`);
});
