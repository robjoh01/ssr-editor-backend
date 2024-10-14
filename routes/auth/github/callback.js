"use strict"

// https://www.passportjs.org/packages/passport-github2/

import passport from "passport"
import githubStrategy from "passport-github2"
import { signToken } from "@utils/token.js"

export const get = async (req, res, next) => {
    passport.authenticate(
        "github",
        { session: false },
        async (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({ error: "Authentication failed" })
            }

            // Optionally, you could find or create the user in your database here
            const existingUser = await User.findOne({ email: user.email })
            if (!existingUser) {
                const newUser = await User.create({
                    email: user.email,
                    name: user.displayName,
                    // Add any additional properties needed
                })
                user = newUser // Replace user with new user from DB
            }

            // Update lastLogin
            await updateUserLastLogin(user._id)

            const token = signToken({ id: user._id })
            return res.json({ token, user })
        }
    )(req, res, next)
}
