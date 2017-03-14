// @flow
import type { Action, IntlState } from '../types';
import { Observable } from 'rxjs/Observable';
import { loadLocale } from '../../browser/intl';

const LOAD_LOCALE = 'este/intl/LOAD_LOCALE';
const SET_LOCALE = 'este/intl/SET_LOCALE';

const initialState = {
  currentLocale: null,
  defaultLocale: null,
  initialNow: null,
  locales: null,
  messages: null,
};

export const setCurrentLocale = (locale: string): Action => ({
  type: LOAD_LOCALE,
  payload: { locale },
});

export const applyCurrentLocale = (locale: string, messages: Object): Action => ({
  type: SET_LOCALE,
  payload: { locale, messages },
});

const applyLocale = (action$: any) =>
  action$.ofType(LOAD_LOCALE)
    .mergeMap(({ payload: { locale } }) =>
      // $FlowFixMe call of method `from` property `@@iterator` of $Iterable. Property not found in.
      Observable.from(loadLocale(locale))
        .map(messages => applyCurrentLocale(locale, messages)));

const reducer = (
  state: IntlState = initialState,
  action?: Action,
): IntlState => {
  // Because it's called from the createInitialState.
  if (!action) return state;

  switch (action.type) {
    case SET_LOCALE: {
      const currentLocale = action.payload.locale;
      return {
        ...state,
        currentLocale,
        messages: {
          [currentLocale]: action.payload.messages || {},
        },
      };
    }

    default:
      return state;

  }
};

export default reducer;

export const epics = [
  applyLocale,
];
