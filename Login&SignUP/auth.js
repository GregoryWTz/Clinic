function parseCookies(req) {
    const list = {};
    const rc = req.headers.cookie;
    rc && rc.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    console.log('Cookies parsed:', list); // 👈 Debug
    return list;
}

function requireLogin(req, res, next) {
    const cookies = parseCookies(req);
    console.log('Cookies:', cookies); 
    if (!cookies.userId) {
        res.writeHead(302, { Location: '/login' });
        res.end();
    } else {
        next(cookies.userId);
    }
}

module.exports = { parseCookies, requireLogin };