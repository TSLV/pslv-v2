exports.getAbout = (req,res,next)=>{
    res.render('company/about',{
        user:req.userType
    })
}

exports.getAccessibility = (req,res,next)=>{
    res.render('company/accessibility',{
        user:req.userType
    })
}

exports.getFaq = (req,res,next)=>{
    res.render('company/faq',{
        user:req.userType
    })
}

exports.getPrivacy = (req,res,next)=>{
    res.render('company/privacy',{
        user:req.userType
    })
}
