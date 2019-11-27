# rot-url-parser

### SIMPLE URL PARSER

### Accepts two parameters (via command line)
* `urlFormat`: composed of url path components.  

  Example: `/:version/api/:collection/:id` (variable path components start with `':'`)

* `urlValue`: a string with values matching each component of the `urlFormat`, and -optionally- including query parameter/s.  

  Example: `/6/api/listings/3?sort=desc&limit=10`

NOTE: at least on Windows, when running from command line and -if specifying more than one query param (with the `&` char)-, the `urlValue` value needs to be wrapped in double quotes (`"`), to properly interpret it.

### And returns an object/hash with its key names and values mapped to each variable url component (considering both url path components and query parameters)
Example (from values above):
```
{
  version: '6',
  collection: 'listings',
  id: '3',
  sort: 'desc',
  limit: '10'
}
```


### SETUP & RUN

1. Clone the repo
2. `npm install` (install dependencies)
3. `node urlParser.js --urlFormat=[urlFormat] --urlValue=[urlValue]`.

   Example: `node urlparser.js --urlFormat=/:version/api/:collection/:id --urlValue="/6/api/listings/3?sort=desc&limit=10"`
