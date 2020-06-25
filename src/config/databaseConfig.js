const MONGO_URL = "mongodb+srv://sandra:copilhoinar123@fun-cluster-4amam.mongodb.net/<dbname>?retryWrites=true&w=majority";
const MONGO_OPTIONS = {
    auto_reconnect: true,
    useUnifiedTopology: true
};


module.exports = {
    MONGO_URL,
    MONGO_OPTIONS
};