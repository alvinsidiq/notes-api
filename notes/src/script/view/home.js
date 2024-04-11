import Utils from "../utils.js";
import NotesApi from "../data/remote/notes-api.js";


  const noteListContainerElement = document.querySelector("#ListContainer");
  const noteQueryWaitingElement =
    noteListContainerElement.querySelector(".query-waiting");
  const noteLoadingElement =
    noteListContainerElement.querySelector(".search-loading");
  const noteListElement = noteListContainerElement.querySelector("note-list");

  const noteArchivedListContainerElement = document.querySelector(
    "#ArchivedListContainer",
  );
  const notearchivedListElement =
    noteArchivedListContainerElement.querySelector("archived-list");


  //handler buat tambah note
  const onAddNoteHandler = (event) => {
    const { title, body } = event.detail;

    const newNote = {
      title,
      body,
    };

    NotesApi.createNote(newNote.title, newNote.body)
      .then((createdNote) => {
        console.log("Note created successfully:", createdNote);
        showNote();
        showNotearchivedNotes();
      })
      .catch((error) => {
        console.error("Error creating note:", error);
      });
  };

  document
    .querySelector("form-input")
    .addEventListener("submit", onAddNoteHandler);

  // menampilkan data notes
  export const showNote = (query) => {
    showLoading();
    NotesApi.getNotes(query)
      .then((result) => {
        displayResult(result);
        showNoteList();
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

 export  const showNotearchivedNotes = () => {
    showLoading();
    NotesApi.getArchivedNotes()
      .then((result) => {
        displayNotearchivedResult(result);
        showNotearchivedList();
      })
      .catch((error) => {
        console.error("Error fetching notearchived notes:", error);
      });
  };

  // untuk menangani hapus data note
  const onDeleteNoteHandler = (event) => {
    const noteId = event.detail.noteId;
    NotesApi.deleteNote(noteId)
      .then(() => {
        const noteItem = document.querySelector(
          `note-item[data-id="${noteId}"]`,
        );
        const archivedItem = document.querySelector(
          `archived-item[data-id="${noteId}"]`,
        );

        if (noteItem) {
          noteItem.remove();
        }

        if (archivedItem) {
          archivedItem.remove();
        }
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        alert("Failed to delete note. Please try again.");
      });
  };


  // untuk unarchive note
  const onUnarchiveNoteHandler = (event) => {
    const noteId = event.detail.noteId;
    NotesApi.unarchiveNote(noteId)
      .then(() => {
        const archivedItem = document.querySelector(
          `archived-item[data-id="${noteId}"]`,
        );
        if (archivedItem) {
          archivedItem.remove();
          showNotearchivedNotes();
        }
      })
      .catch((error) => {
        console.error("Error unarchiving note:", error);
        alert("Failed to unarchive note. Please try again.");
      });
  };

  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.note = note;
      noteItemElement.addEventListener("deleteNote", onDeleteNoteHandler);

      return noteItemElement;
    });

    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const displayNotearchivedResult = (notearchivedNotes) => {
    const archivedItemElements = notearchivedNotes.map(
      (notearchivedNote) => {
        const archivedItemElement =
          document.createElement("archived-item");
        archivedItemElement.note = notearchivedNote;
        archivedItemElement.addEventListener(
          "unarchiveNote",
          onUnarchiveNoteHandler,
        );

        return archivedItemElement;
      },
    );

    Utils.emptyElement(notearchivedListElement);
    notearchivedListElement.append(...archivedItemElements);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  const showNotearchivedList = () => {
    Array.from(noteArchivedListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(notearchivedListElement);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showQueryWaiting = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteQueryWaitingElement);
  };

  showQueryWaiting();
  showNotearchivedNotes();
  showNote();



