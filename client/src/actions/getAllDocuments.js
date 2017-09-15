import * as types from '../constants/actionTypes';

export const getDocuments = (documents) => ({
  type: types.GET_DOCUMENTS_SUCCESS,
  documents
});
