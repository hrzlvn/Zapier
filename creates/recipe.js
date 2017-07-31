
const createField = function (z, bundle){

    const createFieldPromise = z.request({
      url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/layout/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
    });

    return createFieldPromise.then(function (response) {
      if (response.statusCode < 200 || response.statusCode > 299){
            console.log('error', err);
            throw new Error('createFieldPromise is hitting the wall');
          }
      // const errorCode = response.statusCode;
      const fields = JSON.parse(response.content).metaData;
      const array = [];
      fields.forEach(function(field){
          var fieldItem = {};
          fieldItem['key'] = `${field.name}`;
          fieldItem['label'] = `${field.name}`;
          fieldItem['type'] = `${field.result}`;
          array.push(fieldItem);
      });
      console.log(array);
      
      return array;
    });
};


const createRecipe = function (z, bundle) {
  
  const createRecipeFieldPromise = z.request({
      url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/layout/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
    });

  createRecipeFieldPromise.then(function (response){
    if (response.statusCode < 200 || response.statusCode > 299){
          console.log('error', err);
          throw new Error('createRecipePromise is hitting the wall');
    }
    const fields = JSON.parse(response.content).metaData;
    const payload = {}
    fields.forEach(function(field){
       payload[field.name] = bundle.inputData[field.name];
    });
    console.log(payload);
    const requestOptions = {
    url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
    method: 'POST',
    body: JSON.stringify({data: payload}),
    headers: {'Content-Type': 'application/json'}
    }
    return requestOptions;
  })
  .then(function(requestOptions){
    return z.request(requestOptions)
  })
  .then(function(response){
    return JSON.parse(response.content)});
};

// This file exports a Recipe resource. The definition below contains all of the keys available,
// and implements the list and create methods.
module.exports = {
    key: 'createRecipe',
    noun: 'recipe',
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
        outputFields: []
    }
};