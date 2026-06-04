const http = require('http');
const os = require("os");

const userInfo = os.userInfo();
const name = userInfo.username;

const hostname = '0.0.0.0';
const port = 3030;

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

let count = 0;

async function run() {
    try {
        await mongoClient.connect();

        const db = mongoClient.db("test1");

        const result = await db.command({ ping: 1 });
        console.log("Подключение с сервером MongoDB успешно установлено");

        const collection = db.collection("users");

        count = await collection.countDocuments();

        console.log(`В коллекции users ${count} документа/ов`);
        console.log(result);
    } catch (err) {
        console.log("Возникла ошибка при работе с MongoDB");
        console.log(err);
    } finally {
        await mongoClient.close();
        console.log("Подключение к MongoDB закрыто");
    }
}

run().catch(console.error);

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Hello ${name}, you have ${count} documents`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
