"use strict"

import bcrypt from "bcryptjs"

export async function hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
    return await bcrypt.hash(password, saltRounds)
}

export async function validatePassword(password, hash) {
    return await bcrypt.compare(password, hash)
}
