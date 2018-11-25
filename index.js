"use strict";

const path = require("path");
const alfy = require("alfy");
const search = require("@jukben/emoji-search").default;
const unicode = require("@jukben/unicode").default;
const emojis = require("emoji-datasource-apple");

const ALWAYS_OFFLINE = +process.env["always-offline"] || 0;

const emojiLookup = emojis.reduce((a, v, i, arr) => {
  a[v.unified.toLowerCase()] = v;
  return a;
}, {});

const getHex = char => unicode(char).hexCodeAt(0);

function getImagePath(char) {
  return `${path.dirname(require.resolve("emoji-datasource-apple"))}/img/apple/64/${getHex(char)}.png`;
}

function getName(char) {
  return (emojiLookup[getHex(char)] && emojiLookup[getHex(char)].name) || char;
}

const emoji = () => {
  const format = char => {
    return {
      title: "",
      subtitle: getName(char).toLowerCase(),
      icon: { path: getImagePath(char) },
      arg: char
    };
  };

  const nothingFound = [{ title: "Nothing found!", icon: { path: getImagePath("👀") } }];

  const getOfflineEmoji = () => {
    let results = search(alfy.input)
      .map(({ char }) => char)
      .filter(char => char)
      .map(format)

      if (!results.length) {
        results = nothingFound; 
      }

      return results;
  }

  if (ALWAYS_OFFLINE) {
    return alfy.output(getOfflineEmoji());
  }

  return alfy
    .fetch("emoji.getdango.com/api/emoji", {
      maxAge: 8640000000, // cache for 24 hours
      query: {
        q: alfy.input,
        syn: 1
      }
    })
    .then(({ results, synonyms = [] } = {}) => {
      if (!results) {
        return alfy.output(nothingFound);
      }

      return alfy.output([...new Set([...synonyms, ...results.map(({ text }) => text)])].map(format));
    })
    .catch(() => {
      alfy.output(getOfflineEmoji())
    });
};

emoji();

module.exports = emoji;
