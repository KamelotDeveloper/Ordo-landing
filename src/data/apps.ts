export type Platform = 'windows' | 'macos' | 'linux';
export type AppStatus = 'available' | 'coming-soon';

export interface Installer {
  platform: Platform;
  label: string;
  file: string;
  version: string;
  size?: number;
}

export interface AppEntry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: AppStatus;
  featured?: boolean;
  installers: Installer[];
}

export const apps: AppEntry[] = [
  {
    slug: 'ordo',
    name: 'Ordo',
    tagline: 'ERP para gestionar tu empresa de punta a punta',
    description: 'Finanzas, inventario, ventas y operaciones en una sola plataforma.',
    category: 'ERP',
    status: 'available',
    featured: true,
    installers: [
      {
        platform: 'windows',
        label: 'Windows 10/11 (64-bit)',
        file: 'OrdoSetup-1.2.0.exe',
        version: '1.2.0',
      },
    ],
  },
  {
    slug: 'canyp',
    name: 'Canyp',
    tagline: 'Membresías, cobros y finanzas para tu club',
    description:
      'Gestioná socios, membresías y comprobantes de pago. Controlá ingresos y egresos por tipo de ingreso y seguí las finanzas del club en un solo lugar.',
    category: 'Clubes',
    status: 'available',
    installers: [
      {
        platform: 'windows',
        label: 'Windows 10/11 (64-bit)',
        file: 'CanypSetup-0.1.0.exe',
        version: '0.1.0',
      },
    ],
  },
];
