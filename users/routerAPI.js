const url = "mongodb+srv://caporusso:<password>@cluster0.iz4eq.mongodb.net/ASE?retryWrites=true&w=majority"
const MongoClient = require('mongodb').MongoClient;
let datab

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
	console.log('connecting to database');
    if (err) {console.log('error')
		throw err}
    datab = client.db('users');
    try {
        if (err) { console.log('error') };
        datab = client.db('users');
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        console.log("Error connecting");
    }
})

const express = require('express')
const router = express.Router()
const fs = require('fs')
// should be changed to your mongoDB url.
/* API routes */
router.get('/', (req, res) => {
	let users = [];
	users = datab.collection('user').find().toArray((err, result)=>{
		res.status(200).json(result)
	} )

})
router.post('/', (req, res) => {
	var body = req.body
	datab.collection('count').findOne({name:'total'},(err, total)=>{
		if(err){
			console.log('count does not work')
			throw err
		}
		var count = parseInt(total.count)
		body._id = count + 1
		datab.collection('count').updateOne({},{$inc:{count:1}},(err, result)=>{
			datab.collection('user').insertOne(body, (err, result)=>{
				res.status(200).json(result)
			})
		})
	})
	console.log(body)
	datab.collection('user').insertOne(body, (err, result)=>{
	res.status(201).json(result)})


})
router.get('/:id', (req, res) => {
	let id = parseInt(req.params.id)
	console.log(id)
	datab.collection('user').findOne({ _id: id },(err,result)=>
	{
		console.log(result)
		res.status(200).json(result)
	})
})
router.patch('/:id', (req, res) => {
	let id = parseInt(req.params.id)
	let user = []
	let body = req.body
	user = datab.collection('user').updateOne({ _id: id }, { $set: body })
	res.status(200).json({ message: 'user modified' })
})
router.delete('/:id', (req, res) => {
	let id = parseInt(req.params.id)
	datab.collection('user').deleteOne({ _id: id }, (err, result)=>{
		if (err) {
			res.status(500).json({ message: 'error' })
		} else {
			res.status(200).json({ message: 'user deleted' })
		}
	})
})
module.exports = router