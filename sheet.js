
var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

const readSheet = require('./app')




app.get("/testimonials", async (req, res) => {
    let testimonialArray = []
    var alumni = await readSheet.readSheet("Mentors!A2:C");
    testimonialArray.push(alumni);

    console.log(testimonialArray);
    console.log('jsshsh');


});

app.listen(8080, () => {
    console.log("listening to port 8080");
});

