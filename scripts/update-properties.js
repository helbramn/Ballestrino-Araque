import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔄 Convirtiendo propiedades de YAML a TypeScript...\n');

try {
    // Leer el archivo YAML
    const yamlPath = path.join(__dirname, '..', 'properties.yml');
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    const properties = yaml.load(yamlContent);

    // Validar que sea un array
    if (!Array.isArray(properties)) {
        throw new Error('El archivo YAML debe contener un array de propiedades');
    }

    console.log(`📊 Propiedades encontradas: ${properties.length}`);

    // Contar destacadas
    const highlighted = properties.filter(p => p.highlighted === true).length;
    console.log(`⭐ Propiedades destacadas: ${highlighted}`);

    // Generar el contenido TypeScript
    const tsContent = `import type { Property } from '../types/property';

// ⚠️ ARCHIVO GENERADO AUTOMÁTICAMENTE
// No edites este archivo directamente. Edita properties.yml y ejecuta: npm run update-properties

export const properties: Property[] = ${JSON.stringify(properties, null, 2)};
`;

    // Escribir el archivo TypeScript
    const tsPath = path.join(__dirname, '..', 'src', 'data', 'properties.ts');
    fs.writeFileSync(tsPath, tsContent, 'utf8');

    console.log('✅ Archivo src/data/properties.ts actualizado correctamente');
    console.log('\n💡 La web se actualizará automáticamente si npm run dev está corriendo\n');

    process.exit(0);
} catch (error) {
    console.error('\n❌ Error al convertir propiedades:');
    console.error(`   ${error.message}\n`);

    if (error.message.includes('no such file')) {
        console.error('💡 Asegúrate de que el archivo properties.yml exists en la raíz del proyecto\n');
    } else if (error.message.includes('bad indentation')) {
        console.error('💡 Revisa la indentación del archivo YAML (debe usar 2 espacios)\n');
    }

    process.exit(1);
}
