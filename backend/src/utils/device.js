// "Chrome on macOS" style label from the User-Agent header. Good enough for the sessions list.
const describeDevice = (ua = "") => {
  const os =
    /iPhone|iPad|iPod/i.test(ua) ? "iOS" :
    /Android/i.test(ua) ? "Android" :
    /Windows/i.test(ua) ? "Windows" :
    /Mac OS X|Macintosh/i.test(ua) ? "macOS" :
    /CrOS/i.test(ua) ? "ChromeOS" :
    /Linux/i.test(ua) ? "Linux" : "Unknown OS";

  const browser =
    /Edg\//i.test(ua) ? "Edge" :
    /OPR\/|Opera/i.test(ua) ? "Opera" :
    /Firefox\//i.test(ua) ? "Firefox" :
    /Chrome\/|CriOS/i.test(ua) ? "Chrome" :
    /Safari\//i.test(ua) ? "Safari" : "Browser";

  const deviceType = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobile|iPhone|Android/i.test(ua) ? "mobile" : "desktop";

  return { device: `${browser} on ${os}`, deviceType };
};

const clientMeta = (req) => ({ ip: req.ip, ...describeDevice(req.get("user-agent") || "") });

module.exports = { describeDevice, clientMeta };
