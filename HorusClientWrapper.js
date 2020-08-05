const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const request = require("request");
const math = require("mathjs");
require("dotenv").config();
const horusModel = require("./HorusDataBaseModel.js");

function appendToFileWrapper(file, str) {
  fs.appendFile(file, str, (error) => {
    if (error)
      console.log(`ERROR with fs, could not write ${file} file `, error);
  });
}

function writeToFile(file, data, tabs = 0, first = true) {
  console.log("data ", data);
  let str = "";
  let tabsStr = "\t".repeat(tabs);
  if (first) str += "-".repeat(100) + "\n";
  str += `${tabsStr}Method : ${data.methodName}\n${tabsStr}Response Time : ${data.responseTime}\n${tabsStr}ID : ${data.id}\n`;
  if (data.trace === "none") {
    str += `${tabsStr}Trace : no additional routes\n\n`;
    appendToFileWrapper(file, str);
  } else {
    str += `${tabsStr}Trace : \n`;
    str += tabsStr + "\t\t" + "-".repeat(50) + "\n";
    appendToFileWrapper(file, str);
    writeToFile(file, data.trace, tabs + 2, false);
  }
}

// perform all operations/ checkers independently!
function checkTime(data) {
  const query = horusModel.find({ methodName: `${data.methodName}` });
  // perform DB query pulling out the history of response times for specific method
  query.exec((err, docs) => {
    if (err) console.log("Error retrieving data for specific method", err);
    if (docs.length) {
      const times = docs.map((doc) => doc.responseTime);
      const avg = math.mean(times).toFixed(3);
      const stDev = math.std(times, "uncorrected").toFixed(3);
      const minT = (Number(avg) - 2 * Number(stDev)).toFixed(3);
      const maxT = (Number(avg) + 2 * Number(stDev)).toFixed(3);
      // compare current response time to the range
      // slack alert if outside the range
      if (data.responseTime < minT || data.responseTime > maxT) {
        slackAlert(data.methodName, data.responseTime, avg, stDev);
      }
      // save trace to horus DB (maybe only acceptable traces to not mess up with normal distribution?)
    }
  });
  saveTrace(data);
}

function slackAlert(methodName, time, avgTime, stDev) {
  const obj = {
    text: "\n :interrobang: \n ALERT \n :interrobang: \n ",
    blocks: [
      {
        type: "section",
        block_id: "section567",
        text: {
          type: "mrkdwn",
          text: `\n :interrobang: \n '${methodName}' method took ${time}ms which is above the Standard Deviation Treshold   \n :interrobang: \n`,
          // text: `\n :interrobang: \n Check your '${service}' container, your time is ${time}ms which is above the 2 Standard Deviation Treshold   \n :interrobang: \n`,
        },
        accessory: {
          type: "image",
          image_url:
            "https://cdn.britannica.com/76/193576-050-693A982E/Eye-of-Horus.jpg",
          alt_text: "Horus_logo",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `the Average time is: ${avgTime}; standard deviation: ${stDev}`,
        },
      },
    ],
  };
  const slackURL = `${process.env.SLACK_URL}`;
  request.post({
    uri: slackURL,
    body: JSON.stringify(obj),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
function saveTrace(data) {
  const obj = {
    requestID: data.id,
    methodName: data.methodName,
    responseTime: data.responseTime,
    trace: data.trace,
  };
  console.log("obj to save *** ", obj);
  // can pass in to 'create' multiple objects (nesting case)
  const traceDoc = new horusModel(obj);
  traceDoc
    .save()
    .then(() => {
      console.log("Saving of trace was successful");
    })
    .catch((err) => {
      console.log("Error while trying to save trace ->>> ", err);
    });
}

function makeMethods(
  clientWrapper,
  client,
  metadata,
  names,
  file,
  writeToFile
) {
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    metadata[name] = {
      methodName: name,
      responseTime: null,
      id: null,
      trace: {},
    };
    clientWrapper[name] = function (message, callback) {
      const startTime = process.hrtime.bigint();
      client[name](message, (error, response) => {
        metadata[name].responseTime = (
          Number(process.hrtime.bigint() - startTime) / 1000000
        ).toFixed(3);
        metadata[name].id = uuidv4();
        checkTime(metadata[name]);
        // perform DB query returning acceptable limits for response time
        // save trace to horus DB (maybe only acceptable traces to not mess up with normal distribution?)
        writeToFile(file, metadata[name]);
        callback(error, response);
      }).on("metadata", (metadataFromServer) => {
        metadata[name].trace = JSON.parse(
          metadataFromServer.get("response")[0]
        );
      });
    };
  }
}

class HorusClientWrapper {
  constructor(client, service, file) {
    this.metadata = {};
    const names = Object.keys(service.service);
    makeMethods(this, client, this.metadata, names, file, writeToFile);
  }
  makeHandShakeWithServer(server, method) {
    server.acceptMetadata(this.metadata[method]);
  }
}

module.exports = HorusClientWrapper;
