// @noflow
const ResponsesContext = require.context("./", true, /.json$/);

export default ResponsesContext.keys().map(x => ({ [x]: ResponsesContext(x) })).reduce(merge, {});

function merge(x, y) {
    return Object.assign(x, y);
}
