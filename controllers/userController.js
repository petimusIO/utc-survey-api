const mongoose = require('mongoose');
const User = require('../models/UserModel');
const mailchimp = require('@mailchimp/mailchimp_marketing');

module.exports = {
    get: (req, res) => {
        res.send("Thank you for your Data!!!");
    },

    post: async (req, res) => {
        console.log("\nIncoming Data:\n", req.body);
        const data = req.body;
        let mailchimpResult = { status: "not_attempted" };
    
        // Determine the collection name (default: "users")
        const collectionName = data.dbTable ? data.dbTable : "users";
        console.log(`\nWriting to collection: ${collectionName}\n`);
    
        try {
            // Database operations with dynamic schema creation
            let DynamicUserModel;
            
            // Remove dbTable before processing data structure
            const { dbTable, ...userData } = data;

            if ( (!userData.userId || userData.userId === null)) {
                userData.userId = new mongoose.Types.ObjectId().toString();
                console.log(`Added unique userId: ${userData.userId} for ${collectionName}`);
            }
            
            if (mongoose.models[collectionName]) {
                DynamicUserModel = mongoose.models[collectionName];
            } else {
                // Create dynamic schema based on the incoming data structure
                const schemaDefinition = createDynamicSchema(userData);
                const dynamicSchema = new mongoose.Schema(schemaDefinition, { 
                    strict: false,  // Allow fields not in schema
                    timestamps: true // Add createdAt and updatedAt
                });
                
                DynamicUserModel = mongoose.model(collectionName, dynamicSchema, collectionName);
            }
    
            // Save user data
            const newUser = new DynamicUserModel(userData);
            const savedUser = await newUser.save();
            console.log("\nUser saved to database:", savedUser);
    
            // Try Mailchimp operations before sending response
            let emailToUse = userData.email;
            if (!emailToUse && userData.phoneNumber) {
                const sanitizedPhone = userData.phoneNumber.replace(/\D/g, '');
                emailToUse = `phone_${sanitizedPhone}@placeholder.com`;
            }
            try {
                mailchimp.setConfig({
                    apiKey: process.env.MAILCHIMP_API_KEY,
                    server: process.env.MAILCHIMP_SERVER_PREFIX
                });
    
                const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    
                if (emailToUse) {
                    const response = await mailchimp.lists.addListMember(audienceId, {
                        email_address: emailToUse,
                        status: "subscribed",
                        merge_fields: {
                            FNAME: userData.firstName || "",
                            LNAME: userData.lastName || "",
                            PHONE: userData.phoneNumber || "",
                            ALLOW: String(userData.allowContact || false),
                            CATEGORY: userData.category || "Uncategorized",
                            TOTALSCORE: String(userData.totalScore || 0)
                        }
                    });
                    mailchimpResult = { status: "success", id: response.id };
                } else {
                    mailchimpResult = { status: "skipped", reason: "no_email" };
                }
            } catch (mailchimpError) {
                mailchimpResult = { status: "error", message: mailchimpError.message };
            }

            // Add user to another Mailchimp list if needed
            try {
                const secondaryAudienceId = process.env.MAILCHIMP_SECONDARY_AUDIENCE_ID;
                let formattedPhone = "";
                if (userData.phoneNumber) {
                    const digitsOnly = userData.phoneNumber.replace(/\D/g, '');
                    if (digitsOnly.length === 10) {
                        formattedPhone = `+1${digitsOnly}`;
                    } else if (digitsOnly.length > 10) {
                        formattedPhone = `+${digitsOnly}`;
                    } else {
                        formattedPhone = digitsOnly;
                    }
                }
                if (secondaryAudienceId && emailToUse) {
                    const secondaryResponse = await mailchimp.lists.addListMember(secondaryAudienceId, {
                        email_address: emailToUse,
                        status: "subscribed",
                        merge_fields: {
                            FNAME: userData.firstName || "",
                            LNAME: userData.lastName || "",
                            PHONE: userData.phoneNumber || "",
                        }
                    });
                    console.log("\nUser added to secondary Mailchimp list:", secondaryResponse.id);
                } else {
                    console.log("\nSkipping secondary Mailchimp list: Missing audience ID or email.");
                }
            } catch (secondaryMailchimpError) {
                console.error("\nError adding user to secondary Mailchimp list:", secondaryMailchimpError.message);
            }
    
            // Send response ONLY ONCE at the end with all data
            res.json({ 
                success: true,
                message: `Data saved in ${collectionName} collection`, 
                id: savedUser._id,
                mailchimp: mailchimpResult
            });
    
        } catch (e) {
            console.error("\nError occurred:", e);
            res.status(500).json({ error: e.message });
        }
    }
};

// Helper function to create dynamic schema
function createDynamicSchema(data) {
    const schemaDefinition = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (typeof value === 'string') {
                schemaDefinition[key] = { type: String };
            } else if (typeof value === 'number') {
                schemaDefinition[key] = { type: Number };
            } else if (typeof value === 'boolean') {
                schemaDefinition[key] = { type: Boolean };
            } else if (Array.isArray(value)) {
                schemaDefinition[key] = { type: [mongoose.Schema.Types.Mixed] };
            } else if (typeof value === 'object') {
                schemaDefinition[key] = { type: mongoose.Schema.Types.Mixed };
            } else {
                schemaDefinition[key] = { type: mongoose.Schema.Types.Mixed };
            }
        }
    }
    return schemaDefinition;
}