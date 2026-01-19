module.exports = {
    apps: [{
        name: "endeko",
        script: "c:/Users/setyw/.gemini/antigravity/scratch/noel/endeko/start_server.cjs",
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: "development"
        }
    }]
};
