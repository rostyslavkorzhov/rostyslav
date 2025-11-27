import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

/**
 * Script to upload Casper screenshots to Supabase Storage
 * and update page records with the URLs
 */
async function uploadCasperScreenshots() {
  // Supabase project URL (from MCP or environment)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdvqopcdfeedafizqxqx.supabase.co';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceRoleKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
    console.error('Please set it in .env.local or export it before running:');
    console.error('  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    console.error('  npx tsx scripts/upload-casper-screenshots.ts');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const brandId = 'bad43fad-3fa1-460c-b31a-f1b0c3b55c77'; // Casper brand ID
  const bucketName = 'screenshots';

  // File paths - update these to match your screenshot files
  const mobileHomePath = join(process.cwd(), 'screencapture-casper-2025-11-27-20_18_11.png');
  const desktopProductPath = join(process.cwd(), 'slice 1 - 019ab248-82de-7490-9b2e-d1e392fdfbed_pa.png');
  // Add path for mobile product screenshot when available
  // const mobileProductPath = join(process.cwd(), 'casper-product-mobile.png');

  try {
    // Read image files
    console.log('Reading image files...');
    const mobileHomeBuffer = readFileSync(mobileHomePath);
    const desktopProductBuffer = readFileSync(desktopProductPath);
    // Uncomment when mobile product screenshot is available:
    // const mobileProductBuffer = readFileSync(mobileProductPath);

    // Generate unique file names
    const timestamp = Date.now();
    const mobileHomeFileName = `casper/home-mobile-${timestamp}.png`;
    const desktopProductFileName = `casper/product-desktop-${timestamp}.png`;
    // Uncomment when mobile product screenshot is available:
    // const mobileProductFileName = `casper/product-mobile-${timestamp}.png`;

    // Upload mobile homepage screenshot
    console.log('Uploading mobile homepage screenshot...');
    const { data: mobileHomeData, error: mobileHomeError } = await supabase.storage
      .from(bucketName)
      .upload(mobileHomeFileName, mobileHomeBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (mobileHomeError) {
      throw new Error(`Failed to upload mobile homepage: ${mobileHomeError.message}`);
    }

    // Get public URL for mobile homepage
    const { data: mobileHomeUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(mobileHomeFileName);

    const mobileHomeUrl = mobileHomeUrlData.publicUrl;
    console.log(`✓ Mobile homepage uploaded: ${mobileHomeUrl}`);

    // Upload desktop product page screenshot
    console.log('Uploading desktop product page screenshot...');
    const { data: desktopProductData, error: desktopProductError } = await supabase.storage
      .from(bucketName)
      .upload(desktopProductFileName, desktopProductBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (desktopProductError) {
      throw new Error(`Failed to upload desktop product page: ${desktopProductError.message}`);
    }

    // Get public URL for desktop product page
    const { data: desktopProductUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(desktopProductFileName);

    const desktopProductUrl = desktopProductUrlData.publicUrl;
    console.log(`✓ Desktop product page uploaded: ${desktopProductUrl}`);

    // Update page records
    console.log('Updating page records...');

    // Get page type IDs
    const { data: pageTypes } = await supabase
      .from('page_types')
      .select('id, slug')
      .in('slug', ['home', 'product']);

    if (!pageTypes || pageTypes.length !== 2) {
      throw new Error('Failed to fetch page types');
    }

    const homePageTypeId = pageTypes.find((pt) => pt.slug === 'home')?.id;
    const productPageTypeId = pageTypes.find((pt) => pt.slug === 'product')?.id;

    if (!homePageTypeId || !productPageTypeId) {
      throw new Error('Failed to find page type IDs');
    }

    // Update mobile homepage
    const { error: updateMobileHomeError } = await supabase
      .from('pages')
      .update({ screenshot_url: mobileHomeUrl })
      .eq('brand_id', brandId)
      .eq('page_type_id', homePageTypeId)
      .eq('view', 'mobile');

    if (updateMobileHomeError) {
      throw new Error(`Failed to update mobile homepage: ${updateMobileHomeError.message}`);
    }
    console.log('✓ Mobile homepage record updated');

    // Update desktop product page
    const { error: updateDesktopProductError } = await supabase
      .from('pages')
      .update({ screenshot_url: desktopProductUrl })
      .eq('brand_id', brandId)
      .eq('page_type_id', productPageTypeId)
      .eq('view', 'desktop');

    if (updateDesktopProductError) {
      throw new Error(`Failed to update desktop product page: ${updateDesktopProductError.message}`);
    }
    console.log('✓ Desktop product page record updated');

    // Uncomment this section when mobile product screenshot is available:
    /*
    // Upload mobile product page screenshot
    console.log('Uploading mobile product page screenshot...');
    const { data: mobileProductData, error: mobileProductError } = await supabase.storage
      .from(bucketName)
      .upload(mobileProductFileName, mobileProductBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (mobileProductError) {
      throw new Error(`Failed to upload mobile product page: ${mobileProductError.message}`);
    }

    // Get public URL for mobile product page
    const { data: mobileProductUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(mobileProductFileName);

    const mobileProductUrl = mobileProductUrlData.publicUrl;
    console.log(`✓ Mobile product page uploaded: ${mobileProductUrl}`);

    // Update mobile product page
    const { error: updateMobileProductError } = await supabase
      .from('pages')
      .update({ screenshot_url: mobileProductUrl })
      .eq('brand_id', brandId)
      .eq('page_type_id', productPageTypeId)
      .eq('view', 'mobile');

    if (updateMobileProductError) {
      throw new Error(`Failed to update mobile product page: ${updateMobileProductError.message}`);
    }
    console.log('✓ Mobile product page record updated');
    */

    console.log('\n✅ All screenshots uploaded and page records updated successfully!');
    console.log(`\nMobile Homepage URL: ${mobileHomeUrl}`);
    console.log(`Desktop Product Page URL: ${desktopProductUrl}`);
    // console.log(`Mobile Product Page URL: ${mobileProductUrl}`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the script
uploadCasperScreenshots();

