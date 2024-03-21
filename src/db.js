import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo = null;
const connectDatabase = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  // process.env.MONGO_URI = uri;
  // console.log(uri);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
const dropDatabase = async (err, client) => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
};
const dropCollections = async () => {
  if (mongo) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      // console.log(collection)
      await collection.drop();
    }
  }
};
export { dropDatabase, dropCollections, connectDatabase };
