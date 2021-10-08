import { setNoteList, SET_NOTE, SET_NOTE_LIST } from "../actions/note";

export interface INote {
  id: number;
  title: string;
  createdBy?: string;
  lastModified?: number;
  tags: string[];
  text: string;
}

const initialNoteState: INote = {
  id: 0,
  title: "",
  createdBy: "",
  lastModified: undefined,
  tags: [],
  text: "",
}

const initialState: { currentNote?: INote; noteList: INote[], noteIndex?: number } = {
  currentNote: undefined,
  noteList: [],
  noteIndex: undefined,
};

const noteReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_NOTE: {
      return {
        ...state,
        currentNote: {...state.currentNote, ...action.payload},
      };
    }
    case SET_NOTE_LIST: {
      return {
        ...state,
        noteList: [...state.noteList, ...action.payload],
      };
    }
    default: {
      return state;
    }
  }
};

export default noteReducer;
