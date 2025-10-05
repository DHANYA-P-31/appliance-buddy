import { db, connectDB, disconnectDB } from '../config/database';
import { appliances, supportContacts, maintenanceTasks, linkedDocuments } from '../db/schema';

// Sample seed data based on frontend mock data
const seedData = {
  appliances: [
    {
      name: 'Whirlpool Dryer',
      brand: 'Whirlpool',
      model: 'WED5620HW',
      purchaseDate: new Date('2023-01-15'),
      warrantyDurationMonths: 24,
      serialNumber: 'WHIR-DR-001',
      purchaseLocation: 'Home Depot',
      notes: 'Stackable dryer with steam refresh cycle',
    },
    {
      name: 'Samsung 55" QLED TV',
      brand: 'Samsung',
      model: 'QN55Q80C',
      purchaseDate: new Date('2024-07-01'),
      warrantyDurationMonths: 36,
      serialNumber: 'SAM-TV-003',
      purchaseLocation: 'Best Buy',
      notes: 'Quantum HDR 24x with Direct Full Array backlighting',
    },
    {
      name: 'LG French Door Refrigerator',
      brand: 'LG',
      model: 'LRFVS3006S',
      purchaseDate: new Date('2024-01-15'),
      warrantyDurationMonths: 24,
      serialNumber: 'LG-REF-004',
      purchaseLocation: 'Costco',
      notes: 'InstaView Door-in-Door with craft ice maker',
    }
  ]
};

export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');

    // Ensure database connection is established
    await connectDB();
    console.log('🔗 Database connected successfully');

    // Clear existing data
    await db.delete(linkedDocuments);
    await db.delete(maintenanceTasks);
    await db.delete(supportContacts);
    await db.delete(appliances);

    console.log('🧹 Cleared existing data');

    // Insert appliances
    const insertedAppliances = await db
      .insert(appliances)
      .values(seedData.appliances)
      .returning();

    console.log(`📱 Inserted ${insertedAppliances.length} appliances`);

    // Insert support contacts for each appliance
    for (const appliance of insertedAppliances) {
      await db.insert(supportContacts).values({
        applianceId: appliance.id,
        name: `${appliance.brand} Customer Service`,
        company: `${appliance.brand} Corporation`,
        phone: '1-800-555-0000',
        email: `support@${appliance.brand.toLowerCase()}.com`,
        website: `https://www.${appliance.brand.toLowerCase()}.com/support`,
      });

      // Insert sample maintenance tasks
      await db.insert(maintenanceTasks).values([
        {
          applianceId: appliance.id,
          taskName: 'General cleaning and inspection',
          scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          frequency: 'Monthly',
          status: 'Upcoming',
          notes: 'Regular maintenance task',
        },
        {
          applianceId: appliance.id,
          taskName: 'Filter replacement',
          scheduledDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          frequency: 'Yearly',
          status: 'Upcoming',
          notes: 'Replace filters as needed',
        }
      ]);

      // Insert sample documents
      await db.insert(linkedDocuments).values([
        {
          applianceId: appliance.id,
          title: 'User Manual',
          url: `https://www.${appliance.brand.toLowerCase()}.com/manuals/${appliance.model}`,
        },
        {
          applianceId: appliance.id,
          title: 'Warranty Information',
          url: `https://www.${appliance.brand.toLowerCase()}.com/warranty`,
        }
      ]);
    }

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(async () => {
      console.log('Seeding completed. Disconnecting...');
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('Seeding failed:', error);
      try {
        await disconnectDB();
      } catch (disconnectError) {
        console.error('Error disconnecting:', disconnectError);
      }
      process.exit(1);
    });
}