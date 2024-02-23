const { JSDOM } = require('jsdom')

function normalizeURL(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
      fullPath = fullPath.slice(0, -1)
    }
    return fullPath
  }

function getURLsFromHTML(html, baseURL){
  const urls = []
  const dom = new JSDOM(html)
  const aElements = dom.window.document.querySelectorAll('a')
  for (const aElement of aElements){
    if (aElement.href.slice(0,1) === '/'){
      try {
        urls.push(new URL(aElement.href, baseURL).href)
      } catch (err){
        console.log(`${err.message}: ${aElement.href}`)
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href)
      } catch (err){
        console.log(`${err.message}: ${aElement.href}`)
      }
    }
  }
  return urls
}

async function crawlPage(baseURL, currentURL, pages){
  const currentUrlObj = new URL(currentURL)
  const baseUrlObj = new URL(baseURL)

  if (currentUrlObj.hostname !== baseUrlObj.hostname){
    return pages
  }
 
  const normalizedURL = normalizeURL(currentURL)
  
  if (pages[normalizedURL] > 0){
    pages[normalizedURL]++
    return pages
  }

  if (currentURL === baseURL){
    // don't count the base URL as a link to itself
    pages[normalizedURL] = 0
  } else {
    pages[normalizedURL] = 1
  }

 
  console.log(`crawling ${currentURL}`)

  let htmlBody = ''

  try {
    const response = await fetch(currentURL)
    if (response.status > 399){
      console.log(`Got HTTP error, status code: ${response.status}`)
      return pages
    }
   
    const contentType = response.headers.get('content-type')
  
    if (!contentType.includes('text/html')){
      console.log(`Got non-html response: ${contentType}`)
      return pages
    }
    
    htmlBody = await response.text()
    

  } catch (err){
    console.log(err.message)
  }
  
  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs){
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages
}

function printReport(pages){
  const sortedPages = sortPagesByFrequency(pages)
  for (const page of sortedPages){
    console.log(`${page.url}: ${page.count}`)
  }
}
  
function sortPagesByFrequency(pages){
  const sortedPages = []
  for (const [url, count] of Object.entries(pages)){
    sortedPages.push({url, count})
  }
  sortedPages.sort((a, b) => b.count - a.count)
  return sortedPages
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
  printReport,
  sortPagesByFrequency
}
