//////////////////////////
// Dependencies
//////////////////////////
require("dotenv").config()
const { PORT = 3001, DATABASE_URL } = process.env
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

////////////////////////
// Connection
///////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
mongoose.connection
.on("open", () => console.log("Connected to mongoose"))
.on("close", () => console.log("Disconnected from mongoose"))
.on("error", (error) => console.log(error))

///////////////////////////
// Schema and Model
///////////////////////////
const defaultSchema = new mongoose.Schema ({
    name: String,
}, {timestamps: true})

const Default = mongoose.model("Default", defaultSchema)

/////////////////////////
// Middleware
/////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
//====================//

//=== Bookmark Model==//
const BookmarkSchema = new mongoose.Schema({
    title: String,
    url: String,
})

const Bookmark = mongoose.model("Bookmark", BookmarkSchema)


//////////////////////
// Routes
//////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world");
  });

//Index Bookmarks
app.get('/bookmark', async(req, res)=>{
    try {
        res.json(await Bookmark.find({}));
    } catch (error){
        res.status(400).json(error);
    }
});

//Create Bookmarks
app.put('/bookmark', async (req, res)=>{
    try {
        res.json(await Bookmark.create(req.body));
    } catch (error) {
        res.status(400).json(error)
    }
});

//Update Bookmarks
app.put('/bookmark/:id', async (req, res)=>{
    try {
        res.json(
            await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true})
        );
    } catch (error) {
        res.status(400).json(error)
    }
});

//Edit Bookmarks
app.put('/bookmakrs/edit/:id', async (req, res)=>{
    try {
        res.json(Bookmark.findByIdAndUpdate(req.params.id, req.body, { }))
    } catch {
        res.status (400).json(error)
    }
});

//Destroy Bookmarks
app.delete('/bookmark/:id', async (req, res)=>{
    try {
        res.json(await Bookmark.findByIdAndRemove(req.params.id));
    } catch (error){
        res.status(400).json(error)
    }
});

//Show Bookmarks
app.get('/bookmark/:id', async (req, res)=>{
    try {
        res.json(await Bookmark.find(req.params.id));
    } catch (error) {
        res.status(400).json(error)
    }
});



////////////////////////
// Listener
///////////////////////
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})