
var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

const readSheet = require('./app')




app.get("/testimonials", async (req, res) => {
    let testimonialObject = {};
    var alumni = await readSheet.readSheet("Alumni!A2:D");
    testimonialObject.alumni = alumni;
    var mentors = await readSheet.readSheet("Mentors!A2:C");
    testimonialObject.mentors = mentors;
    var team = await readSheet.readSheet("Team!A2:D");
    testimonialObject.team = team;
    var interns = await readSheet.readSheet("Interns!A2:D");
    testimonialObject.interns = interns;

    res.json({
        response: testimonialObject
    })


});

app.listen(8080, () => {
    console.log("listening to port 8080");
});

