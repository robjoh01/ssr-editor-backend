"use strict"

import passport from "@utils/passport.js"
import { updateUserLastLogin } from "@/collections/users.js"
import { generateTokens } from "@/utils/token.js"

export const get = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
        console.log(user)

        if (err || !user) {
            return res.redirect("/login/failed")
        }

        delete user.passwordHash
        await updateUserLastLogin(user._id)

        const { accessToken, refreshToken } = generateTokens(user)

        // Store the refresh token in a secure HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        })

        // Send access token to the client
        return res.status(200).json({ accessToken, user })
    })(req, res, next)
}
