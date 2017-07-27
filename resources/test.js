const request = require('request')
const fs = require('fs');
const authData = {
        'user': 'admin',
        'password': '123',
        'layout': 'stock'
    }

const authenticateOption = {
    method: 'post',
    url: 'https://lex.fmi-beta.filemaker-cloud.com/fmi/rest/api/auth/stock',
    headers: {
        'Content-Type': 'application/json'
    },
    body: authData,
    json: true
};


const getFiledNames = function getFiledNamesFunction(err, res){
    const option = {
        method: 'get',
        url: 'https://lex.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/stock/stock',
        headers: {
            'FM-Data-token': res.body.token,
            'Content-Type': 'application/json, charset=UTF-8'
        },
        json: true
    }
    request(option, function(err, res){
        if (err){
        console.log('error', err)
        throw err
        }
        const errorCode = res.statusCode
        const records = res.body["data"]
        keys = Object.keys(records[0]['fieldData'])
        const fieldFormat = []
        keys.forEach(function(element){
            var fieldItem = {}
            fieldItem['key'] = `${element}`
            fieldItem['label'] = `${element}`
            fieldItem['type'] = 'string'
            fieldFormat.push(fieldItem)
        });
        return fieldFormat;
    });
};

const createField = function createFieldFunction (){
    const fields = request(authenticateOption, function getFiledNames(err, res){
        const option = {
        method: 'get',
        url: 'https://lex.fmi-beta.filemaker-cloud.com/fmi/rest/api/record/stock/stock',
        headers: {
            'FM-Data-token': res.body.token,
            'Content-Type': 'application/json, charset=UTF-8'
            },
        json: true
        }
        request(option, function(err, res){
            if (err){
            console.log('error', err)
            throw err
            }
            const errorCode = res.statusCode
            const records = res.body["data"]
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
        });
    });
}

createField();