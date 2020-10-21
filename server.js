const express = require('express')
const SocketServer = require('ws').Server
const sqlite3 = require('sqlite3').verbose();
var historyDataCreator = require( './historyDataCreator' );
var todayDataCreator = require( './todayDataCreator' );

const dbPath = "../IMM2_第二階段_20190926/immbox/db/WebData.db"
//指定開啟的 port
const PORT = 9000

//創建 express 的物件，並綁定及監聽 8000 port ，且設定開啟後在 console 中提示
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })
var num = todayDataCreator.createTotalCount()
var badCount = todayDataCreator.createbadCount()
//跟DB連接
var db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the WebData database.');
    }

});
// 隨機產生upperLimit~lowerLimit的溫度後回傳
function createTemperature(upperLimit, lowerLimit) {
    return (Math.random() * (upperLimit - lowerLimit) + lowerLimit).toFixed(2)
}


function createSamplData() {
    var fs = require('fs');
    var obj;
    obj = JSON.parse(fs.readFileSync('dataSample.json', 'utf8'));
    var im2box_0 = obj['IM2BOX'][0]
    //時間
    im2box_0["Timestamp"] = historyDataCreator.dateFromToday(0, true)
    // 製作數量
    if (isBreakDown()) {
        badCount += 1
    } 
    im2box_0['JobData']['BadCounter'] = badCount.toFixed(0)
    num += 1
    im2box_0['JobData']['TotalCounter'] = num
    // 溫度
    im2box_0['TempData'] = [createTemperature(200,190), createTemperature(202,192), createTemperature(204,194), createTemperature(206,196), createTemperature(208,198)]

    return obj

};
function isBreakDown() {
    if (Math.random() >= 0.1) {
        return false
    } else {
        return true
    }
}

function writeHistDataToDB() {
    db.serialize(function () {
        db.run("DELETE FROM HistData");
        db.run("CREATE TABLE IF NOT EXISTS HistData(DataTime TEXT, MachineID TEXT, OEE INTEGER, TotalCount INTEGER, BadCount INTEGER, Alarms INTEGER, Yeild NUMERIC)",
            function (err) {
                if (err) {
                    console.log("create database error,", err.message)
                } else {
                    console.log("create database success")
                }
            });

        let sql01 = "INSERT INTO HistData(DataTime, MachineID , OEE , TotalCount , BadCount , Alarms, Yeild) VALUES (?,?,?,?,?,?,?)";
        for (let i = 0; i < 20 ; i++) {
            db.run(sql01,historyDataCreator.history(i));
        }
        console.log('finish insert HistData.');
        
    })
};


function writeTodayData() {
    db.serialize(function () {
        db.run("DELETE FROM TodayData");
        db.run("CREATE TABLE IF NOT EXISTS TodayData(TimeStamp TEXT, MachineID TEXT, Status TEXT)",
            function (err) {
                if (err) {
                    console.log("create database error,", err.message)
                } else {
                    console.log("create database success")
                }
            });

        let sql01 = "INSERT INTO TodayData(TimeStamp, MachineID , Status) VALUES (?,?,?)";
        let count = todayDataCreator.calculateCountFromNow()
        console.log(count)
        for (let i = 0; i < count ; i++) {
            db.run(sql01,todayDataCreator.todayData(i));
        }
        console.log('finish insert HistData.');
        db.close();
    })
}

writeHistDataToDB();
writeTodayData();
//當 WebSocket 從外部連結時執行
wss.on('connection', ws => {

    //連結時執行此 console 提示
    console.log('Client connected')

    const sendNowTime = setInterval(() => {
        ws.send(JSON.stringify(createSamplData()))

    }, 1000)

    //當 WebSocket 的連線關閉時執行
    ws.on('close', () => {
        clearInterval(sendNowTime)
        console.log('Close connected')
    })
})