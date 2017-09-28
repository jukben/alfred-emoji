const responses = [];

module.exports = {
  __setResponse: a => {
    responses.push(a);
  },
  output: a => a,
  fetch: () => Promise.resolve(responses.pop()),
};
