const { DateTime } = require('luxon');
const crypto = require('crypto');

// Get current time in Africa/Lagos timezone
const lagosTime = DateTime.now().setZone('Africa/Lagos');

// Format: YYYYMMDDHHmm
const timestamp = lagosTime.toFormat('yyyyLLddHHmm');

// Generate a random alphanumeric string (e.g., 12 characters)
const randomSuffix = crypto.randomBytes(6).toString('hex'); // 12 hex characters

// Combine to form Request ID
const requestId = timestamp + randomSuffix;

module.exports = requestId