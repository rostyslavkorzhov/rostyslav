# API Documentation

This document describes the API endpoints available in this application.

## Base URL

- **Local Development**: `http://localhost:3000/api`
- **Production**: `https://myapp.com/api`
- **Pre-production**: `https://preprod.myapp.com/api`

---

## Endpoints

### 1. Screenshot Creation

**Endpoint**: `POST /api/screenshot`

**Description**: Creates a screenshot of a webpage using the URLBOX API (async endpoint).

**Request Body**:
```json
{
  "url": "https://example.com",
  "brandName": "Example Brand",
  "pageType": "landing"
}
```

**Request Parameters**:
- `url` (string, required): The URL of the webpage to screenshot
- `brandName` (string, required): Name of the brand/website
- `pageType` (string, required): Type of page (e.g., "landing", "product", etc.)

**Response** (Success - 200):
```json
{
  "success": true,
  "renderId": "abc123",
  "statusUrl": "https://api.urlbox.com/v1/render/status/abc123",
  "metadata": {
    "url": "https://example.com",
    "brandName": "Example Brand",
    "pageType": "landing"
  }
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

**Environment Variables Required**:
- `URLBOX_API_SECRET`: API secret for URLBOX service

**Notes**:
- Uses URLBOX async endpoint for screenshot generation
- Returns a `renderId` and `statusUrl` for polling the status
- Screenshot format: WebP
- Full page screenshot with quality: 100

---

### 2. Screenshot Status Check

**Endpoint**: `GET /api/screenshot/status`

**Description**: Checks the status of a screenshot generation and retrieves the image when ready.

**Query Parameters**:
- `statusUrl` (string, required): The status URL returned from the screenshot creation endpoint

**Example Request**:
```
GET /api/screenshot/status?statusUrl=https://api.urlbox.com/v1/render/status/abc123
```

**Response** (In Progress):
```json
{
  "success": true,
  "status": "processing",
  "renderUrl": null,
  "imageData": null
}
```

**Response** (Completed - 200):
```json
{
  "success": true,
  "status": "succeeded",
  "renderUrl": "https://api.urlbox.com/v1/render/abc123",
  "imageData": "data:image/webp;base64,iVBORw0KGgoAAAANS..."
}
```

**Response** (Error - 400/500):
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

**Environment Variables Required**:
- `URLBOX_API_SECRET`: API secret for URLBOX service

**Notes**:
- Client should poll this endpoint until status is "succeeded" or "done"
- When complete, `imageData` contains the base64-encoded image
- Image format: WebP
- Has a 60-second timeout for image fetching

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Human-readable error message",
  "details": "Technical details or additional context"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (missing or invalid parameters)
- `500`: Internal Server Error (server-side issues)

---

## Authentication

All endpoints use environment variables for API authentication:
- URLBOX endpoints use Bearer token authentication
- AI analysis endpoints use API key authentication

No user authentication is required for these endpoints (they are server-side only).

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

---

## External Services

### URLBOX
- **Service**: Screenshot generation
- **Documentation**: https://urlbox.io/docs
- **Required**: `URLBOX_API_SECRET` environment variable

### Supabase
- **Service**: Database and authentication
- **Documentation**: https://supabase.com/docs
- **Required**: `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables

