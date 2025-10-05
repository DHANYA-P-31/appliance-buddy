import { addDays, subDays, subMonths, subYears } from 'date-fns';
import { Appliance, MaintenanceTask } from '@/types/appliance';
import { getMaintenanceStatus } from '@/utils/dateUtils';

const mkTask = (
  applianceId: string,
  taskName: string,
  offsetDays: number,
  frequency: 'One-time' | 'Monthly' | 'Yearly' | 'Custom',
  completed?: boolean,
  notes?: string,
  serviceProvider?: { name: string; phone?: string; email?: string; notes?: string }
): MaintenanceTask => {
  const now = new Date();
  const scheduledDate = addDays(now, offsetDays);
  const completedDate = completed ? subDays(scheduledDate, 1) : undefined;
  
  return {
    id: crypto.randomUUID(),
    applianceId,
    taskName,
    scheduledDate,
    frequency,
    notes,
    serviceProvider,
    status: getMaintenanceStatus(scheduledDate, completedDate),
    completedDate,
  };
};

export const generateMockAppliances = (now = new Date()): Appliance[] => {
  const appliances: Appliance[] = [];
  
  // Generate unique IDs for each appliance
  const ids = Array.from({ length: 22 }, () => crypto.randomUUID());
  
  // Whirlpool Dryer - Warranty expiring soon, mixed maintenance
  appliances.push({
    id: ids[0],
    name: 'Whirlpool Dryer',
    brand: 'Whirlpool',
    model: 'WED5620HW',
    purchaseDate: subMonths(now, 23),
    warrantyDurationMonths: 24,
    serialNumber: 'WHIR-DR-001',
    purchaseLocation: 'Home Depot',
    notes: 'Stackable dryer with steam refresh cycle',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Whirlpool Customer Service',
        company: 'Whirlpool Corporation',
        phone: '1-866-698-2538',
        email: 'customerservice@whirlpool.com',
        website: 'https://www.whirlpool.com/services/contact-us.html'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[0], 'Clean lint trap and exhaust vent', -10, 'Monthly', false, 'Check for blockages'),
      mkTask(ids[0], 'Professional duct cleaning', 14, 'Yearly', false, 'Schedule with HVAC service'),
      mkTask(ids[0], 'Drum cleaning cycle', -30, 'Monthly', true, 'Use dryer cleaning kit')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'User Manual', url: 'https://www.whirlpool.com/content/dam/global/documents/201706/user-instructions-W10751102-A.pdf' },
      { id: crypto.randomUUID(), title: 'Purchase Receipt', url: 'https://example.com/receipts/whirlpool-dryer' }
    ]
  });

  // Bosch Dishwasher - Expired warranty, overdue maintenance
  appliances.push({
    id: ids[1],
    name: 'Bosch Dishwasher',
    brand: 'Bosch',
    model: 'SHXM4AY55N',
    purchaseDate: subYears(now, 3),
    warrantyDurationMonths: 12,
    serialNumber: 'BOSCH-DW-002',
    purchaseLocation: 'Lowe\'s',
    notes: 'Third rack design with adjustable tines',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Bosch Customer Care',
        company: 'BSH Home Appliances',
        phone: '1-800-944-2904',
        email: 'support@bsh-group.com',
        website: 'https://www.bosch-home.com/us/service'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[1], 'Clean dishwasher filter', -5, 'Monthly', false, 'Remove and rinse filter'),
      mkTask(ids[1], 'Run cleaning cycle with cleaner', 7, 'Monthly', false),
      mkTask(ids[1], 'Check spray arms for clogs', -45, 'Monthly', true)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Installation Guide', url: 'https://www.bosch-home.com/us/service/installation' }
    ]
  });

  // Samsung TV - Active warranty
  appliances.push({
    id: ids[2],
    name: 'Samsung 55" QLED TV',
    brand: 'Samsung',
    model: 'QN55Q80C',
    purchaseDate: subMonths(now, 2),
    warrantyDurationMonths: 36,
    serialNumber: 'SAM-TV-003',
    purchaseLocation: 'Best Buy',
    notes: 'Quantum HDR 24x with Direct Full Array backlighting',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Samsung Support',
        company: 'Samsung Electronics',
        phone: '1-800-SAMSUNG',
        email: 'support@samsung.com',
        website: 'https://www.samsung.com/us/support/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[2], 'Dust screen and vents', -15, 'Monthly', true, 'Use microfiber cloth'),
      mkTask(ids[2], 'Software update check', 30, 'Monthly', false),
      mkTask(ids[2], 'Clean remote control', 45, 'Monthly', false)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'TV Receipt', url: 'https://example.com/receipts/samsung-tv' },
      { id: crypto.randomUUID(), title: 'Warranty Information', url: 'https://www.samsung.com/us/support/warranty/' }
    ]
  });

  // LG Refrigerator - Active warranty, upcoming maintenance
  appliances.push({
    id: ids[3],
    name: 'LG French Door Refrigerator',
    brand: 'LG',
    model: 'LRFVS3006S',
    purchaseDate: subMonths(now, 8),
    warrantyDurationMonths: 24,
    serialNumber: 'LG-REF-004',
    purchaseLocation: 'Costco',
    notes: 'InstaView Door-in-Door with craft ice maker',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'LG Customer Service',
        company: 'LG Electronics',
        phone: '1-800-243-0000',
        email: 'lgecs@lge.com',
        website: 'https://www.lg.com/us/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[3], 'Replace water filter', 5, 'Monthly', false, 'Model LT1000P filter', {
        name: 'Appliance Service Co',
        phone: '555-123-4567'
      }),
      mkTask(ids[3], 'Clean coils and vents', 90, 'Yearly', false),
      mkTask(ids[3], 'Ice maker cleaning', -60, 'Monthly', true, 'Used LG cleaning solution')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'User Manual', url: 'https://www.lg.com/us/support/product/lg-LRFVS3006S' }
    ]
  });

  // GE Washing Machine - Expired warranty
  appliances.push({
    id: ids[4],
    name: 'GE Top Load Washer',
    brand: 'GE',
    model: 'GTW465ASNWW',
    purchaseDate: subYears(now, 2),
    warrantyDurationMonths: 12,
    serialNumber: 'GE-WM-005',
    purchaseLocation: 'Home Depot',
    notes: 'Deep fill option with stainless steel basket',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'GE Appliances Service',
        company: 'GE Appliances',
        phone: '1-800-432-2737',
        website: 'https://www.geappliances.com/service'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[4], 'Run cleaning cycle', -3, 'Monthly', false, 'Use Tide Washing Machine Cleaner'),
      mkTask(ids[4], 'Check hoses for wear', 180, 'Yearly', false),
      mkTask(ids[4], 'Clean lint filter', -20, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // KitchenAid Stand Mixer - Active warranty
  appliances.push({
    id: ids[5],
    name: 'KitchenAid Stand Mixer',
    brand: 'KitchenAid',
    model: 'KSM150PSER',
    purchaseDate: subMonths(now, 4),
    warrantyDurationMonths: 12,
    serialNumber: 'KA-MX-006',
    purchaseLocation: 'Williams Sonoma',
    notes: 'Empire Red Artisan Series with tilt-head design',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'KitchenAid Customer Service',
        company: 'Whirlpool Corporation',
        phone: '1-800-541-6390',
        website: 'https://www.kitchenaid.com/customer-service'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[5], 'Deep clean mixer head and bowl', 20, 'Monthly', false),
      mkTask(ids[5], 'Oil gearbox', 365, 'Yearly', false, 'Professional service recommended'),
      mkTask(ids[5], 'Inspect attachments', -10, 'Monthly', true)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Recipe Book', url: 'https://www.kitchenaid.com/recipes' }
    ]
  });

  // Dyson Vacuum - Warranty expiring soon
  appliances.push({
    id: ids[6],
    name: 'Dyson V15 Detect',
    brand: 'Dyson',
    model: 'V15 Detect Absolute',
    purchaseDate: subMonths(now, 23),
    warrantyDurationMonths: 24,
    serialNumber: 'DY-VAC-007',
    purchaseLocation: 'Target',
    notes: 'Laser dust detection with LCD screen',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Dyson Customer Service',
        company: 'Dyson Inc.',
        phone: '1-844-396-7968',
        website: 'https://www.dyson.com/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[6], 'Empty dust bin and clean filter', -2, 'Monthly', false),
      mkTask(ids[6], 'Check brush bar for tangles', 15, 'Monthly', false),
      mkTask(ids[6], 'Wash filter', -25, 'Monthly', true, 'Allowed to dry for 24 hours')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'User Guide', url: 'https://www.dyson.com/support/journey/overview/988586-01' }
    ]
  });

  // Nest Thermostat - Active warranty
  appliances.push({
    id: ids[7],
    name: 'Google Nest Learning Thermostat',
    brand: 'Google',
    model: 'T3007ES',
    purchaseDate: subMonths(now, 6),
    warrantyDurationMonths: 24,
    serialNumber: 'NEST-TH-008',
    purchaseLocation: 'Google Store',
    notes: 'Third generation with auto-schedule and energy history',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Nest Support',
        company: 'Google LLC',
        phone: '1-855-469-6378',
        website: 'https://support.google.com/googlenest'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[7], 'Software update check', 30, 'Monthly', false),
      mkTask(ids[7], 'Clean display and sensors', 90, 'Monthly', false),
      mkTask(ids[7], 'Check WiFi connectivity', -40, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Instant Pot - Expired warranty
  appliances.push({
    id: ids[8],
    name: 'Instant Pot Duo',
    brand: 'Instant Pot',
    model: 'DUO60',
    purchaseDate: subYears(now, 3),
    warrantyDurationMonths: 12,
    serialNumber: 'IP-POT-009',
    purchaseLocation: 'Amazon',
    notes: '6-quart 7-in-1 multi-use pressure cooker',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Instant Pot Support',
        company: 'Instant Brands',
        phone: '1-800-828-7280',
        website: 'https://instantpot.com/support/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[8], 'Deep clean sealing ring', -8, 'Monthly', false, 'Check for odors and stains'),
      mkTask(ids[8], 'Inspect steam release valve', 25, 'Monthly', false),
      mkTask(ids[8], 'Clean float valve', -35, 'Monthly', true)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Recipe App', url: 'https://instantpot.com/instantpot-app/' }
    ]
  });

  // Breville Espresso Machine - Active warranty
  appliances.push({
    id: ids[9],
    name: 'Breville Barista Express',
    brand: 'Breville',
    model: 'BES870XL',
    purchaseDate: subMonths(now, 3),
    warrantyDurationMonths: 24,
    serialNumber: 'BRV-ESP-010',
    purchaseLocation: 'Crate & Barrel',
    notes: 'Built-in conical burr grinder with dose control',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Breville Customer Service',
        company: 'Breville USA',
        phone: '1-866-273-8455',
        website: 'https://www.breville.com/us/en/support.html'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[9], 'Descale machine', 10, 'Monthly', false, 'Use Breville descaling solution', {
        name: 'Coffee Equipment Service',
        phone: '555-987-6543',
        email: 'service@coffeeequip.com'
      }),
      mkTask(ids[9], 'Clean grinder burrs', 60, 'Monthly', false),
      mkTask(ids[9], 'Backflush group head', -5, 'Monthly', true, 'Used Cafiza cleaning powder')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Operating Manual', url: 'https://www.breville.com/content/dam/breville/country-sites/global/instruction-booklet/espresso/bes870xl_ib_b17.pdf' }
    ]
  });

  // Vitamix Blender - Warranty expiring soon
  appliances.push({
    id: ids[10],
    name: 'Vitamix 5200',
    brand: 'Vitamix',
    model: '5200 Standard',
    purchaseDate: subYears(now, 7),
    warrantyDurationMonths: 84,
    serialNumber: 'VIT-BL-011',
    purchaseLocation: 'Vitamix.com',
    notes: '2-peak horsepower motor with 7-year warranty',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Vitamix Customer Service',
        company: 'Vitamix Corporation',
        phone: '1-800-848-2649',
        website: 'https://www.vitamix.com/us/en_us/customer-service'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[10], 'Deep clean blades and container', 12, 'Monthly', false),
      mkTask(ids[10], 'Check motor base ventilation', 180, 'Yearly', false),
      mkTask(ids[10], 'Lubricate drive socket', -90, 'Yearly', true, 'Professional service completed')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Getting Started Guide', url: 'https://www.vitamix.com/us/en_us/learn/getting-started' }
    ]
  });

  // Air Fryer - Active warranty
  appliances.push({
    id: ids[11],
    name: 'Ninja Foodi Air Fryer',
    brand: 'Ninja',
    model: 'AF101',
    purchaseDate: subMonths(now, 5),
    warrantyDurationMonths: 12,
    serialNumber: 'NJ-AF-012',
    purchaseLocation: 'Bed Bath & Beyond',
    notes: '4-quart capacity with crisp plate',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Ninja Customer Service',
        company: 'SharkNinja',
        phone: '1-877-646-5288',
        website: 'https://www.ninjakitchen.com/support/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[11], 'Clean basket and crisper plate', -1, 'Monthly', false),
      mkTask(ids[11], 'Wipe down interior', 7, 'Monthly', false),
      mkTask(ids[11], 'Check heating elements', -14, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Microwave - Expired warranty
  appliances.push({
    id: ids[12],
    name: 'Panasonic Microwave',
    brand: 'Panasonic',
    model: 'NN-SN966S',
    purchaseDate: subYears(now, 4),
    warrantyDurationMonths: 12,
    serialNumber: 'PAN-MW-013',
    purchaseLocation: 'Target',
    notes: '2.2 cu ft with inverter technology',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Panasonic Customer Care',
        company: 'Panasonic Corporation',
        phone: '1-800-211-7262',
        website: 'https://www.panasonic.com/us/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[12], 'Clean interior and turntable', -6, 'Monthly', false),
      mkTask(ids[12], 'Check door seals', 120, 'Yearly', false),
      mkTask(ids[12], 'Clean ventilation grille', -50, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Robot Vacuum - Active warranty
  appliances.push({
    id: ids[13],
    name: 'iRobot Roomba i7+',
    brand: 'iRobot',
    model: 'i7+',
    purchaseDate: subMonths(now, 7),
    warrantyDurationMonths: 12,
    serialNumber: 'IRB-RV-014',
    purchaseLocation: 'iRobot.com',
    notes: 'Self-emptying with smart mapping',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'iRobot Customer Care',
        company: 'iRobot Corporation',
        phone: '1-877-855-8593',
        website: 'https://homesupport.irobot.com/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[13], 'Empty dust bin', -4, 'Monthly', false),
      mkTask(ids[13], 'Clean brushes and filter', 21, 'Monthly', false),
      mkTask(ids[13], 'Replace filter', -28, 'Monthly', true, 'Used genuine iRobot filter')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'iRobot HOME App', url: 'https://www.irobot.com/irobot-home-app' }
    ]
  });

  // Dehumidifier - Warranty expiring soon
  appliances.push({
    id: ids[14],
    name: 'Frigidaire Dehumidifier',
    brand: 'Frigidaire',
    model: 'FFAD7033R1',
    purchaseDate: subMonths(now, 11),
    warrantyDurationMonths: 12,
    serialNumber: 'FRG-DH-015',
    purchaseLocation: 'Lowe\'s',
    notes: '70-pint capacity with built-in pump',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Frigidaire Support',
        company: 'Electrolux',
        phone: '1-877-435-3287',
        website: 'https://www.frigidaire.com/support/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[14], 'Clean filter and coils', 8, 'Monthly', false),
      mkTask(ids[14], 'Check drainage hose', 45, 'Monthly', false),
      mkTask(ids[14], 'Empty water bucket', -12, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Space Heater - Expired warranty
  appliances.push({
    id: ids[15],
    name: 'Dyson Hot+Cool',
    brand: 'Dyson',
    model: 'HP01',
    purchaseDate: subYears(now, 3),
    warrantyDurationMonths: 24,
    serialNumber: 'DY-HC-016',
    purchaseLocation: 'Best Buy',
    notes: 'Bladeless heater and fan with remote control',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Dyson Customer Service',
        company: 'Dyson Inc.',
        phone: '1-844-396-7968',
        website: 'https://www.dyson.com/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[15], 'Clean filter and housing', -9, 'Monthly', false),
      mkTask(ids[15], 'Check for obstructions', 30, 'Monthly', false),
      mkTask(ids[15], 'Wipe down exterior', -55, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Garbage Disposal - Active warranty
  appliances.push({
    id: ids[16],
    name: 'InSinkErator Evolution Excel',
    brand: 'InSinkErator',
    model: 'Evolution Excel',
    purchaseDate: subMonths(now, 1),
    warrantyDurationMonths: 84,
    serialNumber: 'ISE-GD-017',
    purchaseLocation: 'Ferguson',
    notes: '1.0 HP with SoundSeal technology',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'InSinkErator Customer Service',
        company: 'Emerson Electric',
        phone: '1-800-558-5700',
        website: 'https://www.insinkerator.com/us/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[16], 'Run cleaning cycle with ice', 14, 'Monthly', false),
      mkTask(ids[16], 'Check for leaks', 90, 'Monthly', false),
      mkTask(ids[16], 'Sharpen blades with ice', -7, 'Monthly', true, 'Used 2 cups of ice cubes')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Installation Guide', url: 'https://www.insinkerator.com/us/support/installation-support' }
    ]
  });

  // Water Heater - Active warranty
  appliances.push({
    id: ids[17],
    name: 'Rheem Water Heater',
    brand: 'Rheem',
    model: 'XE50T10H45U0',
    purchaseDate: subMonths(now, 18),
    warrantyDurationMonths: 120,
    serialNumber: 'RHM-WH-018',
    purchaseLocation: 'Local Plumbing Supply',
    notes: '50-gallon electric with 10-year warranty',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Rheem Customer Service',
        company: 'Rheem Manufacturing',
        phone: '1-800-432-8373',
        website: 'https://www.rheem.com/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[17], 'Flush tank for sediment', 30, 'Yearly', false, 'Professional service recommended', {
        name: 'City Plumbing Services',
        phone: '555-234-5678',
        email: 'service@cityplumbing.com'
      }),
      mkTask(ids[17], 'Check anode rod', 180, 'Yearly', false),
      mkTask(ids[17], 'Test temperature relief valve', -120, 'Yearly', true, 'Valve functioning properly')
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Warranty Information', url: 'https://www.rheem.com/warranty/residential-water-heating' }
    ]
  });

  // Range/Oven - Active warranty
  appliances.push({
    id: ids[18],
    name: 'GE Cafe Range',
    brand: 'GE',
    model: 'CGS700P2MS1',
    purchaseDate: subMonths(now, 9),
    warrantyDurationMonths: 12,
    serialNumber: 'GE-RNG-019',
    purchaseLocation: 'Home Depot',
    notes: '30" slide-in gas range with convection oven',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'GE Appliances Service',
        company: 'GE Appliances',
        phone: '1-800-432-2737',
        website: 'https://www.geappliances.com/service'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[18], 'Clean oven interior', 22, 'Monthly', false),
      mkTask(ids[18], 'Check gas connections', 365, 'Yearly', false, 'Professional inspection required'),
      mkTask(ids[18], 'Clean burner grates', -18, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Wine Cooler - Warranty expiring soon
  appliances.push({
    id: ids[19],
    name: 'NewAir Wine Cooler',
    brand: 'NewAir',
    model: 'AWR-460DB',
    purchaseDate: subMonths(now, 11),
    warrantyDurationMonths: 12,
    serialNumber: 'NA-WC-020',
    purchaseLocation: 'Wine Enthusiast',
    notes: '46-bottle dual zone wine refrigerator',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'NewAir Customer Service',
        company: 'NewAir',
        phone: '1-855-963-9247',
        website: 'https://www.newair.com/support'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[19], 'Clean interior and shelves', 16, 'Monthly', false),
      mkTask(ids[19], 'Check temperature sensors', 120, 'Monthly', false),
      mkTask(ids[19], 'Clean condenser coils', -75, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  // Security System - Active warranty
  appliances.push({
    id: ids[20],
    name: 'Ring Alarm Pro',
    brand: 'Ring',
    model: 'Alarm Pro Base Station',
    purchaseDate: subMonths(now, 4),
    warrantyDurationMonths: 12,
    serialNumber: 'RNG-SEC-021',
    purchaseLocation: 'Amazon',
    notes: 'Built-in eero Wi-Fi 6 router with cellular backup',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Ring Support',
        company: 'Amazon',
        phone: '1-800-656-1918',
        website: 'https://support.ring.com/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[20], 'Test all sensors', 28, 'Monthly', false),
      mkTask(ids[20], 'Update firmware', 60, 'Monthly', false),
      mkTask(ids[20], 'Check battery levels', -21, 'Monthly', true)
    ],
    linkedDocuments: [
      { id: crypto.randomUUID(), title: 'Ring App', url: 'https://ring.com/app' }
    ]
  });

  // Soundbar - Expired warranty
  appliances.push({
    id: ids[21],
    name: 'Sonos Arc Soundbar',
    brand: 'Sonos',
    model: 'Arc',
    purchaseDate: subYears(now, 2),
    warrantyDurationMonths: 12,
    serialNumber: 'SON-SB-022',
    purchaseLocation: 'Sonos.com',
    notes: 'Dolby Atmos soundbar with voice control',
    supportContacts: [
      {
        id: crypto.randomUUID(),
        name: 'Sonos Customer Care',
        company: 'Sonos Inc.',
        phone: '1-800-680-2345',
        website: 'https://support.sonos.com/'
      }
    ],
    maintenanceTasks: [
      mkTask(ids[21], 'Software update check', 45, 'Monthly', false),
      mkTask(ids[21], 'Clean grille and sensors', 90, 'Monthly', false),
      mkTask(ids[21], 'Check WiFi connectivity', -30, 'Monthly', true)
    ],
    linkedDocuments: []
  });

  return appliances;
};