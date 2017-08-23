// @noflow
/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";

export function createWithApiWrapper(key: string) {
    return function withApiWrapper(Comp: *) {
        return class WrapperClass extends React.Component {
            static displayName = `withApi(${Comp.displayName})`;
            static contextTypes = {
                [key]: PropTypes.object,
            };

            constructor(props, context) {
                super(props, context);

                if (!context[key]) {
                    throw Error(`No api was found in context. Wrap your component with ApiProvider`);
                }
            }

            render(): React.Element<*> {
                return <Comp {...{ [key]: this.context[key] }} {...this.props} />;
            }
        };
    };
}

function merge(x, y) {
    return { ...x, ...y };
}

export function createApiProvider(propsToContextNames: string[]) {
    return class ApiProvider extends React.Component {
        static propTypes = {
            children: PropTypes.element,
        };
        static childContextTypes = propsToContextNames.map(x => ({ [x]: PropTypes.any })).reduce(merge);

        getChildContext() {
            // eslint-disable-next-line no-unused-vars
            const { children, ...restProps } = this.props;
            return restProps;
        }

        render(): React.Element<*> {
            const { children } = this.props;
            return (
                React.Children.only(children)
            );
        }
    };
}
