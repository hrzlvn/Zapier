const request = require('request')
const fs = require('fs');
const authData = {
        'user': 'admin',
        'password': '123',
        'layout': 'stock'
    }

const createField = function createFieldFunction (z, bundle){

    // const authData = {
    //     'user': bundle.authData.user,
    //     'password': bundle.authData.password,
    //     'layout': bundle.authData.layout
    // }

    // const authenticateOption = {
    //   method: 'post',
    //   url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/auth/{{bundle.authData.solution}}',
    //   headers: {
    //       'Content-Type': 'application/json'
    //   },
    //   body: authData,
    //   json: true
    // };

    // const fields = request(authenticateOption, function getFiledNames(err, res){
    //     const option = {
    //     method: 'get',
    //     url: 'https://lex.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/stock/stock',
    //     headers: {
    //         'FM-Data-token': res.body.token,
    //         'Content-Type': 'application/json, charset=UTF-8'
    //         },
    //     json: true
    //     }
    //     request(option, function(err, res){
    //         if (err){
    //         console.log('error', err)
    //         throw err
    //         }
    //         const errorCode = res.statusCode
    //         const records = res.body["data"]
    //         keys = Object.keys(records[0]['fieldData'])
    //         const fieldFormat = []
    //         keys.forEach(function(element){
    //             var fieldItem = {}
    //             fieldItem['key'] = `${element}`
    //             fieldItem['label'] = `${element}`
    //             fieldItem['type'] = 'string'
    //             fieldFormat.push(fieldItem)
    //         });
    //         console.log(fieldFormat)
    //         return fieldFormat;
    //     });
    // });

    const promise = z.request({
      url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/auth/{{bundle.authData.solution}}',
    });

    return promise.then(response) => {
      if (response.statusCode < 200 || response.statusCode > 299){
            console.log('error', err)
            throw new Error('the field retrieval is hitting the wall')
            }
            const errorCode = response.statusCode
            const records = response.body["data"]
            keys = Object.keys(records[0]['fieldData'])
            const fieldFormat = []
            keys.forEach(function(element){
                var fieldItem = {}
                fieldItem['key'] = `${element}`
                fieldItem['label'] = `${element}`
                fieldItem['type'] = 'string'
                fieldFormat.push(fieldItem)
            });
            console.log(fieldFormat)
            return fieldFormat;
    };
}

();

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
  const requestOptions = {
    url: url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
    method: 'POST',
    body: JSON.stringify({
      'data' : bundle.inputData.data,
    }),
    headers: {
      'content-type': 'application/json'
    }
  };

  return z.request(requestOptions)
    .then((response) => JSON.parse(response.content));
};

const searchRecipe = (z, bundle) => {
  return z.request({
      url: url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/find/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
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

const populateDynamicField = (z, bundle) => {
  return dynamicField 
}

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
      description: 'Gets a recipe.',
    },
    operation: {
      inputFields: [
        {key: 'recordId', required: true},
      ],
      perform: getRecipe,
    },
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Recipe',
      description: 'Trigger when a new recipe is added.',
    },
    operation: {
      inputFields: [
        {key: 'style', type: 'string', helpText: 'Explain what style of cuisine this is.'},
      ],
      perform: listRecipes,
    },
  },
  // If your app supports webhooks, you can define a hook method instead of a list method.
  // Zapier will turn this into a webhook Trigger on the app.
  // hook: {
  //
  // },

  // The create method on this resource becomes a Write on this app
  create: {
    display: {
      label: 'Create Recipe',
      description: 'Creates a new recipe.',
    },
    operation: {
      inputFields: [
      //function that generate dynamic field 
      //get it from fieldData
        createField
      ],
      perform: createRecipe,
    },
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Recipe',
      description: 'Finds an existing recipe by name.',
    },
    operation: {
      inputFields: [
        /*
          searchData object
          Fields and Find criteria in the following query schema: 
          {query: [ { "Company" : "*Hospital", "Group": "=Nurse"}]}
          {"query": [ { "<fieldName>": "<fieldValue>", "omit" : "true" to set (optional) }, ...]}
        */
        {key: 'name', required: true, type: 'string'},
      ],
      perform: searchRecipe,
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
    style: 'italian',
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
    {key: 'style', label: 'Style'},
  ]
};