const { exit, argv } = require('process');
const { crawlPage, printReport } = require('./crawl') 

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

    const pages = await crawlPage(baseURL, baseURL, {})
    
    console.log('\n start printing report')
    console.log('\n---------------------------------------------------------\n')
    printReport(pages)
    console.log('\n---------------------------------------------------------\n')
    console.log('done printing report') 

};

main();