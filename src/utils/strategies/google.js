"use strict"

import Strategy from "passport-google-oauth20"

const GoogleStrategy = new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://www.example.com/oauth2/redirect/google",
        scope: ["profile"],
        state: true,
    },
    function verify(accessToken, refreshToken, profile, done) {
        console.log(profile)
        done(null, profile)
    }
)

export { GoogleStrategy }
