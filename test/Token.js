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

});