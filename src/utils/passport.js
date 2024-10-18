"use strict"

import passport from "passport"

import { LocalStrategy } from "./strategies/local.js"
import { GitHubStrategy } from "./strategies/github.js"
import { GoogleStrategy } from "./strategies/google.js"

passport.use("local", LocalStrategy)
passport.use("github", GitHubStrategy)
passport.use("google", GoogleStrategy)

export default passport
