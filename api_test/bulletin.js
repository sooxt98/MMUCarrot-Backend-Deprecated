const request = require('request')
//const random_useragent = require('random-useragent')
const cheerio = require('cheerio')
const fs = require('fs');
//const EventEmitter = require('events'); 


request.post('https://online.mmu.edu.my/bulletin.php', {
    form:{
        form_loginUsername:'1161303833',
        form_loginPassword:'***REMOVED***',
    }
}, function(err,httpResponse,body){
    //console.log(body)
    const $ = cheerio.load(body)
    let latest = []

    //console.time("test");

    $('div[id=tabs-1] > div.bulletinContentAll').each(function(i, elem) {

        //let row = $(this).children()
        var inline = $(this).find('.inline');
        //var meta = $(this).find('div[id^=inline_content]').text().trim().replace(/\t/g, '').split(/\r?\n/);
        var content = $(this).find('.desciption_spacing');
        var attachments = $(this).find('a[target=_blank]');
        var title_tag = inline.next().text().split(' | ');

        var files = []

        attachments.each(function(j, attach) {
            if($(this).parent().text().startsWith('File Attachment'))
                files.push({
                    name: $(this).text(),
                    link: $(this).attr('href')
                })
        })

        latest.push({
            'id': parseInt(new String(inline.attr('href')).substring(15)),
            'title': inline.text().trim(),
            'date': title_tag[0],
            'dep': title_tag[1],
            'html': content.html(),
            'attachments': files,
            // 'date': meta[0],
            // 'expiry': meta[1],
            // 'by': meta[2],
            // 'data': meta[3],
            
        })
    })
    if (fs.existsSync('./bulletin.json')) {
        fs.readFile('./bulletin.json', function(err, data) {
            var old = JSON.parse(data)
            let last_id = old[0].id
            
            let to_be_insert = latest.filter(el => el.id > last_id)
            console.log(to_be_insert)
            let new_merged = [...to_be_insert, ...old]
            
            //console.log(to_be_insert)
            if(to_be_insert.length > 0)
                fs.writeFileSync('./bulletin.json', JSON.stringify(new_merged) , 'utf-8');
        });
    } else {
        fs.writeFileSync('./bulletin.json', JSON.stringify(latest) , 'utf-8');
    }

    

    
    //console.log(data)
})
