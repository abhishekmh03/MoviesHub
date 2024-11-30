const Foods = require("../models/food.js")

module.exports.all = async(req,res)=>{
    const foodData = await Foods.find({});
    res.json(foodData);
};

module.exports.popcorn = async(req,res)=>{
    const foodData = await Foods.find({category:"POPCORN"});
    res.json(foodData);
};

module.exports.snacks = async(req,res)=>{
    const foodData = await Foods.find({category:"SNACKS"});
    res.json(foodData);
};
module.exports.combos = async(req,res)=>{
    const foodData = await Foods.find({category:"COMBOS"});
    res.json(foodData); 
};
module.exports.beverages = async(req,res)=>{
    const foodData = await Foods.find({category:"BEVERAGES"});
    res.json(foodData);
};