const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://gofood:mern123@cluster0.nmuaa.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const foodItemsCollection = db.collection('food_items');  // Correct collection name
        const foodCategoryCollection = db.collection('food_category');  // Correct collection name

        const foodItems = await foodItemsCollection.find({}).toArray();
        const foodCategories = await foodCategoryCollection.find({}).toArray();

        // Logging the results to verify data retrieval
        // console.log('Food Items:', foodItems);
        // console.log('Food Categories:', foodCategories);

      

        global.food_items = foodItems;
        global.foodCategory = foodCategories;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = mongoDB;
