const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://anshmishra1414_db_user:Tyson5678@vaultxchange-cluster.gelim79.mongodb.net/banking_sim?retryWrites=true&w=majority&appName=vaultxchange-cluster";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('banking_sim');
    const accounts = database.collection('account');
    
    // Find the specific account
    const specificAccount = await accounts.findOne({ accountNumber: "2488102335" });
    console.log("Looking for 2488102335:", specificAccount);
    
    // Also list up to 5 accounts to see what's in there
    const allAccounts = await accounts.find({}).limit(5).toArray();
    console.log("Sample accounts in DB:", allAccounts.map(a => ({ id: a._id, accountNumber: a.accountNumber, pin: a.pin, password: a.password })));
    
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
