import type { Encargo } from '../types/encargo';

export const encargos: Encargo[] = [
    {
        id: '1',
        operation: 'compra',
        budget: 450000,
        zone: 'Pedraza / Sepúlveda',
        description: 'Familia busca casa de piedra con jardín amplio (min 500m2). Valoramos privacidad y vistas a la sierra.',
        createdAt: '2023-11-15'
    },
    {
        id: '2',
        operation: 'alquiler',
        budget: 1200,
        zone: 'Segovia Capital (Casco Antiguo)',
        description: 'Funcionario busca piso céntrico con encanto, preferiblemente amueblado y con calefacción individual.',
        createdAt: '2023-11-20'
    },
    {
        id: '3',
        operation: 'compra',
        budget: 250000,
        zone: 'Torrecaballeros / La Granja',
        description: 'Inversor busca propiedad para rehabilitar. No importa estado, imprescindible buena estructura y ubicación.',
        createdAt: '2023-11-25'
    },
    {
        id: '4',
        operation: 'compra',
        budget: 600000,
        zone: 'Riaza / Ayllón',
        description: 'Busco finca de recreo con vivienda principal y casa de invitados. Mínimo 2 hectáreas de terreno.',
        createdAt: '2023-11-28'
    }
];
