"use strict"

// https://www.passportjs.org/howtos/password/

import { Strategy } from "passport-local"

import { validatePassword } from "@utils/crypt.js"
import { fetchUserByEmail } from "@collections/users.js"

const LocalStrategy = new Strategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const user = await fetchUserByEmail(email)

            if (!user) throw new Error("User not found")

            const wasPasswordCorrect = await validatePassword(
                password,
                user.passwordHash
            )

            if (!wasPasswordCorrect) throw new Error("Invalid password")

            // If the password was correct, log the user in
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
)

export { LocalStrategy }
