import { setLintingErrors } from "actions/lintingActions";
import {
  ReduxAction,
  ReduxActionTypes,
} from "ce/constants/ReduxActionConstants";
import { APP_MODE } from "entities/App";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { getAppMode } from "selectors/entitiesSelector";
import { TJSLibrary } from "utils/DynamicBindingUtils";
import { GracefulWorkerService } from "utils/WorkerUtil";
import { getUpdatedLocalUnEvalTreeAfterJSUpdates } from "workers/Evaluation/JSObject";
import {
  LintTreeRequest,
  LintTreeResponse,
  LintTreeSagaRequestData,
  LINT_WORKER_ACTIONS,
} from "workers/Linting/types";
import { logLatestLintPropertyErrors } from "./PostLintingSagas";

export const lintWorker = new GracefulWorkerService(
  new Worker(new URL("../workers/Linting/lint.worker.ts", import.meta.url), {
    type: "module",
    name: "lintWorker",
  }),
);

function* updateLintGlobals(action: ReduxAction<TJSLibrary>) {
  const appMode: APP_MODE = yield select(getAppMode);
  const isEditorMode = appMode === APP_MODE.EDIT;
  if (!isEditorMode) return;
  yield put(setLintingErrors({}));

  yield call(
    lintWorker.request,
    LINT_WORKER_ACTIONS.UPDATE_LINT_GLOBALS,
    action.payload,
  );
}

export function* lintTreeSaga(action: ReduxAction<LintTreeSagaRequestData>) {
  const { jsUpdates, pathsToLint, unevalTree } = action.payload;
  // only perform lint operations in edit mode
  const appMode: APP_MODE = yield select(getAppMode);
  if (appMode !== APP_MODE.EDIT) return;

  const updatedUnevalTree = getUpdatedLocalUnEvalTreeAfterJSUpdates(
    jsUpdates,
    unevalTree,
  );
  const lintTreeRequestData: LintTreeRequest = {
    jsUpdates,
    pathsToLint,
    unevalTree: updatedUnevalTree,
  };

  const { errors }: LintTreeResponse = yield call(
    lintWorker.request,
    LINT_WORKER_ACTIONS.LINT_TREE,
    lintTreeRequestData,
  );

  yield put(setLintingErrors(errors));
  yield call(logLatestLintPropertyErrors, { errors, dataTree: unevalTree });
}

export default function* lintTreeSagaWatcher() {
  yield takeEvery(ReduxActionTypes.UPDATE_LINT_GLOBALS, updateLintGlobals);
  yield takeEvery(ReduxActionTypes.LINT_TREE, lintTreeSaga);
}
