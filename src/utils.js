import { words } from "./words.js";

export function getRandomWord(){
    const randomIndex=Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

export function getFarewellText(level) {
    const options = [
        `Farewell, ${level}`,
        `Adios, ${level}`,
        `R.I.P., ${level}`,
        `We'll miss you, ${level}`,
        `Oh no, not ${level}!`,
        `${level} bites the dust`,
        `Gone but not forgotten, ${level}`,
        `The end of ${level} as we know it`,
        `Off into the sunset, ${level}`,
        `${level}, it's been real`,
        `${level}, your watch has ended`,
        `${level} has left the building`
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}