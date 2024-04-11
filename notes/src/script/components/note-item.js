import NotesApi from "../data/remote/notes-api.js";
import { showNote, showNotearchivedNotes } from "../view/home.js";
class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(value) {
    this._note = value;

    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;
      }

      .fan-art-note {
        width: 100%;
        max-height: 450px;
        object-fit: cover;
        object-position: center;
      }

      .note-info {
        padding: 16px 24px;
        background-color:rgb(172, 226, 225);
      }

      .note-info__title h2 {
        font-weight: lighter;
      }

      .note-info__description p {
        display: -webkit-box;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
      }

      .delete-button {
        background-color: #ff4b4b;
        color: white;
        padding: 8px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        margin-top: 10px;
        margin-top: 10px; 
        margin-right: 5px; 
        margin-bottom: 10px; 
        margin-left: 5px; 
          }

      .delete-button:hover {
        background-color: #e64040;
      }

      .archive-button {
        background-color: #4b7cff;
        color: white;
        padding: 8px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        margin-top: 10px;
      }

      .archive-button:hover {
        background-color: #3259a8;
      }
    `;
  }

  _addDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete Note";
    deleteButton.addEventListener("click", () => this._deleteButtonClicked());
    this._shadowRoot.querySelector(".note-info").appendChild(deleteButton);
  }

  _deleteButtonClicked() {
    const confirmation = confirm("Are you sure you want to delete this note?");

    if (confirmation) {
      NotesApi.deleteNote(this._note.id)
        .then(() => {
          this.remove();
          showNote();
          showNotearchivedNotes();
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
          alert("Failed to delete note. Please try again.");
        });
    }
  }

  _addArchiveButton() {
    if (!this._note.archived) {
      const archiveButton = document.createElement("button");
      archiveButton.classList.add("archive-button");
      archiveButton.textContent = "Archive Note";
      archiveButton.addEventListener("click", () =>
        this._archiveButtonClicked(),
      );
      this._shadowRoot.querySelector(".note-info").appendChild(archiveButton);
    }
  }

  _archiveButtonClicked() {
    const confirmation = confirm("Are you sure you want to archive this note?");

    if (confirmation) {
      NotesApi.archiveNote(this._note.id)
        .then(() => {
          this.remove();
          showNote();
          
        })
        .catch((error) => {
          console.error("Error archiving note:", error);
          alert("Failed to archive note. Please try again.");
        });
    }
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="note-info">
          <div class="note-info__title">
            <h2>${this._note.title}</h2>
          </div>
          <div class="note-info__description">
            <p>${this._note.body}</p>
            <p>${this._note.createdAt}</p>
            <p>${this._note.archived}</p>
          </div>
        </div>
      </div>
    `;

    this._addDeleteButton();
    this._addArchiveButton();
  }
}

customElements.define("note-item", NoteItem);
