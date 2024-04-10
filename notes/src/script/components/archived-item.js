import SportsApi from "../data/remote/notes-api.js";

class archivedItem extends HTMLElement {
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

      .fan-art-archived {
        width: 100%;
        max-height: 450px;
        object-fit: cover;
        object-position: center;
      }

      .archived-info {
        padding: 16px 24px;
        background-color: rgb(0, 34, 77);
        color: white;
        margin-bottom: 10px;
      }

      .archived-info__title h2 {
        font-weight: lighter;
      }

      .archived-info__description p {
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

      .unarchive-button {
          background-color: #4b7cff;
          
          padding: 8px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          margin-top: 10px;
      }

      .archive-button:hover {
        background-color: #3259a8;
      }
      @media only screen and (max-width: 600px) {
        .fan-art-archived {
          max-height: 300px;
        }
      }
    `;
  }

  _addUnarchiveButton() {
    const unarchiveButton = document.createElement("button");
    unarchiveButton.classList.add("unarchive-button");
    unarchiveButton.textContent = "Unarchive Note";
    unarchiveButton.addEventListener("click", () =>
      this._unarchiveButtonClicked(),
    );
    this._shadowRoot
      .querySelector(".archived-info")
      .appendChild(unarchiveButton);
  }

  _unarchiveButtonClicked() {
    const confirmation = confirm(
      "Are you sure you want to unarchive this note?",
    );
    if (confirmation) {
      SportsApi.unarchiveNote(this._note.id)
        .then(() => {
          this.remove();
        })
        .catch((error) => {
          console.error("Error unarchiving note:", error);
          alert("Failed to unarchive note. Please try again.");
        });
    }
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="archived-info">
          <div class="archived-info__title">
            <h2>${this._note.title}</h2>
          </div>
          <div class="archived-info__description">
            <p>${this._note.body}</p>
            <p>${this._note.createdAt}</p>
            <p>${this._note.archived}</p>
          </div>
        </div>
      </div>
    `;

    this._addUnarchiveButton();
  }
}

customElements.define("archived-item", archivedItem);
