// src/utils/logger.js
export function logError(msg, extra) {
    console.error(msg, extra)
}

export function logDebug(msg, extra) {
    if (import.meta.env.DEV) console.debug(msg, extra)
}
