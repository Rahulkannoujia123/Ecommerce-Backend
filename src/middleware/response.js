const responseStructure = {
    success: (data, message = 'Success') => ({
      status: 200,
      message: message,
      body: data
    }),
    error: (statusCode, errorMessage) => ({
      status: statusCode,
      message: errorMessage
    })
  };
  
  module.exports = responseStructure;
  