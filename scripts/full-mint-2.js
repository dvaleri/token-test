const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const readline = require('readline');
require("dotenv").config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { ethers } = require("hardhat");
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = "thechainn";
const repo = "mytokens";

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
    return buffer;
}


// Converts tokenId to hex number padded to 64 digits
function getPaddedId(tokenId){
    const abiCoder = ethers.utils.defaultAbiCoder;
    let paddedId = abiCoder.encode(["uint256"],[tokenId]);
    paddedId = paddedId.substring(2);
    return paddedId;
}

// Uploads file to github
async function uploadFile(content, filepath){
    let result = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        message: "Automated image commit",
        path: filepath,
        content,
    });
    console.log(`Created commit at ${result.data.commit.html_url}`)
}

// Connects to contract and mints a token of tokenId on the blockchain
async function mintToken(tokenId) {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.attach("0x52d23892fa7c493c9723d6Ef845EA689fA34Ea1E");
    await token.mint(tokenId);
}

async function main(){
    // Get tokenId from user and pad to 64 hex.
    const tokenId = await getText("Enter token id to mint: ");
    const paddedId = getPaddedId(tokenId);

    // Set metadata
    let metadata = await setMetadata();
    let name = metadata["name"];
    metadata["image"] = `https://raw.githubusercontent.com/thechainn/mytokens/main/myimages/${tokenId}.png`;

    // Generate dynamic image using token name and background image
    const buffer = await generateImage(name);
    
    // Save metadata JSON and token image locally
    //fs.writeFileSync(`./images/${tokenId}.png`, buffer);
    //fs.writeFileSync(`./metadata/${paddedId}.json`, JSON.stringify(metadata));
    console.log(metadata)

    // Convert image and metadata JSON to base64 to upload to github
    console.log("Uploading metdata...");
    let content = buffer.toString("base64");
    await uploadFile(content, `myimages/${tokenId}.png`);

    let objJsonStr = JSON.stringify(metadata);
    content = Buffer.from(objJsonStr).toString("base64");
    await uploadFile(content, `metadata/${paddedId}.json`);

    // Mint the token on the blockchain
    console.log("Minting token...");
    await mintToken(tokenId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
