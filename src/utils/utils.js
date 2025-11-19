import { format, parse } from "date-fns";

export const toFixed = (num) => {
  try {
    return Number(Number(num || 0).toFixed(0));
  } catch (e) {
    return num;
  }
}

export const formatNumberK = (number) => {
  try {
    const suffixes = ["", "k", "M", "B", "T"]; // Add more suffixes as needed

    const suffixNum = Math.floor(("" + number).length / 3);
    let shortValue = parseFloat((suffixNum !== 0 ? (number / Math.pow(1000, suffixNum)) : number).toPrecision(2));

    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }

    return shortValue + suffixes[suffixNum];
  } catch (e) {
    return number;
  }
}
export const removeHtmlEntities = (str) => {
  try {
    return str.replace(/&nbsp;/g, ' ').replace(/&(?:[a-z]+|#\d+);/gi, '');
  } catch (e) {
    return str;
  }
}

export const avatarAbbr = (text1, text2) => {
  let ch1 = text1?.[0] || '';
  let ch2 = text2?.[0] || '';
  return `${ch1}${ch2}`;
};


export const convertCloverTime = (input) => {
  try {
    console.log('converting', input);
    let timeString = input.toString().padStart(4, '0');

    let hours = timeString.substring(0, 2);
    let minutes = timeString.substring(2);

    let date = parse(`${hours}:${minutes}`, 'HH:mm', new Date());

    return format(date, 'h:mm a');
  } catch(e) {
    console.log('error converting', e);
    return input;
  }
}

export const cloverPriceFormat = (input) => {
  try {
    return `$${(input / 100).toFixed(2) }`;
  } catch(e) {
    return input;
  }
}