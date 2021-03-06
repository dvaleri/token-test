const {expect} = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Token contract", function() {
    let Token;
    let token;
    let addr1;

    beforeEach(async function(){
        Token = await ethers.getContractFactory("Token");
        [addr1] = await ethers.getSigners();
        token = await Token.deploy();
    });

    describe("Mint", function(){
        it("Should mint 1 new token of id 0 and assign it to the sender", async function(){
            await token.mint(0);
            const balance = await token.balanceOf(addr1.address, 0);
            expect(balance.toNumber()).to.equal(1);
        });
    });

    describe("Burn", function(){
        it("Should mint 1 new token of id 0 then burn it", async function(){
            await token.mint(0);
            let balance = await token.balanceOf(addr1.address, 0);
            expect(balance.toNumber()).to.equal(1);
            await token.burn(addr1.address, 0, 1);
            balance = await token.balanceOf(addr1.address, 0);
            expect(balance.toNumber()).to.equal(0);
        });
    });

    describe("Get URI", function(){
        it("Should return the same uri for all token types", async function(){
            const uri1 = await token.uri(0);
            const uri2 = await token.uri(1);
            expect(uri1).to.equal("https://raw.githubusercontent.com/thechainn/mytokens/main/metadata/{id}.json");
            expect(uri2).to.equal(uri1);
        })
    })

    describe("Set URI", function(){
        it("Should set a new URI for all token types", async function(){
            await token.setURI("https://example-uri/{id}.json");
            const newUri = await token.uri(0);
            expect(newUri).to.equal("https://example-uri/{id}.json");
        })
    });

});