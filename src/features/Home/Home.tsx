import React, { useEffect, useMemo, useState } from "react";
import {
  faBook,
  faChevronDown,
  faChevronRight,
  faEllipsisH,
  faPlus,
  faSearch,
  faSignOutAlt,
  faStar,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Styles from "./Home.module.scss";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toolbarOptions } from "../../shared/utils";
import { INote } from "../../stores/reducers/note";
import { useDispatch, useSelector } from "react-redux";
import { setNote } from "../../stores/actions/note";
import { RootState } from "../../stores";

const Home = () => {
  return (
    <div className={Styles.HomeContainer}>
      <SideBar />
      <NoteList />
      <EditorContainer />
    </div>
  );
};

const EditorContainer = () => {
  const note = useSelector((s: RootState) => s.note);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const dispatch = useDispatch();
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const lastModified = useMemo(() => {
    return new Date(note.currentNote.lastModified);
  }, [note.currentNote.lastModified]);

  useEffect(() => {
    console.log("Note", note);
  }, [note]);

  useEffect(() => {
    const now = new Date();

    const newNote = {
      title,
      lastModified: now.getTime(),
      tags,
      text: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };

    dispatch(setNote(newNote));
  }, [title, tags, editorState]);

  return note.currentNote.createdBy ? (
    <div className={Styles.EditorContainer}>
      <div className={Styles.EditorContainerHeader}>
        <div className={Styles.EditorContainerHeaderBreadcrumb}>
          <p>My Notes</p>
          <FontAwesomeIcon icon={faChevronRight} />
          <p>{note.currentNote.title}</p>
        </div>
        <div className={Styles.EditorContainerHeaderIcon}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </div>
      </div>

      <div className={Styles.EditorContainerInfo}>
        <input
          className={Styles.EditorContainerInfoTitle}
          onChange={(el) => {
            setTitle(el.target.value);
          }}
          placeholder="Sem título"
        />

        <div className={Styles.EditorContainerInfoLine}>
          <div className={Styles.EditorContainerInfoLineLabel}>Created by</div>
          <div className={Styles.EditorContainerInfoLineValue}>
            {note.currentNote.createdBy}
          </div>
        </div>

        <div className={Styles.EditorContainerInfoLine}>
          <div className={Styles.EditorContainerInfoLineLabel}>
            Last modified
          </div>
          <div className={Styles.EditorContainerInfoLineValue}>
            {lastModified?.toLocaleString("pt-br", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className={Styles.EditorContainerInfoLine}>
          <div className={Styles.EditorContainerInfoLineLabel}>Tags</div>
          <div className={Styles.EditorContainerInfoLineValue}>
            {tags.map((tag: string, index: number) => (
              <Tag key={"Editor-Tag-" + index} label={tag} active />
            ))}
            <div
              className={`${Styles.Tag} ${Styles.TagActive}`}
              onClick={() => {
                setTags([...tags, "Novo"]);
              }}
            >
              <div className={Styles.TagIcon}>
                <FontAwesomeIcon icon={faPlus} />
              </div>
              Add new tag
            </div>
          </div>
        </div>
      </div>

      <div className={Styles.EditorContainerEditor}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName={Styles.EditorContainerEditorWrapper}
          editorClassName={Styles.EditorContainerEditorEditor}
          toolbarClassName={Styles.EditorContainerEditorToolbar}
          toolbar={toolbarOptions}
        />
      </div>
    </div>
  ) : (
    <div className={`${Styles.EditorContainer} ${Styles.EditorContainerNull}`}>
      Selecione uma anotação ao lado ou crie uma nova.
    </div>
  );
};

const Tag = ({ label, active }: { label: string; active?: boolean }) => {
  return (
    <div className={`${Styles.Tag} ${active ? Styles.TagActive : ""}`}>
      {label}
    </div>
  );
};

const Note = ({
  active,
  data,
  onClick,
}: {
  active?: boolean;
  data: INote;
  onClick: () => void;
}) => {
  const now = data?.lastModified ? new Date(data.lastModified) : null;

  return (
    <div
      className={`${Styles.Note} ${active ? Styles.NoteActive : ""}`}
      onClick={onClick}
    >
      <div
        className={`${Styles.NoteDate} ${active ? Styles.NoteDateActive : ""}`}
      >
        {now?.toLocaleString("pt-br", { day: "2-digit", month: "short" })}
      </div>

      <div
        className={`${Styles.NoteTitle} ${
          active ? Styles.NoteTitleActive : ""
        }`}
      >
        {data.title || "Sem título"}
      </div>

      <div
        className={`${Styles.NoteText} ${active ? Styles.NoteTextActive : ""}`}
      >
        {data.text.replace(/<[^>]*>/g, "")}
      </div>

      <div
        className={`${Styles.NoteTags} ${active ? Styles.NoteTagsActive : ""}`}
      >
        {data.tags.map((tag, index) => (
          <Tag key={"Tag-" + index} label={tag} active={active} />
        ))}
      </div>
    </div>
  );
};

const NoteList = () => {
  const note = useSelector((s: RootState) => s.note);
  const [noteList, setNotesList] = useState<INote[]>([]);
  const dispatch = useDispatch();

  const selectNote = (note: INote) => {
    dispatch(setNote(note));
  };

  const addNote = () => {
    const now = new Date().getTime();
    const newNote = {
      title: "",
      createdBy: "Denys Madureira",
      lastModified: now,
      tags: [],
      text: "",
    };

    setNotesList([...noteList, newNote]);

    selectNote(newNote);
  };

  return (
    <div className={Styles.NoteList}>
      <div className={Styles.NoteListTitle}>My Notes</div>

      <div className={Styles.NoteListAddButton} onClick={addNote}>
        <div className={Styles.NoteListAddButtonIcon}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className={Styles.NoteListAddButtonText}>Add new note</div>
      </div>

      <div className={Styles.NoteListNotes}>
        {noteList.map((noteeee, index) => (
          <Note
            key={"Note-" + index}
            data={note.currentNote}
            onClick={() => {
              selectNote(note.currentNote);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SideBar = () => {
  return (
    <div className={Styles.SideBar}>
      <div className={Styles.SideBarUser}>
        <div className={Styles.SideBarUserName}>Denys Madureira</div>
        <div className={Styles.SideBarUserIcon}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>

      <div className={Styles.SideBarSearch}>
        <div className={Styles.SideBarSearchIcon}>
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <input
          className={Styles.SideBarSearchInput}
          type="text"
          placeholder="Search notes..."
        />
      </div>

      <div className={Styles.SideBarListButtons}>
        <SideBarListButton title="My Notes" icon={faBook} active />
        <SideBarListButton title="Favorite Notes" icon={faStar} />
      </div>

      <div className={Styles.SideBarExit}>
        <div className={Styles.SideBarExitIcon}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
        <div className={Styles.SideBarExitText}>Exit</div>
      </div>
    </div>
  );
};

const SideBarListButton = ({
  title,
  icon,
  active,
}: {
  title: string;
  icon: IconDefinition;
  active?: boolean;
}) => {
  return (
    <div
      className={`${Styles.SideBarListButtonsButton} ${
        active ? Styles.SideBarListButtonsButtonActive : ""
      }`}
    >
      <div className={Styles.SideBarListButtonsButtonIcon}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className={Styles.SideBarListButtonsButtonText}>{title}</div>
      <div className={Styles.SideBarListButtonsButtonMore}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </div>
    </div>
  );
};

export default Home;
