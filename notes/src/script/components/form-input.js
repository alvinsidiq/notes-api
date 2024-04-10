class NotesInput extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });

    this._shadowRoot.innerHTML = `
      <style>
        /* Style your form here */
        :host {
          display: block;
        }

        form {
          background-color:rgb(172, 226, 225);
          padding: 40px;
          border-radius: 5px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        }

        .form-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          font-size: 1em;
          margin-bottom: 8px;
        }

        input,
        textarea {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          border: 0;
          padding: 10px 16px;
          background-color: rgb(247, 238, 221);
          color: black;
          cursor: pointer;
        }

        button:hover {
          background-color:rgb(247, 238, 221);
        }

        button:active {
          background-color: rgb(0, 141, 218);
        }

        .confirmation-popup {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .confirmation-popup p {
          margin: 0;
        }

        .confirmation-popup button {
          margin-top: 10px;
        }
        .create-note {
          color: rgb(5, 5, 5);
        }
        #loadingIndicator {
          display: none;
          color: #333;
          font-size: 16px;
          margin-top: 10px;
        }
        .loading-indicator {
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .loading-indicator::after {
          content: '';
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid #FBA834;
          border-top: 4px solid transparent;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>

      <form id="noteForm" class="note-form">
        <center>
          <h3 class="create-note">CREATE NOTE</h3>
        </center>
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>

        <div class="form-group">
          <label for="body">Note Body</label>
          <textarea id="body" name="body" rows="4" required></textarea>
        </div>

        <!-- Loading Indicator -->
        <div id="loadingIndicator" class="loading-indicator"></div>

        <button type="submit">Add Note</button>
      </form>

      <div id="confirmationPopup" class="confirmation-popup">
        <p>Note added successfully!</p>
        <button id="confirmButton">OK</button>
      </div>
    `;

    this._formElement = this._shadowRoot.querySelector("#noteForm");
    this._confirmationPopup =
      this._shadowRoot.querySelector("#confirmationPopup");
    this._confirmButton = this._shadowRoot.querySelector("#confirmButton");
    this._loadingIndicator =
      this._shadowRoot.querySelector("#loadingIndicator");
  }

  connectedCallback() {
    this._formElement.addEventListener("submit", this._onSubmit.bind(this));
    this._confirmButton.addEventListener(
      "click",
      this._closeConfirmation.bind(this),
    );
  }

  disconnectedCallback() {
    this._formElement.removeEventListener("submit", this._onSubmit.bind(this));
    this._confirmButton.removeEventListener(
      "click",
      this._closeConfirmation.bind(this),
    );
  }

  _onSubmit(event) {
    event.preventDefault();

    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");

    if (!titleInput.value || !bodyInput.value) {
      alert("Both title and body must be filled!");
      return;
    }

    const eventDetail = {
      title: titleInput.value,
      body: bodyInput.value,
    };

    this._loadingIndicator.style.display = "block";
    this.dispatchEvent(new CustomEvent("submit", { detail: eventDetail }));

    setTimeout(() => {
      this._loadingIndicator.style.display = "none";
    }, 1000);

    titleInput.value = "";
    bodyInput.value = "";
  }

  _showConfirmation() {
    this._confirmationPopup.style.display = "block";
  }

  _closeConfirmation() {
    this._confirmationPopup.style.display = "none";
  }
}

customElements.define("form-input", NotesInput);
