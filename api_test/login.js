const request = require('request')
const random_useragent = require('random-useragent')


process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const url = 'https://cms.mmu.edu.my/psp/csprd/?cmd=login&languageCd=ENG'

const j = request.jar()

var headers = {
    'User-Agent': random_useragent.getRandom()
};

// var form = {
//     userid: '1161303833',
//     pwd: 'password'
// }


var form = {
    userid: process.argv[2],
    pwd: process.argv[3]
}

var options = {
    url: url,
    method: 'POST',
    headers,
    form,
    jar: j
};


request(options, (err, res, body) => {
    const cookie_string = j.getCookieString(url)
    const cookies = j.getCookies(url)
    // console.dir(cookies)
    let cs = cookie_string.split(';')
    //let css = cs.filter(e => e.includes('PS_TOKEN') || e.includes('PSJSESSIONID') || e.includes('ORA_OTD_JROUTE'))
    //let css = cs.filter(e => e.includes('PS_TOKEN') || e.includes('PSJSESSIONID'))
    let css = cs.filter(e => e.includes('PSJSESSIONID') || e.includes('PS_TOKEN='))
    let cssj = css.join(';')
    let token = Buffer.from(cssj).toString('base64').replace('=', '')
    let json = {
        token,
        cookies: css,
        cookie_str: cssj,
        cs: cookie_string
    }
    console.log(json)

})