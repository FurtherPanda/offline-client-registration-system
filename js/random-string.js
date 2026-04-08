/**
 * Converts a Uint8Array to a Base64 string.
 * @param {Uint8Array} bytes The array of random bytes.
 * @returns {string} The Base64 encoded string.
 */
function bytesToBase64(bytes) {
    // btoa() requires a "binary string" (where each character is a single byte)
    // We convert the Uint8Array to a binary string first.
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Generates a cryptographically secure, URL-safe random string.
 * @param {number} length The desired length of the resulting string.
 * @returns {string} The random string.
 */
function randomString(length) {
    // Check for necessary API support
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) {
        throw new Error("window.crypto.getRandomValues is not supported in this environment.");
    }
    
    let string = '';
    
    // Base64 encodes 3 bytes into 4 characters. We estimate bytes needed.
    const bytesNeededEstimate = Math.ceil(length * 3 / 4);

    while (string.length < length) {
        const remaining = length - string.length;
        
        // Calculate bytes to generate in this iteration. We generate enough to cover the remaining
        // length, rounded up to the nearest multiple of 3 to avoid padding '=' characters
        // in the base64 output, which your PHP function explicitly avoids.
        const size = Math.ceil(remaining / 4) * 3; 

        // 1. Generate cryptographically secure random bytes
        const bytes = new Uint8Array(size);
        window.crypto.getRandomValues(bytes);

        // 2. Base64 encode the bytes
        let base64 = bytesToBase64(bytes);

        // 3. Make it URL-safe by removing '/', '+', and '='
        // The regex /[\/+]/g replaces all occurrences of '/' and '+' globally.
        base64 = base64.replace(/[\/+=]/g, '');

        // 4. Append the needed length
        string += base64.substring(0, remaining);
    }

    return string;
}

// Example usage:
// console.log(randomString(32));