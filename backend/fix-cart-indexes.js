const mongoose = require('mongoose');
require('dotenv').config();

async function fixCartIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const cartCollection = db.collection('carts');

    // 1. Drop existing indexes
    console.log('Dropping existing indexes...');
    try {
      await cartCollection.dropIndexes();
      console.log('✓ Dropped all indexes');
    } catch (error) {
      console.log('No indexes to drop or error:', error.message);
    }

    // 2. Remove all carts with user: null (old guest cart logic)
    console.log('Removing carts with user: null...');
    const deleteResult = await cartCollection.deleteMany({ user: null });
    console.log(`✓ Deleted ${deleteResult.deletedCount} carts with user: null`);

    // 3. Create new indexes
    console.log('Creating new indexes...');
    
    // Create sparse index on user field (only for documents that have user field)
    await cartCollection.createIndex({ user: 1 }, { 
      unique: true, 
      sparse: true,
      name: 'user_1_sparse'
    });
    console.log('✓ Created sparse unique index on user field');

    // Create sparse index on sessionId field (only for documents that have sessionId field)
    await cartCollection.createIndex({ sessionId: 1 }, { 
      unique: true, 
      sparse: true,
      name: 'sessionId_1_sparse'
    });
    console.log('✓ Created sparse unique index on sessionId field');

    // 4. Verify indexes
    console.log('\nVerifying indexes...');
    const indexes = await cartCollection.indexes();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Cart indexes fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing cart indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixCartIndexes(); 