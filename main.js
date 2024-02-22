const { exit, argv } = require('process');

function main() {
    if(argv.length > 3) {
        console.error('To many arguments')
        exit(1)
    }

    if(argv.length < 3) {
        console.error('To few arguments')
        exit(1)
    }

    const baseUrl = argv[2]
    
    console.log('-------------------------------------')
    console.log(`----- start crawling ${baseUrl} -----`)
    console.log('-------------------------------------')

};

main();