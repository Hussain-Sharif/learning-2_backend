class ApiResponse{
    constructor(
        statusCode,data,message="Sucess"
    ){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400 // Decides that it is Success or not as True or False of this Comparision
    }
}

export {ApiResponse}

// This Completely Returned when called with some values/params as Object 