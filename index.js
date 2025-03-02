const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
let path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
const expressError = require("./utils/expressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

let port = 8080;
let url = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
    mongoose.connect(url);
}
main().then((res) => {
    console.log(res);
})
    .catch((err) => {
        console.log(err);
    })
app.listen(port, () => {
    console.log("server started");
})
app.get("/", (req, res) => {
    res.send("into the root");
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// to accept request on any route of our domain any give a general response

app.all("*", (req, res) => {
    throw new expressError(404, "page not found");
})

app.use((err, req, res, next) => {
    let { status = 400, message = "something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
})

