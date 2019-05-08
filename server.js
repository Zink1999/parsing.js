let osmosis = require("osmosis"); //установка пакета для парсинга
let fs = require("fs"); // установка переменной для работы с файловой системой

const MongoClient = require("mongodb").MongoClient; //ключевой класс для работы с MongoDB
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
//адрес сервера + данном случае применяется объект конфигурации, он имеет свойство, что указывает mongodb, 
//что надо использовать новый парсел адреса сервера

osmosis
  .get('http://cinema.vn.ua') //адрес нашего сайта для парсинга
  .find('.view .name a').set('Фильмы') // ищем необходимое нам
  .data(function(listing) { //информация сохраняется в listing
    fs.appendFileSync("index.html", JSON.stringify(listing), function(err) { //информация дозаписывается в файл index.html в json-формате
      if (err) {
      	throw err;} // стандратный обработчик ошибок
    });
  
let data = {}; //переменная типа масив для записи в базу mongo
data.news = listing; // в переменной date будет записан результат парсинга
    mongoClient.connect(function(err, client) { // для подключения к серверу исспользуем connect
      const db = client.db("server"); // указываем с какой базой будем работать
      const collection = db.collection("pars"); // указываем с какой коллекцией будем работать
      collection.insertOne(listing, function(err, result) { //для добавления одного документа - объекта listing применятеся метод insertOne
        if (err) { //имеет сам добавляемый обьект и метод обратного вызова. 
          return console.log(err);
        }
        console.log(result.ops); // обьект, полученый из базы и который содержит идентификатор, установленный при добавлении
        client.close(); // закрываем соединение с базой
      });
    });
  });