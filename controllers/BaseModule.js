const Joi = require('@hapi/joi');
const {ValidationError} = require('./Errors');

class BaseModule {

  constructor() {
    const env = process.env.NODE_ENV.toLowerCase();
    this.skipValidation = env !== 'dev' || env !== 'development';
  }


  validate({data, schema, opts = {}, ignoreSkip = false}) {
    let validate = !this.skipValidation;
    if (ignoreSkip) validate = true;
    if (validate) {
      const {error, value} = Joi.validate(data, schema, opts);
      if (error) {
        throw new ValidationError(ValidationError.codes.VALIDATION_ERROR, {
          info: error.message,
          details: error.details,
        });
      }
      return value;
    } else {
      return data;
    }
  }


  async fetch(obj) {
    if (obj instanceof Promise) {
      obj = await obj;
      return this.fetch(obj);
    } else if (Array.isArray(obj)) {
      return await Promise.all(obj.map((item) => this.fetch(item)));
    } else if (obj.constructor === Object) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        obj[key] = await this.fetch(obj[key]);
      }
      return obj;
    } else {
      return obj;
    }
  }
}

module.exports = BaseModule;
