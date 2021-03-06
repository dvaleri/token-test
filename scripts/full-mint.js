const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const readline = require('readline');
require("dotenv").config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { ethers } = require("ethers");
const GitHub = require('github-api');


const github = new GitHub({
    username: "thechainn",
    password: process.env.GITHUB_TOKEN
});

const repo = github.getRepo("thechainn", "mytokens");

// Function to get text from stdin
function getText(_promt){
    return new Promise((resolve) => {
        rl.question(_promt, (input) => resolve(input));
    });
}

// Creates metadata json and sets name and description fields using input from stdin
async function setMetadata(){
    let _metadata = {
        "name":"", 
        "description":"", 
        "image":""
    };
    let _text = await getText("Enter token name: ");
    _metadata["name"] = _text;
    _text = await getText("Enter description: ");
    _metadata["description"] = _text;
    return _metadata;
}

// Draws token name over the base image
async function generateImage(name){
    const width = 1080;
    const height = 1080;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const image = await loadImage("https://raw.githubusercontent.com/thechainn/mytokens/main/myimages/base-token-v3.png");
    context.drawImage(image, 0, 0);

    context.font = 'bold 60pt Ariel';
    context.textBaseline = 'center';
    context.textAlign = 'center';

    context.fillStyle = '#000';
    context.fillText(name, 540, 540);

    const buffer = canvas.toBuffer('image/png');
    //return buffer;
    return canvas;
}


// Converts tokenId to hex number padded to 64 digits
function getPaddedId(tokenId){
    const abiCoder = ethers.utils.defaultAbiCoder;
    let paddedId = abiCoder.encode(["uint256"],[tokenId]);
    paddedId = paddedId.substring(2);
    return paddedId;
}


async function main(){
    const tokenId = await getText("Enter token id to mint: ");
    
    let metadata = await setMetadata();
    let name = metadata["name"];

    metadata["image"] = `https://raw.githubusercontent.com/thechainn/mytokens/main/myimages/${tokenId}.png`;

    const canvas = await generateImage(name);
    const buffer = canvas.toBuffer();

    fs.writeFileSync(`./images/${tokenId}.png`, buffer);
    fs.writeFileSync(`./metadata/${getPaddedId(tokenId)}.json`, JSON.stringify(metadata));
    console.log(metadata)


    await repo.writeFile(
        "main",
        `metadata/${getPaddedId(tokenId)}.json`,
        JSON.stringify(metadata),
        "Automated commit",
        function(err){console.log(err)}
    );

    await repo.writeFile(
        "main",
        `myimages/${tokenId}.png`,
        content,
        "Automated image commit",
        function(err){console.log(err)}
    );
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
