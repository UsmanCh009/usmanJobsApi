// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something went wrong'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.name === 'ValidationError'){
    // console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors).map(items => items.message).join(',')
    customError.statusCode = 400
  }
  if(err.name === 'CastError'){
    customError.msg = `No items found with id ${err.value}`
    customError.statusCode = 404
  }
  if(err.code && err.code === 11000 ){
    customError.msg = `value entered for ${Object.keys(err.keyValue)} already exists, please enter another value`
    customError.statusCode = 400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
