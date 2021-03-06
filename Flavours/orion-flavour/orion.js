/*

Copyright Odin Solutions S.L. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0

*/

"use strict";

var http = require('http');

const axios = require('axios');

//Send request
function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {

        var req = http.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                try {
                    if (body.length>0) { //To prevent: [SyntaxError: Unexpected end of input]
                        body = JSON.parse(Buffer.concat(body).toString());    
                    }

                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}

//Access to Orion Context Broker entity.
function obtainCBEntity (idOCB, ocb_service, ocb_servicePath, ocb_ip, ocb_port) {
    return new Promise(function(resolve, reject) {
        
        var params = {
                        method: 'get',
                        host: ocb_ip,
                        path: '/v2/entities/'+idOCB,
                        port: ocb_port,
                        headers: {'Accept': 'application/json',
                                'Fiware-Service' : ocb_service,
                                'Fiware-ServicePath' : ocb_servicePath}
                    }

        httpRequest(params).then(function(body) {
            resolve(body);
            reject('');
//            return httpRequest(otherParams);
        }).then(function(body) {
        }).catch(err => {
            reject(err)
        });
    });
};

//Access to all Orion Context Broker entities.
function obtainALLCBEntities (offset, limit, ocb_ip, ocb_port, ocb_service, ocb_servicePath) {
    return new Promise(function(resolve, reject) {
        
        var params = {
                method: 'get',
                host: ocb_ip,
                path: '/v2/entities?offset=' + offset + '&limit=' + limit + '&options=count',
                port: ocb_port,
                headers: {'Accept': 'application/json',
                'Fiware-Service' : ocb_service,
                'Fiware-ServicePath' : ocb_servicePath}
                }
        
        httpRequest(params).then(function(body) {
            resolve(body);
            reject('');
//            return httpRequest(otherParams);
        }).then(function(body) {
        }).catch(err => {
            reject(err)
        });
    });
};

//Access to all Orion Context Broker entities.
function obtainALLCBEntitiesPerType (offset, limit, ocb_ip, ocb_port, ocb_service, ocb_servicePath, ocb_type) {
    return new Promise(function(resolve, reject) {
        
        var params = {
                method: 'get',
                host: ocb_ip,
                path: '/v2/entities?type=' + ocb_type + '&offset=' + offset + '&limit=' + limit + '&options=count',
                port: ocb_port,
                headers: {'Accept': 'application/json',
                'Fiware-Service' : ocb_service,
                'Fiware-ServicePath' : ocb_servicePath}
                }
        
        //console.log(params)
        
        httpRequest(params).then(function(body) {
            resolve(body);
            reject('');
//            return httpRequest(otherParams);
        }).then(function(body) {
        }).catch(err => {
            reject(err)
        });
    });
};


//Access to Orion Context Broker Subscriptions...
function obtainCBSubscriptions (offset, limit, ocb_ip, ocb_port, ocb_service, ocb_servicePath) {
    return new Promise(function(resolve, reject) {
        
        var params = {
                method: 'get',
                host: ocb_ip,
                path: '/v2/subscriptions?offset=' + offset + '&limit=' + limit + '&options=count',
                port: ocb_port,
                headers: {'Accept': 'application/json',
                'Fiware-Service' : ocb_service,
                'Fiware-ServicePath' : ocb_servicePath}
                }
        
        httpRequest(params).then(function(body) {
            resolve(body);
            reject('');
//            return httpRequest(otherParams);
        }).then(function(body) {
        }).catch(err => {
            reject(err)
        });
    });
};

//Access to all Orion Context Broker entities.
function obtainALLCBSchemaByType (limit, ocb_ip, ocb_port, ocb_service, ocb_servicePath) {
    return new Promise(function(resolve, reject) {
        
        var params = {
                method: 'get',
                host: ocb_ip,
                path: '/v2/types?limit=' + limit + '&options=count',
                port: ocb_port,
                headers: {'Accept': 'application/json',
                'Fiware-Service' : ocb_service,
                'Fiware-ServicePath' : ocb_servicePath}
                }
        
        //console.log(params)
        
        httpRequest(params).then(function(body) {
            resolve(body);
            reject('');
//            return httpRequest(otherParams);
        }).then(function(body) {
        }).catch(err => {
            reject(err)
        });
    });
};

//Access to specific attribute (200-OK; 404-No found(
function obtainCBAttributeEntity (idOCB, attributeOCB, ocb_ip, ocb_port, ocb_service, ocb_servicePath) {
    return new Promise(function(resolve, reject) {
        
        var params = {
                method: 'get',
                host: ocb_ip,
                path: '/v2/entities/' + idOCB + '/attrs/' + attributeOCB,
                port: ocb_port,
                headers: {'Accept': 'application/json',
                'Fiware-Service' : ocb_service,
                'Fiware-ServicePath' : ocb_servicePath}
                }
        
        //console.log(params)
        
        httpRequest(params).then(function(body) {
            resolve(body);
            reject('');
//            return httpRequest(otherParams);
        }).then(function(body) {
        }).catch(err => {
            reject(err)
        });
    });
};

//Update Orion Context Broker entity to send a command.
async function sendCommandUpdatingBroker(payLoadObject,ocb_ip, ocb_port, ocb_service, ocb_servicePath) {
    try {
        const instance = axios.create({
            baseURL: "http://" + ocb_ip + ":" + ocb_port
        })

        //Defining headers.
        var headersPost = {}

        headersPost["Content-Type"] = 'application/json';

        //const dOCBService = subscriptionFound.destinyOCB_service || ""
        //const dOCBServicePath = subscriptionFound.destinyOCB_servicePath || ""

        //if (dOCBService != "") {
        headersPost["fiware-service"] = ocb_service;
        //}
        
        //if (dOCBServicePath != "") {
        headersPost["fiware-servicepath"] = ocb_servicePath
        //}

        const options = {
            headers: headersPost
        }
        
        //payLoadObject.id = subscriptionFound.destinyOCB_id
        //payLoadObject.type = subscriptionFound.destinyOCB_type

        //Definimos el body de la actualización.
        var contextElements = []
        contextElements.push(payLoadObject)

        var updatebody = {
            updateAction: "UPDATE",
            contextElements
            }

        //console.log("updatebody")
        //console.log(updatebody)
        //console.log(typeof updatebody)

        //Update/create entity - CONTEXT BROKER
        try {
            const responsePost = await instance.post(`/v1/updateContext`, updatebody, options)

        } catch(e) {
            console.error("sendCommandUpdatingBroker fails - error: " + e.toString());            
            return false
        }
        return true
    } catch(e) {
        console.error("sendCommandUpdatingBroker fails - error: " + e.toString());            
        return false
    }
}

//Fields used as identifiers in the NGSIv2 API follow special rules regarding allowed syntax. These rules apply to:
//    Entity id
//    Entity type
//    Attribute name
//    Attribute type
//    Metadata name
//    Metadata type
//Allowed characters are the ones in the plain ASCII set, except the following ones: control characters, whitespace, &, ?, / and #

function cleanJSON_InvalidChar(string) {

    var stringReplace = string

    var resultado = ""


    stringReplace = stringReplace.replace(/ /g,"");
    stringReplace = stringReplace.replace(/\&/g,"");
    stringReplace = stringReplace.replace(/\?/g,"");
    stringReplace = stringReplace.replace(/\//g,"");
    stringReplace = stringReplace.replace(/\#/g,"");
    stringReplace = stringReplace.replace(/\(/g,"");
    stringReplace = stringReplace.replace(/\)/g,"");
    stringReplace = stringReplace.replace(/\%/g,"");
    stringReplace = stringReplace.replace(/\"/g,"");
    
    /*
    stringReplace = stringReplace.replace(String.fromCharCode(" ".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("&".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("?".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("/".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("#".charCodeAt(0)), '');

    
    stringReplace = stringReplace.replace(String.fromCharCode("[".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("\"".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("'".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("(".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode(")".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode(";".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("<".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("=".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode(">".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("\\".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("{".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("}".charCodeAt(0)), '');
    stringReplace = stringReplace.replace(String.fromCharCode("]".charCodeAt(0)), '');
    */

    for (var i = 0; i< stringReplace.length; i++) {
        var caracter = stringReplace.charAt(i);

        if( caracter.charCodeAt(0) >= 32 && caracter.charCodeAt(0) <= 127) {
            resultado = resultado.concat(caracter);
         }
    }
    return resultado
}

//Remove not allowed characters to JSON string.
//""","'","(",")",";","<","=",">","\","{","}"
function cleanJSON_Strings(string) {

    var stringReplace = string

    var resultado = ""
    
    stringReplace = stringReplace.replace(/\&/g,"");
    stringReplace = stringReplace.replace(/\?/g,"");
    stringReplace = stringReplace.replace(/\//g,"");
    stringReplace = stringReplace.replace(/\#/g,"");
    stringReplace = stringReplace.replace(/\(/g,"");
    stringReplace = stringReplace.replace(/\)/g,"");
    stringReplace = stringReplace.replace(/\%/g,"");
    stringReplace = stringReplace.replace(/\"/g,"");
    stringReplace = stringReplace.replace(/\'/g,"");
    stringReplace = stringReplace.replace(/\(/g,"");
    stringReplace = stringReplace.replace(/\)/g,"");
    stringReplace = stringReplace.replace(/\;/g,"");
    stringReplace = stringReplace.replace(/\</g,"");
    stringReplace = stringReplace.replace(/\=/g,"");
    stringReplace = stringReplace.replace(/\>/g,"");
    stringReplace = stringReplace.replace(/\\/g,"");
    stringReplace = stringReplace.replace(/\{/g,"");
    stringReplace = stringReplace.replace(/\}/g,"");
    stringReplace = stringReplace.replace(/\[/g,"");
    stringReplace = stringReplace.replace(/\]/g,"");
        
    //Recorre la cadena y si encuentra caracteres con ascii no comprendidos entre 32 y 255 ambos inclusive se quitan.
    for (var i = 0; i< cadenaReplace.length; i++) {
        var caracter = cadenaReplace.charAt(i);

        if( caracter.charCodeAt(0) >= 32 && caracter.charCodeAt(0) <= 255) {
            resultado = resultado.concat(caracter);
         }
    }
    return resultado
}

module.exports.cleanJSON_InvalidChar = cleanJSON_InvalidChar; 
module.exports.cleanJSON_Strings = cleanJSON_Strings; 

module.exports.obtainCBEntity = obtainCBEntity; 
module.exports.obtainALLCBEntities = obtainALLCBEntities;
module.exports.obtainALLCBEntitiesPerType = obtainALLCBEntitiesPerType;
module.exports.obtainCBSubscriptions = obtainCBSubscriptions;
module.exports.obtainALLCBSchemaByType = obtainALLCBSchemaByType;
module.exports.obtainCBAttributeEntity = obtainCBAttributeEntity;
module.exports.sendCommandUpdatingBroker = sendCommandUpdatingBroker;
