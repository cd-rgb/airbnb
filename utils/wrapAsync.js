//better way to represent a try and catch block

module.exports=function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}