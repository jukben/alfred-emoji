jest.mock('alfy');

const alfy = require('alfy');
const emoji = require('./index');

it('should return empty array', async () => {
  alfy.__setResponse();
  await expect(emoji()).resolves.toMatchSnapshot();
});

it('should return return correct smiles for "rofl"', async () => {
  alfy.__setResponse({
    results: [
      { text: '😂', score: 0.42186877131 },
      { text: '😆', score: 0.078554883599 },
      { text: '😹', score: 0.063283003867 },
      { text: '😄', score: 0.034623019397 },
      { text: '😝', score: 0.023925462738 },
      { text: '😭', score: 0.019115069881 },
      { text: '😜', score: 0.015078984201 },
      { text: '👇', score: 0.013672497123 },
      { text: '😀', score: 0.012559996918 },
      { text: '🙈', score: 0.011934921145 },
    ],
    synonyms: [],
  });
  await expect(emoji()).resolves.toMatchSnapshot();
});
