const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const request = require("request");
const horusModel = require("./HorusDataBaseModel.js");
const math = require("mathjs");
// const { checkServerIdentity } = require("tls");

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
    // console.log("Docs from DB -> ", docs);
    if (docs.length) {
      // console.log("# of matching docs ", docs.length);
      const times = docs.map((doc) => doc.responseTime);
      console.log("TIMES -> ", times);
      // // const avg = (
      // //   times.reduce((sum, curr) => sum + curr) / docs.length
      // // ).toFixed(3);
      const avg = math.mean(times).toFixed(3);
      const stDev = math.std(times, "uncorrected").toFixed(3);
      // console.log('TYPE ***', typeof times[0]);
      console.log("AVG ***", avg);
      console.log("STDEV ***", stDev);
      // change back to 2 Stand. Dev. (95% of norm. distrib. data set)?
      const minT = (Number(avg) - Number(stDev)).toFixed(3);
      const maxT = (Number(avg) + Number(stDev)).toFixed(3);
      // const rng = [avg - stDev, avg + stDev];
      // console.log("RANGE ***", rng);
      console.log("RANGE ***", minT, maxT);
      // return [avg, stDev];
      // return [minT, maxT];
      console.log("CURR TIME ***", data.responseTime);
      // compare current response time to the range
      // slack alert if outside the range
      if (data.responseTime < minT || data.responseTime > maxT) {
        slackAlert(data.methodName, data.responseTime, avg, stDev);
      }
      // save trace to horus DB (maybe only acceptable traces to not mess up with normal distribution?)
      // saveTrace(data);
    }
  });
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
          text: `\n :interrobang: \n '${methodName}' method took ${time}ms which is above the 2 Standard Deviation Treshold   \n :interrobang: \n`,
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
  // move out the link to .env file
  const slackURL = 'https://hooks.slack.com/services/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';
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
    // serviceName: a.serviceName,
    // targetService: a.targetService,
    // timestamp: req.timeCompleted,
  };
  console.log("obj to save *** ", obj);
  // can pass in to 'create' multiple objects (nesting case)
  // horusModel.create(obj, (error, result) => {
  //   if (error)
  //     console.log("Error while trying to save the trace doc to Mongo DB");
  // });
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
        // CHECKER
        checkTime(metadata[name]);
        // perform DB query returning acceptable limits for response time
        // const rng = getRange(metadata[name]);
        // save trace to horus DB (maybe only acceptable traces to not mess up with normal distribution?)
        // saveTrace(metadata[name]);
        // console.log("logging metadata ", metadata[name]);
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
