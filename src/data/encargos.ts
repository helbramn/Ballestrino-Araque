import type { Encargo } from '../types/encargo';

export const encargos: Encargo[] = [
    {
        id: '1',
        name: 'Familia García',
        email: 'ejemplo@email.com',
        phone: '600000000',
        operation: 'venta',
        type: 'Casa',
        priceMax: 450000,
        zone: 'Pedraza / Sepúlveda',
        description: 'Familia busca casa de piedra con jardín amplio (min 500m2). Valoramos privacidad y vistas a la sierra.',
        createdAt: '2023-11-15'
    },
    {
        id: '2',
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '600000000',
        operation: 'alquiler',
        type: 'Piso',
        priceMax: 1200,
        zone: 'Segovia Capital (Casco Antiguo)',
        description: 'Funcionario busca piso céntrico con encanto, preferiblemente amueblado y con calefacción individual.',
        createdAt: '2023-11-20'
    },
    {
        id: '3',
        name: 'Inversiones SL',
        email: 'info@inversiones.com',
        phone: '600000000',
        operation: 'venta',
        type: 'Casa',
        priceMax: 250000,
        zone: 'Torrecaballeros / La Granja',
        description: 'Inversor busca propiedad para rehabilitar. No importa estado, imprescindible buena estructura y ubicación.',
        createdAt: '2023-11-25'
    },
    {
        id: '4',
        name: 'Marta López',
        email: 'marta@email.com',
        phone: '600000000',
        operation: 'venta',
        type: 'Finca',
        priceMax: 600000,
        zone: 'Riaza / Ayllón',
        description: 'Busco finca de recreo con vivienda principal y casa de invitados. Mínimo 2 hectáreas de terreno.',
        createdAt: '2023-11-28'
    }
];
