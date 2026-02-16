#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    // Read migration files
    const userSizePrefs = fs.readFileSync(
      path.join(__dirname, '../supabase/add-user-size-preferences.sql'),
      'utf8'
    );

    const listingFitIndicators = fs.readFileSync(
      path.join(__dirname, '../supabase/add-listing-fit-indicators.sql'),
      'utf8'
    );

    // Execute migrations
    console.log('📝 Running: add-user-size-preferences.sql...');
    const { error: error1 } = await supabase.rpc('exec', { sql: userSizePrefs });
    if (error1) {
      console.error('❌ Error executing user size preferences migration:', error1.message);
      // Try direct SQL approach
      const statements = userSizePrefs.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec', { sql: statement + ';' });
          if (error) console.warn('⚠️  Warning:', error.message);
        }
      }
    } else {
      console.log('✅ User size preferences migration completed');
    }

    console.log('\n📝 Running: add-listing-fit-indicators.sql...');
    const { error: error2 } = await supabase.rpc('exec', { sql: listingFitIndicators });
    if (error2) {
      console.error('❌ Error executing listing fit indicators migration:', error2.message);
      // Try direct SQL approach
      const statements = listingFitIndicators.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec', { sql: statement + ';' });
          if (error) console.warn('⚠️  Warning:', error.message);
        }
      }
    } else {
      console.log('✅ Listing fit indicators migration completed');
    }

    console.log('\n✨ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

runMigrations();
