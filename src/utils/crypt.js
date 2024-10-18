"use strict"

import bcrypt from "bcryptjs"

/**
 * Hash a password using bcrypt with specified salt rounds.
 *
 * @async
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} The hashed password.
 * @throws {Error} If hashing fails.
 */
export async function hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
    return await bcrypt.hash(password, saltRounds) // Hash the password with bcrypt
}

/**
 * Validate a password against a stored hash using bcrypt.
 *
 * @async
 * @param {string} password - The plain text password to validate.
 * @param {string} hash - The hash to compare against.
 * @returns {Promise<boolean>} True if the password matches the hash, false otherwise.
 * @throws {Error} If validation fails.
 */
export async function validatePassword(password, hash) {
    return await bcrypt.compare(password, hash) // Compare the password with the hash
}
