const { exit, argv } = require('process');
const { crawlPage } = require('./crawl') 

async function main() {
    if(argv.length > 3) {
        console.error('To many arguments')
        exit(1)
    }

    if(argv.length < 3) {
        console.error('To few arguments')
        exit(1)
    }

    const baseURL = argv[2]
    
    console.log('---------------------------------------------------------')
    console.log(`start crawling ${baseURL}`)
    console.log('---------------------------------------------------------')

    await crawlPage(baseURL)

};

main();