"use strict"

import passport from "@utils/passport.js"
import { signToken } from "@utils/token.js"

export const post = async (req, res, next) => {
    const { method = "local" } = req.body

    switch (method.toLowerCase()) {
        case "local":
            passport.authenticate(
                "local",
                { session: false },
                (err, user, info) => {
                    if (err) return next(err) // Handle any errors
                    if (!user)
                        return res.status(401).json({
                            error: info?.message || "Invalid credentials",
                        }) // If no user, return 401

                    delete user.passwordHash

                    // Generate JWT
                    const token = signToken({ id: user._id, email: user.email })

                    // Send the token in the response
                    return res.status(200).json({ token, user })
                }
            )(req, res, next)
            break

        case "github":
            passport.authenticate(
                "github",
                { session: false },
                (err, user, info) => {
                    if (err) return next(err)
                    if (!user)
                        return res.status(401).json({
                            error: info?.message || "GitHub login failed",
                        })

                    delete user.passwordHash

                    // Generate JWT
                    const token = signToken({ id: user._id, email: user.email })

                    // Send the token in the response
                    return res.status(200).json({ token, user })
                }
            )(req, res, next)
            break

        case "google":
            passport.authenticate(
                "google",
                {
                    session: false,
                    scope: ["profile", "email"],
                },
                (err, user, info) => {
                    if (err) return next(err)
                    if (!user)
                        return res.status(401).json({
                            error: info?.message || "Google login failed",
                        })

                    delete user.passwordHash

                    // Generate JWT
                    const token = signToken({ id: user._id, email: user.email })

                    // Send the token in the response
                    return res.status(200).json({ token, user })
                }
            )(req, res, next)
            break

        default:
            return res.status(400).json({ error: "Invalid login method" })
    }
}
