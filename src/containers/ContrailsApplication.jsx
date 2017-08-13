// @flow
import React from "react";

import ContrailsLayout from "../components/ContrailsLayout";

type ContrailsApplicationProps = void;

type ContrailsApplicationState = {};

export default class ContrailsApplication extends React.Component {
    props: ContrailsApplicationProps;
    state: ContrailsApplicationState;

    render(): React.Element<*> {
        return (
            <ContrailsLayout>
                <div>Hi1</div>
            </ContrailsLayout>
        );
    }
}
