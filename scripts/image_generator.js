const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function getText(){
    return new Promise((resolve) => {
        rl.question("Enter some text: ", (input) => resolve(input));
    });
}



async function main(){
    const text = await getText();
    const width = 1080;
    const height = 1080;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const image = await loadImage("https://raw.githubusercontent.com/dvaleri/token-test/master/images/base-token-v3.png");
    context.drawImage(image, 0, 0);

    context.font = 'bold 60pt Ariel';
    context.textBaseline = 'center';
    context.textAlign = 'center';

    context.fillStyle = '#000';
    context.fillText(text, 540, 540);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./images/image.png', buffer);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
