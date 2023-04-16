
exports.getIndex = (req,res,next)=>{
    res.render('userApp/index');
}

exports.getDashboard = (req,res,next)=>{
    res.render('userApp/home');
}