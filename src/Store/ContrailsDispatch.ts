import { ThunkDispatch } from "redux-thunk";

import { IContrailsApi } from "../Domain/IContrailsApi";

import { Actions } from "./ContrailsApplicationActions";
import { ContrailsApplicationState } from "./ContrailsApplicationState";

export type ContrailsDispatch = ThunkDispatch<ContrailsApplicationState, { api: IContrailsApi }, Actions>;
