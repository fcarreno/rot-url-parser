// Accepted command line params expected are:
// --urlFormat=urlFormatString
// --urlValue=urlValueString
const cmdLineParsedParams = require('minimist')(process.argv.slice(2)); // Getting values starting from 3rd cmd line parameter and on (after `node urlParser.js`)

const { urlFormat, urlValue } = cmdLineParsedParams;
const result = parseUrl(urlFormat, urlValue);
console.log(`Your result object is: ${JSON.stringify(result)}`);


// ASSUMPTIONS:
// 1- Query string params are not declared in the urlFormat input. They're only received as part of the urlValue, and they'll always have a value.
// 2- Numeric values (either on url path components or query params) do not need need to be interpreted as such (just being parsed as regular strings to simplify)
// 3- There's no need to structure parser within an object/module/helpers, and expectation is only to evaluate parsing logic/capabilities/code clarity...
//    (not necesarily performance either...)
function parseUrl(urlFormat, urlValue){

    let urlPathComponents, urlQueryParametersComponents, finalUrlComponents;
    let resultObject = {};
    if(urlFormat && urlValue){
        // Separating value in: 1- Url path/segment components And 2- Url query parameters components (they're parsed differently)
        let urlValueComponents = urlValue.split('?');
        let urlValuePathComponentsString = urlValueComponents[0];

        // Getting individual path component/segments
        urlPathComponents = parseUrlPathComponents(urlFormat, urlValuePathComponentsString, true);

        // Getting query parameters, if present in urlValue.
        let urlValueQueryParametersString = urlValueComponents.length > 1 ? urlValueComponents[1] : '';
        if(urlValueQueryParametersString)
            urlQueryParametersComponents = parseUrlQueryParameterComponents(urlValueQueryParametersString);

        // At this point, urlPathComponents (variable only) and urlQueryStringComponents & should all have their values mapped.
        console.log(`Url -variable- Path Components= ${JSON.stringify(urlPathComponents)}`);
        console.log(`Url Query Parameters Components= ${JSON.stringify(urlQueryParametersComponents)}`);

        // Consolidating all components in a single array for final mapping to result obj.
        finalUrlComponents = urlPathComponents;
        if(urlQueryParametersComponents)
            finalUrlComponents = finalUrlComponents.concat(urlQueryParametersComponents);

        // Final map of components to result object.
        finalUrlComponents.forEach(urlComponent => {
            resultObject[urlComponent.key] = urlComponent.value
        });
    }
    return resultObject;
}

// Get, interpret and map each Url Path component with its corresponding value...
function parseUrlPathComponents(urlFormat, urlValuePathComponentsString, variableOnly){

    let urlPathComponents = parseUrlFormatPathComponents(urlFormat);
    urlPathComponents = mapUrlPathComponentValues(urlPathComponents, urlValuePathComponentsString);

    if(variableOnly)
        urlPathComponents = urlPathComponents.filter(urlPathComponent => urlPathComponent.variable);

    return urlPathComponents;

}

// Getting the different Url Path Components from the url format string.
function parseUrlFormatPathComponents(urlFormatPathComponentsString){

    let urlFormatPathComponents = urlFormatPathComponentsString.split('/');

    // Remove first element (from leading slash - if present) - to prevent parsing/processing an empty component.
    if(!urlFormatPathComponents[0])
        urlFormatPathComponents.shift();


    urlFormatPathComponents = urlFormatPathComponents.map( urlFormatPathComponent => {
        return {
            key: urlFormatPathComponent.replace(':', ''), // Removing the variable indicator from the component name, if present.
            variable: urlFormatPathComponent.indexOf(':') != -1
        }
    });
    return urlFormatPathComponents;

}

// Assumption here is that the formats match (every component in the url format has a value)
// Only variable values are mapped to their corresponding url path component.
function mapUrlPathComponentValues(urlPathComponents, urlValuePathComponentsString){

    let urlValuePathComponents = urlValuePathComponentsString.split('/');

    // Remove first element (from leading slash - if present) - to prevent parsing/processing an empty component.
    if(!urlValuePathComponents[0])
        urlValuePathComponents.shift();

    urlPathComponents.forEach((urlPathComponent, urlPathComponentIndex) => {
        if(urlPathComponent.variable)
            urlPathComponent.value = urlValuePathComponents[urlPathComponentIndex];
    });
    return urlPathComponents;

}


// Get, interpret and map each Query Parameter with its corresponding value...
function parseUrlQueryParameterComponents(urlValueQueryParametersString){

    let urlQueryParametersComponents = urlValueQueryParametersString.split('&');
    urlQueryParametersComponents = urlQueryParametersComponents.map(urlQueryParametersComponent => {
        let urlQueryParameterComponentParts =  urlQueryParametersComponent.split('=');
        return {
            key: urlQueryParameterComponentParts[0],
            value: urlQueryParameterComponentParts[1]
        }
    });
    return urlQueryParametersComponents;
}




