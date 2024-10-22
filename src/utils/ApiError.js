class ApiError extends Error{
    constructor(
        statusCode, // To give StatusCode
        message="Something went Wrong in API ERROR.js", // Default Text to give message for the Error or we can change it as well when this class is called
        errors=[], // To Give multiple Error's or having Stack of Erros's as below shown
        stack=""  // If we Having Error Stack we can Added it here 
    ){
        super(message) // we overwrite the Message
        this.statusCode=statusCode // To Overwrite the Status Code 
        this.data=null
        this.success=false
        this.message=message
        this.errors=errors

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}

// This Completely Returned when called with some values/params as Object 