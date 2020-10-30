// MongoDB Connection

const mongoose = require("mongoose");
const Story = require("../models/Story");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        console.log(`MongoDB is Connected: ${conn.connection.host}`);
        // To create new index first drop the previous one
        // const drop = await Story.collection.dropIndex(
        //     "storyName_text_genre_text_tag_text_summary_text"
        // );
        // console.log(drop);
        // get the list of all the indexes
        // const index = await Story.collection.indexes();
        // console.log(index);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;
