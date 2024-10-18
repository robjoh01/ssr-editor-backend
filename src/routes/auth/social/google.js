"use strict"

import passport from "@utils/passport.js"

export const get = (req, res, next) => {
    passport.authenticate("google", {
        scope: ["email", "profile"],
        session: false,
    })(req, res, next)
}
