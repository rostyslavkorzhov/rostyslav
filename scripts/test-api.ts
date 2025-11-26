#!/usr/bin/env tsx
/**
 * API Endpoint Test Script
 * Tests the refactored API endpoints to ensure they work correctly
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: unknown;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  url: string,
  options?: RequestInit & { expectError?: boolean; expectedStatus?: number }
): Promise<TestResult> {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    
    const { expectError = false, expectedStatus = 400, ...fetchOptions } = options || {};
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    // For validation tests, we expect 400 errors
    if (expectError) {
      if (response.status === expectedStatus) {
        return {
          name,
          passed: true,
          details: { status: response.status, error: data.error || data.message },
        };
      }
      return {
        name,
        passed: false,
        error: `Expected HTTP ${expectedStatus}, got ${response.status}`,
        details: data,
      };
    }

    // For success tests, check for 200 and success field
    if (!response.ok) {
      return {
        name,
        passed: false,
        error: `HTTP ${response.status}: ${data.error || response.statusText}`,
        details: data,
      };
    }

    // Check response structure
    if (!data.success) {
      return {
        name,
        passed: false,
        error: 'Response missing success field or success is false',
        details: data,
      };
    }

    return {
      name,
      passed: true,
      details: data,
    };
  } catch (error) {
    return {
      name,
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Test 1: Screenshot capture endpoint - validation (expects 400)
  results.push(
    await testEndpoint(
      'POST /api/screenshot - Missing fields validation',
      `${BASE_URL}/api/screenshot`,
      {
        method: 'POST',
        body: JSON.stringify({}),
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Test 2: Screenshot capture endpoint - Invalid URL validation (expects 400)
  results.push(
    await testEndpoint(
      'POST /api/screenshot - Invalid URL validation',
      `${BASE_URL}/api/screenshot`,
      {
        method: 'POST',
        body: JSON.stringify({
          url: 'not-a-url',
          brandName: 'Test Brand',
          pageType: 'Homepage',
        }),
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Test 3: Screenshot capture endpoint - Invalid pageType validation (expects 400)
  results.push(
    await testEndpoint(
      'POST /api/screenshot - Invalid pageType validation',
      `${BASE_URL}/api/screenshot`,
      {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://example.com',
          brandName: 'Test Brand',
          pageType: 'InvalidType',
        }),
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Test 4: Screenshot status endpoint - Missing statusUrl (expects 400)
  results.push(
    await testEndpoint(
      'GET /api/screenshot/status - Missing statusUrl validation',
      `${BASE_URL}/api/screenshot/status`,
      {
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Test 5: Screenshot status endpoint - Invalid statusUrl format (expects 400)
  results.push(
    await testEndpoint(
      'GET /api/screenshot/status - Invalid statusUrl format',
      `${BASE_URL}/api/screenshot/status?statusUrl=not-a-url`,
      {
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Test 6: AI Analysis endpoint - Missing imageData (expects 400)
  results.push(
    await testEndpoint(
      'POST /api/screenshot/analyze - Missing imageData validation',
      `${BASE_URL}/api/screenshot/analyze`,
      {
        method: 'POST',
        body: JSON.stringify({}),
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Test 7: AI Analysis endpoint - Invalid imageData format (expects 400)
  results.push(
    await testEndpoint(
      'POST /api/screenshot/analyze - Invalid imageData format',
      `${BASE_URL}/api/screenshot/analyze`,
      {
        method: 'POST',
        body: JSON.stringify({
          imageData: 'not-valid-base64',
        }),
        expectError: true,
        expectedStatus: 400,
      }
    )
  );

  // Print results
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  results.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(50));

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. This might be expected for validation tests.');
    console.log('   To test with real API calls, ensure:');
    console.log('   1. .env.local has URLBOX_API_SECRET set');
    console.log('   2. .env.local has OPENAI_API_KEY or ANTHROPIC_API_KEY set');
    console.log('   3. Dev server is running on http://localhost:3000');
    process.exit(1);
  } else {
    console.log('\n✅ All validation tests passed!');
    process.exit(0);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});

