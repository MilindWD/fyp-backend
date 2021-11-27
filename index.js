//requirements
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

//configure express
app.use(express.json());
app.use(cors({
  origin: '*'
}))

//connect to database
mongoose.connect(
    process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//Tweet Model
const Tweet = mongoose.model("Tweet", {
    id: Number,
    content: String,
    pos: Number,
    neg: Number,
    pos_rep: Number,
    neg_rep: Number,
    neutral: Number,
    irrelevant: Number,
    visited: Number,
});

//Global store
const Store = mongoose.model("Store", {
    counter: Number,
    pos: Number,
    neg: Number,
    pos_rep: Number,
    neg_rep: Number,
    neutral: Number,
    irrelevant: Number,
    visited: Number,
});

//handlers

//get a tweet
app.get("/tweet", async (req, res) => {
    const tweet = await Tweet.findOne().sort({ visited: 1});
    if(tweet) {
        res.send(JSON.stringify({content: tweet.content, _id: tweet._id}));
    } else {
        res.send(JSON.stringify({content: "Out of tweets :("}));
    }
})

//save a response 
app.post("/tweet", async (req, res) => {
    const tweet = await Tweet.findOne({_id: req.body._id});
    const store = await Store.findOne();
    if(tweet) {
        tweet.visited = tweet.visited + 1;
        if(tweet.visited == 1) {
            store.visited = store.visited + 1;
        }
        tweet[req.body.response] = tweet[req.body.response] + 1;
        store[req.body.response] = store[req.body.response] + 1;
        await tweet.save();
        await store.save();
        res.send({
            success: true
        });
    }
    else {
        res.send({
            success: false
        });
    }
});

//get insights
app.get("/insights", async (req, res) => {
    const store = await Store.findOne();
    res.send(JSON.stringify(store));
});



//express app
app.listen(process.env.PORT||5000, () => {
  console.log("Example app listening on port "+ process.env.PORT||5000);
});
