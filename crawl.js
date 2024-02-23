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

async function crawlPage(currentURL){
  console.log(`crawling ${currentURL}`)
  try {
    const response = await fetch(currentURL)
    if (response.status > 399){
      console.log(`Got HTTP error, status code: ${response.status}`)
      return
    }
    const contentType = response.headers.get('content-type')
    if (!contentType.includes('text/html')){
      console.log(`Got non-html response: ${contentType}`)
      return
    }
    console.log(await response.text())
  } catch (err){
    console.log(err.message)
  }
}
  
module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}
  