module.exports = {
    disconnect: () => {
        console.warn('Disconnected!');
    },
    reconnecting: () => {
        console.log("Bot reconnecting...");
    },
    warn: (err) => {
        console.warn('[WARNING]', err);
    },
    error: (err) => {
        console.error(err.message);
    },
    DiscordAPIError: (err) => {
        console.log('[DiscordAPIError]', err);
    },
    uncaughtException: (err) => {
        console.error(`[uncaughtException] ${err.stack}`);
        process.exit(1);
    },
    unhandledRejection: (err, promise) => {
        console.log('[unhandledRejection]', `Reason: ${err.stack}`);
    },
};