'use strict'

const fs = require('fs');
const args = process.argv.slice(2);

/*
Make sure all parameters are passed in correctly
 */
if (args.length < 2 || (args[1] == "endpointCheck" && args.length < 3)) {
    printUsage();
    return;
}

let fileName = args[0];
let option = args[1];

/*
Read the file into JSON obj.
 */
let jsonFile;
let jsonObj;

jsonFile = fs.readFileSync(fileName);
jsonObj = JSON.parse(jsonFile);

/*
Parse through the json file to get start and end nodes
 */
let startPt;
let endPts = [];
for (var key in jsonObj) {
    var val = jsonObj[key];
    if (val.tag.includes("-start")) {
        startPt = key;
    }
    if (val.tag == "bye") {
        endPts.push(key);
    }
}

/*
Process the json file based on the parameter passed in
 */
if (option == "allPath") {
    let allPaths = allPath();

    for (let i = 0; i < allPaths.length; i++) {
        console.log(allPaths[i]);
    }
}

if ("option == checkEndpt") {
    if (jsonObj[args[2]] == undefined) {
        console.log("Error: node " + args[2] + " does not exist.");
        return;
    }
    let endptReached = checkEndpts();
    console.log(endptReached);
}

/*
Helper methods
 */
function allPath() {
    let allPaths = [];
    let visited = [];
    traverse(allPaths, [], visited, jsonObj, startPt, endPts);
    return allPaths;
}

function traverse(allPaths, path, visited, jsonObj, node, endPts) {
    if (endPts.includes(node)) {
        visited.push(node);
        path.push(node);
        allPaths.push(pathToStr(path));
        return;
    }

    visited.push(node);
    path.push(node);
    let childRoutes = jsonObj[node].routes.split("|");
    const uniqueSet = new Set(childRoutes);
    for (let p of uniqueSet) {
        if (!visited.includes(p)) {
            traverse(allPaths, path, visited, jsonObj, p, endPts);
            path.pop();
            visited.pop();
        }
    }
}

function pathToStr(path) {
    let pathStr = "";
    for (let i = 0; i < path.length; i++) {
        if (pathStr != "") {
            pathStr = pathStr + "|";
        }
        pathStr = pathStr + path[i];
    }
    return pathStr;
}

function checkEndpts() {
    let pathObj = {};
    endpointCheckDFS(pathObj, jsonObj, startPt, endPts, false);
    return pathObj[args[2]];
}

function endpointCheckDFS(pathObj, jsonObj, current, endPts, sawEndpt) {
    if (endPts.includes(current)) {
        pathObj[current] = sawEndpt;
        return;
    }

    let isEndpt = false;
    if (sawEndpt || jsonObj[current].stage == "endpoint") {
        isEndpt = true;
    }
    pathObj[current] = isEndpt;

    let childRoutes = jsonObj[current].routes.split("|");
    const uniqueSet = new Set(childRoutes);
    for (let p of uniqueSet) {
        if (pathObj[p] == undefined) {
            endpointCheckDFS(pathObj, jsonObj, p, endPts, isEndpt);
        }
    }
}

function printUsage() {
    console.log("Usage: node conversationpath.js <.json> [allPath | endpointCheck] <lessonid>")
    console.log();
    console.log("Examples:");
    console.log("\tnode conversationpath.js allornothing.json allPath");
    console.log("\tnode.conversationpath.js label.json endpointCheck NRB");
}
