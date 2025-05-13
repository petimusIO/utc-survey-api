const mongoose = require('mongoose');
const User = require('../models/UserModel');

module.exports = {
    get: (req, res) => {
        res.send("Thank you for your Data!!!");
    },

    post: async (req, res) => {
        console.log("\nIncoming Data:\n", req.body);
        const data = req.body;

        // Determine the collection name (default: "users")
        const collectionName = data.dbTable ? data.dbTable : "users";
        console.log(`\nWriting to collection: ${collectionName}\n`);

        try {
            // Check if the model for this collection already exists
            let DynamicUserModel;
            if (mongoose.models[collectionName]) {
                DynamicUserModel = mongoose.models[collectionName]; // Reuse existing model
            } else {
                // Create a model dynamically using the existing User schema
                DynamicUserModel = mongoose.model(collectionName, User.schema, collectionName);
            }

            // Save the new user data to the specified collection
            const { dbTable, ...userData } = data;
            const newUser = new DynamicUserModel(userData);
            const savedUser = await newUser.save();

            res.json({ message: `Data saved in ${collectionName} collection`, id: savedUser._id });

        } catch (e) {
            console.error("\nError occurred:", e);
            res.status(500).json({ error: e.message });
        }
    }
};