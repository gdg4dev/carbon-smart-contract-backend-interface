require('dotenv').config()
const { ethers } = require('ethers');
const fs = require('fs');
const contractABI = JSON.parse(fs.readFileSync('contractABI.json', 'utf8'));
const contractAddress = '0x945F4079Bdf06f0520c636FF8aE246F42D02Da8C';
const rpcURL = 'https://rpc-evm-sidechain.xrpl.org';
const chainId = 1440002;
const provider = new ethers.JsonRpcProvider(rpcURL, chainId);
const seedWalletKey = process.env.seedKey


async function sendEther(recipientAddress) {
    const amountInEther = '100.0';
    const wallet = new ethers.Wallet(seedWalletKey, provider);
    console.log(`Sending ${amountInEther} XRP to ${recipientAddress}...`)
    const tx = {
        to: recipientAddress,
        value: ethers.parseEther(amountInEther)
    };

    try {
        const txResponse = await wallet.sendTransaction(tx);
        console.log(`Transaction hash: ${txResponse.hash}`);
        const receipt = await txResponse.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    } catch (error) {
        console.error(`Error sending Ether: ${error}`);
    }
}

async function addUserHabit(privateKey, transportationMode, carbonSaved, miles, timestamp) {
    const userPrivateKey = privateKey;
    const wallet = new ethers.Wallet(userPrivateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const tx = await contract.addUserHabit(transportationMode, carbonSaved, miles, timestamp);
    await tx.wait();
    console.log(tx)
    console.log(`Habit added!`);
}

async function createWalletAndInitiate(email, transportationMode, carbonSaved, miles, timestamp) {
    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const publicKey = wallet.address;
    await sendEther(publicKey)
    console.log(`Email: ${email}, Private Key: ${privateKey}, Public Key: ${publicKey}`);
    addUserHabit(privateKey, transportationMode, carbonSaved, miles, timestamp)
    return wallet;
}

async function main() {
    // replace with whatever email you get <<>>
    const email = 'gdg4dev@gmail.com';
    let transportationMode = "Flight";
    let carbonSaved = 25; // in grams
    let miles = 32;
    let timestamp = "0404040404" // any time stamp you want.
    await createWalletAndInitiate(email, transportationMode, carbonSaved, miles, timestamp);
}

main().catch(console.error);