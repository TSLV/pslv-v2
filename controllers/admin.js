const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const News = require('../models/news')

exports.postNews = async(req,res,next) => {
    const news = req.body.news;
    console.log(news);
    const newsData = new News({
        news: news
    })
    await newsData.save();
    res.redirect('/admin')
}