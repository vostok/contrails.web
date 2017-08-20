// @flow
import { createApiProvider, createWithApiWrapper } from "commons/ApiInjection";
import type { ApiProviderBase } from "commons/ApiInjection";

import type { IContrailsApi } from "./IContrailsApi";

type ApiProps = { contrailsApi: IContrailsApi };

const ApiProvider: ApiProviderBase<ApiProps> = createApiProvider(["contrailsApi"]);
export { ApiProvider };

const withContrailsApi = createWithApiWrapper("contrailsApi", (null: ?ApiProps));
export { withContrailsApi };
