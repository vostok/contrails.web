// @noflow
const ResponsesContext = require.context("./", true, /.json$/);

export default ResponsesContext.keys().map(x => ({ [x]: ResponsesContext(x) })).reduce((x, y) => ({ ...x, ...y }), {});
