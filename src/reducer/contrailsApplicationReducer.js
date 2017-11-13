// @flow
export type ApplicationState = {
    viewPort?: { from: number, to: number },
};

type Actions = {
    type: "ChangeViewPort",
    viewPort: { from: number, to: number },
};

export default function contrailsApplicationReducer(state: ApplicationState = {}, action: Actions): ApplicationState {
    if (action.type === "ChangeViewPort") {
        return {
            ...state,
            viewPort: action.viewPort,
        };
    }
    return state;
}
