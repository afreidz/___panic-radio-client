module.exports = function (text, room) {
  const leader = 'P!R -';
  const mid = text ? `Playing: ${text}` : '';
  const trailer = text ? `in Room: ${room}` : `Room: ${room}`;
  document.title = `${leader} ${mid} ${trailer}`;
};
