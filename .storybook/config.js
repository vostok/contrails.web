import { configure } from "@storybook/react";
import "../src/Style/Root.less";

const req = require.context("../stories", true, /.stories.tsx$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
