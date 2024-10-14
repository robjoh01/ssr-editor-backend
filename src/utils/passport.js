"use strict"

import passport from "passport"

import { LocalStrategy } from "./strategies/local.js"
// import { GithubStrategy } from "./strategies/github.js"
// import { GoogleStrategy } from "./strategies/google.js"

passport.use("local", LocalStrategy)
// passport.use("github", GithubStrategy)
// passport.use("google", GoogleStrategy)

export default passport
