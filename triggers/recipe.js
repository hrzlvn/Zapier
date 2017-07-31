const request = require('request')
const fs = require('fs');

const getRecipe = (z, bundle) => {
  return z.request({
      url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}/{{bundle.inputData.recordId}}',
      method: 'GET'
    })
    .then((response) => JSON.parse(response.content));
};

const listRecipes = (z, bundle) => {
  return z.request({
      url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
      // params: {
      //   style: bundle.inputData.style
      // }
    })
    .then((response) => JSON.parse(response.content));
};

// This file exports a Recipe resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'listRecipe',
  noun: 'Recipe',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  display: {
    label: 'listRecipe',
    description: 'Gets a recipe.'
  },
  operation: {
    inputFields: [
      {key: 'recordId', required: true}
    ],
    perform: getRecipe
  },
  // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
  // field definitions. The result will be used to augment the sample.
  // outputFields: () => { return []; }
  // Alternatively, a static field definition should be provided, to specify labels for the fields
  outputFields: function (z, bundle){

      const createFieldPromise = z.request({
        url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
        method: 'GET'
      });

      return createFieldPromise.then(function(response){
        if (response.statusCode < 200 || response.statusCode > 299){
              console.log('error', err);
              throw new Error('createFieldPromise is hitting the wall');
            }
        const errorCode = response.statusCode;
        const records = response.body["data"];
        keys = Object.keys(records[0]['fieldData']);
        const fieldFormat = [];
        keys.forEach(function(element){
            var fieldItem = {};
            fieldItem['key'] = `${element}`;
            fieldItem['label'] = `${element}`;
            fieldItem['type'] = 'string';
            fieldFormat.push(fieldItem);
        });
        console.log(fieldFormat);
        return fieldFormat;
    });
    }
  };