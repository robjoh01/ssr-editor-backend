"use strict"

import passport from "@utils/passport.js"

// https://www.passportjs.org/packages/passport-github/

export const get = (req, res, next) => {
    passport.authenticate("github")(req, res, next)
}
