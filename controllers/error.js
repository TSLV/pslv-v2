exports.get404 = (req, res, next) => {
  if(req.userType){
    res.status(404).render("error/error",{
      user: req.userType,
    });
  }
};
