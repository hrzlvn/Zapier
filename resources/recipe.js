const request = require('request');
const fs = require('fs');

const createField = (z, bundle) => {

    const promise = z.request({
      url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
    });

    return promise.then(response) => {
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
    };
};


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

const createRecipe = (z, bundle) => {

  const payload = {}

  const promise = z.request({
      url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
    });

  promise.then(response) => {

    if (response.statusCode < 200 || response.statusCode > 299){
          console.log('error', err);
          throw new Error('createRecipePromise is hitting the wall');
    }

    const records = response.body["data"];
    keys = Object.keys(records[0]['fieldData']);

    keys.forEach(function(element){
       payload[element] = bundle.inputData.element
    });

    console.log(payload);

    const requestOptions = {
    url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
    method: 'POST',
    body: JSON.stringify({data: payload}),
    headers: {'Content-Type': 'application/json'}
  };

  return z.request(requestOptions)
    .then((response) => JSON.parse(response.content));
  };
};

const searchRecipe = (z, bundle) => {
  return z.request({
      url:'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/find/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      params: {
        'query': bundle.inputData.searchData
      }
    })
    .then((response) => {
      const matchingRecipes = JSON.parse(response.content);

      // Only return the first matching recipe
      if (matchingRecipes && matchingRecipes.length) {
        return [matchingRecipes[0]];
      }

      return [];
    });
};

// This file exports a Recipe resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
  key: 'recipe',
  noun: 'Recipe',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Recipe',
      description: 'Gets a recipe.'
    },
    operation: {
      inputFields: [
        {key: 'recordId', required: true}
      ],
      perform: getRecipe
    }
  },

  create: {
    display: {
      label: 'Create Recipe',
      description: 'Creates a new recipe.'
    },
    operation: {
      inputFields: [
      //function that generate dynamic field
      //get it from fieldData
        createField
      ],
      perform: createRecipe
    },
  },

  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Recipe',
      description: 'Finds an existing recipe by name.'
    },
    operation: {
      inputFields: [
        /*
          searchData object
          Fields and Find criteria in the following query schema:
          {query: [ { "Company" : "*Hospital", "Group": "=Nurse"}]}
          {"query": [ { "<fieldName>": "<fieldValue>", "omit" : "true" to set (optional) }, ...]}
        */
        {key: 'name', required: true, type: 'string'}
      ],
      perform: searchRecipe
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obviously dummy values that we can show to any user.
  sample: {
    id: 1,
    createdAt: 1472069465,
    name: 'Best Spagetti Ever',
    authorId: 1,
    directions: '1. Boil Noodles\n2.Serve with sauce',
    style: 'italian'
  },

  // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
  // field definitions. The result will be used to augment the sample.
  // outputFields: () => { return []; }
  // Alternatively, a static field definition should be provided, to specify labels for the fields
  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'createdAt', label: 'Created At'},
    {key: 'name', label: 'Name'},
    {key: 'directions', label: 'Directions'},
    {key: 'authorId', label: 'Author ID'},
    {key: 'style', label: 'Style'}
  ]
};