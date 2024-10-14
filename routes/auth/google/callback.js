"use strict"

import passport from "passport"
import { signToken } from "@utils/token.js"

export const get = async (req, res, next) => {
    passport.authenticate(
        "google",
        { session: false },
        async (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({ error: "Authentication failed" })
            }

            // Find or create user in your MongoDB
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
