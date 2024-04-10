import Utils from "../utils.js";

class archivedList extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _padding = 5;
  _gutter = 16;

  static get observedAttributes() {
    return ["padding", "gutter"];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }
      
      .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
       padding: ${this.padding}px;
        gap: ${this.gutter}px;
      }
    `;
  }

  set padding(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;

    this._padding = value;
  }

  get padding() {
    return this._padding;
  }

  set gutter(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;

    this._gutter = value;
  }

  get gutter() {
    return this._gutter;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="list">
        <slot></slot>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "padding":
        this.column = newValue;
        break;
      case "gutter":
        this.gutter = newValue;
        break;
    }

    this.render();
  }
}

customElements.define("archived-list", archivedList);
