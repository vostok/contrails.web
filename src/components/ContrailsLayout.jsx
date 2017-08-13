// @flow
import React from "react";
import { Button, Input, Icon } from "ui";
import glamurous from "glamorous";

type ContrailsLayoutProps = {
    children?: React.Element<*>[],
};

type ContrailsLayoutState = {};

export default class ContrailsLayout extends React.Component {
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
                        <TraceIdCaption>TraceId:</TraceIdCaption>
                        <Input placeholder="Введите TraceId" autoFocus width={500} />
                        <Gap />
                        <Button use="success">Открыть</Button>
                    </TraceIdContainer>
                </Header>
                <div>
                    {children}
                </div>
            </Container>
        );
    }
}

const Header = glamurous.div({
    display: "flex",
    backgroundColor: "#1F7ABE",
    padding: "5px 20px 7px",
    color: "white",
    alignItems: "baseline",
    fontSize: "18px",
    lineHeight: "32px",
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
    color: "white",
    fontSize: 23,
});

const LogoText = glamurous.span({
    marginLeft: 10,
});

const Logo = glamurous.div({});

const Container = glamurous.div({
    backgroundColor: "#fee",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    height: "100%",
});
