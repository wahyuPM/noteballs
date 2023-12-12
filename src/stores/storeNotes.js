import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '@/js/firebase'

const notesCollectionRef = collection(db, "notes")

export const useStoreNotes = defineStore('storeNotes', {
    state: () => {
        return {
            notes: []
        }
    },
    actions: {
        async getNotes() {
            onSnapshot(notesCollectionRef, (querySnapshot) => {
                let notes = [];
                querySnapshot.forEach((doc) => {
                    let note = {
                        id: doc.id,
                        content: doc.data().content
                    }

                    notes.push(note)
                });
                this.notes = notes
            });
        },
        async addNote(newNoteContent) {
            let currentDate = new Date().getTime(),
                id = currentDate.toString()

            await setDoc(doc(notesCollectionRef, id), {
                content: newNoteContent
            });

        },
        async deleteNote(idToDelete) {
            await deleteDoc(doc(notesCollectionRef, idToDelete));
        },
        async updateNote(id, content) {
            await updateDoc(doc(notesCollectionRef, id), {
                content: content
            });
        }
    },
    getters: {
        getNoteContent: (state) => {
            return (id) => {
                return state.notes.filter(note => {
                    return note.id === id
                })[0].content
            }
        },
        totalNotesCount: (state) => {
            return state.notes.length
        },
        totalCharacterCount: (state) => {
            let count = 0
            state.notes.forEach(note => {
                count += note.content.length
            })

            return count
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStoreNotes, import.meta.hot))
}