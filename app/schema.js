/**
 * Copyright (c) Menome Technologies Inc.
 * 
 * For holding and validating JSON Schemas
 */
"use strict";
var Ajv = require('ajv');

// Validate data against a schema.
module.exports.validate = function(schema, data) {
  var thisSchema = schema;
  if(typeof thisSchema === 'string') thisSchema = module.exports.schemas[schema];
  if(!thisSchema) throw new Error("Schema does not exist.");
  var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true} 
  var validateMessage = ajv.compile(thisSchema);
  validateMessage(data);
  return validateMessage.errors;
}

const dispatchTask = {
  "$schema":"http://json-schema.org/draft-06/schema#",
  "title": "dispatchTask",
  "description": "Dispatch calls to the API must follow this schema",
  "type": "object",
  "required": ["id", "path", "method"],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "number",
      "description": "The ID of the bot whose method you are calling."
    },
    "path": {
      "type": "string",
      "description": "The endpoint on the bot. eg. /sync"
    },
    "method": {
      "type": "string",
      "description": "The HTTP Verb",
      "enum": ["GET","POST","PUT","OPTIONS","DELETE"]
    },
    "params": {
      "type": "object",
      "description": "URL query parameters",
      "additionalProperties": {
        "type": "string"
      }
    },
    "body": {
      "type": "object",
      "description": "The body of the HTTP request."
    }
  }
}

const cronTask = {
  "$schema":"http://json-schema.org/draft-06/schema#",
  "title": "cronTask",
  "description": "Cron tasks sent to this bot must follow this schema.",
  "type": "object",
  "required": ["name","cronTime","job"],
  "additionalProperties": false,
  "properties": {
    "name": {"type": "string"},
    "desc": {"type": "string"},
    "cronTime": {"type": "string"},
    "job": dispatchTask
  }
}

module.exports.schemas = {
  dispatchTask,
  cronTask
}
