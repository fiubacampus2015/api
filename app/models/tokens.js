module.exports = function(mongoose) {
 
  var Schema = mongoose.Schema;
 
  // Objeto modelo de Mongoose
  var TokenSchema = new Schema({
    _user:{ type: Schema.Types.ObjectId, ref:'User' },
    value: { type:String, required: true,  unique: true},
    modified: { type: Date, default: Date.now }
  });

  return mongoose.model('Token', TokenSchema);
}