// Applied to every schema's toJSON option so API responses look like
// { id: "...", name: "...", ... } instead of Mongo's { _id, __v }.
// Note: id is now a string (ObjectId), not an auto-incrementing number like in the Java version.
function transform(doc, ret) {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

module.exports = { toJSON: { virtuals: true, transform } };
