const { normalizeURL, getURLsFromHTML } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL protocol', () => {
  const input = 'https://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL slash', () => {
  const input = 'https://blog.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
  const input = 'https://BLOG.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL http', () => {
  const input = 'http://BLOG.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('absoluteURL from relativeURL', () => {
  const baseUrl = 'https://blog.boot.dev'
  const input = `
      <html>
        <body>
          <a href="/path">link</a>
        </body>
      </html>
    `
  const actual = getURLsFromHTML(input, baseUrl)
  const expected = `${baseUrl}/path`
  expect(actual[0]).toEqual(expected)
})

test('find all urls in html', () => {
  const html = `
    <html>
      <body>
        <a href="/path">link</a>
        <a href="/path2">link2</a>
        <a href="/path3">link3</a>
      </body>
    </html>
  `
  const baseUrl = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(html, baseUrl)
  const expected = [
    `${baseUrl}/path`,
    `${baseUrl}/path2`,
    `${baseUrl}/path3`
  ]
  expect(actual).toEqual(expected)
});