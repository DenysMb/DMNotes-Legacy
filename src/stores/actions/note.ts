import { INote } from "../reducers/note";

export const SET_NOTE = "set_note";
export const SET_NOTE_LIST = "set_note_list";

export const setNote = (payload: INote) => ({
  type: SET_NOTE,
  payload,
});

export const setNoteList = (payload: INote[]) => ({
  type: SET_NOTE_LIST,
  payload,
});
