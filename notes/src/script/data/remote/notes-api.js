const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {

  // request ambil semua data notes
  static getNotes() {
    return fetch(`${BASE_URL}/notes`)
      .then((response) => {

        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Something went wrong`));
        }
      })
      .then((result) => {
        const data = result.data;
        console.log(data);
        if (data.length > 0) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(`TIDAK ADA NOTE!!!`));
        }
      });
  }

  // request menambahkan data note
  static createNote(title, body) {
    const data = new URLSearchParams();
    data.append("title", title);
    data.append("body", body);

    return fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(`Failed to create note`);
        }
      })
      .then((result) => result.data)
      .catch((error) => {
        console.error("Error creating note:", error);
        throw error;
      });
  }

  // request hapus data note
  static deleteNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(`Failed to delete note`);
        }
      })
      .then((result) => {
        console.log("Note deleted successfully:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        throw error;
      });
  }

  // request melakukan arsip note
  static archiveNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}/archive`, {
      method: "POST",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(`Failed to archive note`);
        }
      })
      .then((result) => {
        console.log("Note archived successfully:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error archiving note:", error);
        throw error;
      });
  }

  // request ambil data note yang diarsipkan
  static getArchivedNotes() {
    return fetch(`${BASE_URL}/notes/archived`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return Promise.reject(new Error(`Something went wrong`));
        }
      })
      .then((result) => {
        const data = result.data;
        console.log(data);
        if (data.length > 0) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(`No archived notes available`));
        }
      });
  }

  // request melakukan un arsip
  static unarchiveNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
      method: "POST",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error(`Failed to unarchive note`);
        }
      })
      .then((result) => {
        console.log("Note unarchived successfully:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error unarchiving note:", error);
        throw error;
      });
  }
  
}

export default NotesApi;
