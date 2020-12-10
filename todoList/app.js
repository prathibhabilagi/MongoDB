const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();



app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://UserName:PASSWORD@cluster0.3g3xg.mongodb.net/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema={
	name: String
};

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
	name: "Welcome"
});
const item2 = new Item({
	name: "item 2"
});
const item3 = new Item({
	name: "Item 3"
});

//Insert
const defaultItems = [item1, item2, item3];

const listSchema ={
	name: String,
	items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

	Item.find({}, function(err, foundItems){

		if(foundItems.length === 0){
			Item.insertMany(defaultItems, function(err){
			if(err){
				console.log(err);
			}
			else{
				console.log("Success");
			}
		});
			res.redirect("/");
		}else{
			res.render("list", {listTitle: "Today", newListItems: foundItems});
		}
	});

});

app.post("/", function(req, res){

	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName
	});
	if(listName === "Today"){
		item.save();
		res.redirect("/");
	}else{
		List.findOne({name: listName}, function(err, foundList){
			foundList.items.push(item);
			foundList.save();
			res.redirect("/"+ listName);
		});
	}
});


//Delete
app.post("/delete", function(req, res){
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if(listName === "Today"){
		Item.findByIdAndRemove(checkedItemId, function(err){
			if(!err){
				console.log("Sucessfully delted");
				res.redirect("/");
			}
		});
	}else{
		List.findOneAndUpdate({name:  listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
			if(!err){
				res.redirect("/"+listName);
			}
		});
	}

	
});

app.get("/:coustomListName", function(req,res){
	const coustomListName =  _.capitalize(req.params.coustomListName);

	List.findOne({name: coustomListName}, function(err, foundList){
		if(!err){
			if(!foundList){
				const list = new List({
				name: coustomListName,
				items: defaultItems
			});
				list.save();
				res.redirect("/"+ coustomListName);
			}else{
				res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
			}
		}
	})
	
	
});

app.get("/about", function(req, res){
	res.render("about");
});

let port = process.env.PORT;
if(port == null || port == ""){
	port = 3000;
}
//app.listen(port());

app.listen(port, function(){
	console.log("Server Started");
});