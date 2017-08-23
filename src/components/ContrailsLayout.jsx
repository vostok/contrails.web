// @flow
import * as React from "react";
import glamurous from "glamorous";

import { Button, Input, Icon } from "ui";

type ContrailsLayoutProps = {
    children: React.Node,
};

type ContrailsLayoutState = {};

export default class ContrailsLayout extends React.Component<ContrailsLayoutProps, ContrailsLayoutState> {
    props: ContrailsLayoutProps;
    state: ContrailsLayoutState;

    render(): React.Element<*> {
        const { children } = this.props;
        return (
            <Container>
                <Header>
                    <Logo>
                        <LogoIcon>
                            <Icon name="OwnershipBoat" />
                        </LogoIcon>
                        <LogoText>Contrails</LogoText>
                    </Logo>
                    <TraceIdContainer>
                        <Input placeholder="Введите TraceId" autoFocus width={500} />
                        <Gap />
                        <Button use="success">Открыть</Button>
                    </TraceIdContainer>
                </Header>
                <Content>
                    {children}
                </Content>
            </Container>
        );
    }
}

const Header = glamurous.div({
    display: "flex",
    flexGrow: "0",
    flexShrink: "0",
    backgroundColor: "#white",
    padding: "5px 20px 7px",
    color: "black",
    alignItems: "baseline",
    fontSize: "18px",
    lineHeight: "32px",
    boxShadow: "0 1px 1px 0 rgba(0,0,0,.1), 0 1px 8px 0 rgba(0,0,0,.1)",
});

const TraceIdContainer = glamurous.div({
    marginLeft: 20,
});

const Gap = glamurous.span({
    display: "inline-block",
    width: 10,
});

const TraceIdCaption = glamurous.span({
    marginRight: 10,
});

const LogoIcon = glamurous.span({
    color: "black",
    fontSize: 23,
});

const LogoText = glamurous.span({
    marginLeft: 10,
});

const Logo = glamurous.div({});

const Container = glamurous.div({
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    maxHeight: "100%",
});

const Content = glamurous.div({
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    flexGrow: 1,
    flexBasis: "100%",
});
