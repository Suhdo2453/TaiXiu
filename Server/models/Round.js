const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const roundSchema = new mongoose.Schema({
    small_money: Number,
    small_players: Number,
    big_money: Number,
    big_players: Number,
    counter: Number, // 1-> 60
    result: Number, // -1: waiting, 1: small, 0: big
    dice: Number,
    dateCreated: Date,
    roundNumber: Number
});
//roundSchema.plugin(AutoIncrement, { inc_field: "roundNumber" });
module.exports = mongoose.model("round", roundSchema);