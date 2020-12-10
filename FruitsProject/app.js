const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruitsDB', {useNewUrlParser: true, useUnifiedTopology: true});

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: {
    type: Number,
    min: 1,
    max:10
  },
  review: String 
});

const Fruit = mongoose.model("Fruit", fruitSchema);
const fruit = new Fruit({
    name: "Apple",
    rating: 4,
    review: "Great fruit"   
});
//fruit.save();

 const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema
 });

 const Person = mongoose.model("Person", personSchema);

 const mango = new Fruit({
  name: "Mango",
  score: 9,
  review:"Great....."
 });

 mango.save();

 // const person = new Person({
 //  name: "Amy",
 //  age: 27,
 //  favouriteFruit: mango
 // });

//person.save();

const kiwi = new Fruit({
    name: "kiwi",
    rating: 10,
    review: "Best Fruit"  
});

const orange = new Fruit({
    name: "Orange",
    rating: 6,
    review: "sour"  
});

const banana = new Fruit({
    name: "Banana",
    rating: 3,
    review: "Texture"  
});

// Fruit.insertMany([kiwi, orange, banana], function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Succesfully saved the fruits to fruit");
//   }
// })

Fruit.find(function(err, fruits){
  if(err){
    console.log(err);
  }else{
    mongoose.connection.close();

    fruits.forEach(function(fruit){
      console.log(fruit.name);
    })
  }
});

Person.updateOne({name:"Tae"}, {favouriteFruit: banana}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Succesfully updated the document");
  }
});

// Fruit.deleteOne({name: "kiwi"}, function(err){
//   if(err){
//      console.log(err);
//   }else{
//     console.log("Succesfully deleted the document");
//   }
// });

// Person.deleteMany({name: "Tae"}, function(err){
//    if(err){
//      console.log(err);
//   }else{
//       console.log("Succesfully deleted all the document");
//     }
//   });