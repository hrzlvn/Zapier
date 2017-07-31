
const createField = function (z, bundle){

    const createFieldPromise = z.request({
      url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
    });

    return createFieldPromise.then(function (response) {
      if (response.statusCode < 200 || response.statusCode > 299){
            console.log('error', err);
            throw new Error('createFieldPromise is hitting the wall');
          }
      // const errorCode = response.statusCode;
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
};


const createRecipe = function (z, bundle) {

  const payload = {}
  
  const createRecipeFieldPromise = z.request({
      url :'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
      method: 'GET'
    });

  createRecipeFieldPromise.then(function (response){
    
    if (response.statusCode < 200 || response.statusCode > 299){
          console.log('error', err);
          throw new Error('createRecipePromise is hitting the wall');
    }
  
    const records = response.body["data"];
    keys = Object.keys(records[0]['fieldData']);
    
    keys.forEach(function(element){
       payload[element] = bundle.inputData.element;
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
  });
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