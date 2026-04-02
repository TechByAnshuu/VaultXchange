const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://anshmishra1414_db_user:Tyson5678@vaultxchange-cluster.gelim79.mongodb.net/banking_sim?retryWrites=true&w=majority&appName=vaultxchange-cluster";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('banking_sim');
    const result = await database.command({ ping: 1 });
    console.log("Ping successful", result);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
