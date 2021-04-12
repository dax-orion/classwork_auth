"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Subscriber = require("./subscriber");
const Course = require("./course");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
    {
        name: {
            first: {
                type: String,
                required: true
            },
            last: {
                type: String,
                required: true
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        zipCode: {
            type: Number,
            min: [10000, "Zip code too short"],
            max: [99999]
        },
        courses: [{type: Schema.Types.ObjectId, ref: Course}],
        subscribedAccount: {type: Schema.Types.ObjectId, ref: Subscriber}
    },
    {
        timestamps: true
    }
)

userSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`
});

userSchema.pre("save", function(next){
    let user = this;
    if(user.subscribedAccount == undefined){
        Subscriber.findOne({
            email: user.email
        })
        .then(subscriber => {
            user.subscribedAccount = subscriber;
            next();
        })
        .catch(error => {
            console.log(`error in associating subscriber: ${error.message}`);
            next(error);
        });
    }
    else {
        next();
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
