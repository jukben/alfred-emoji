'use strict';

const path = require('path');
const alfy = require('alfy');
const search = require('@jukben/emoji-search');
const unicode = require('@jukben/unicode').default;
const emojis = require('emoji-datasource-apple');

const emojiLookup = emojis.reduce((a, v, i, arr) => {
  a[v.unified.toLowerCase()] = v;
  return a;
}, {});

const getHex = char => unicode(char).hexCodeAt(0);

function getImagePath(char) {
  return `${path.dirname(
    require.resolve('emoji-datasource-apple')
  )}/img/apple/64/${getHex(char)}.png`;
}

function getName(char) {
  return emojiLookup[getHex(char)].name || char;
}

const emoji = () =>
  alfy
    .fetch('emoji.getdango.com/api/emoji', {
      query: {
        q: alfy.input,
        syn: 1,
      },
    })
    .then(({ results, synonyms = [] } = {}) => {
      if (!results) {
        return alfy.output([
          { title: 'Nothing found!', icon: { path: getImagePath('👀') } },
        ]);
      }

      return alfy.output(
        [
          ...new Set([...synonyms, ...results.map(({ text }) => text)]),
        ].map(char => ({
          title: '',
          subtitle: getName(char).toLowerCase(),
          icon: { path: getImagePath(char) },
          arg: char,
        }))
      );
    });

emoji();

module.exports = emoji;
