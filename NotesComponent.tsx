import React, { useState, useEffect } from 'react';

// Définir le type Note pour correspondre au schéma de la base de données
interface Note {
    id: string;
    text: string;
    createdAt: number;
}

export function NotesComponent() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            const allNotes = await window.electronAPI.db.select('notes', {
                orderBy: { key: 'createdAt', direction: 'desc' },
            });
            setNotes(allNotes);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch notes:", err);
            setError('Impossible de charger les notes.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteText.trim()) return;

        try {
            const noteToInsert = {
                text: newNoteText,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
            }
            await window.electronAPI.db.insert('notes', noteToInsert);
            setNewNoteText('');
            fetchNotes(); // Re-fetch notes to update the list
        } catch (err) {
            console.error("Failed to add note:", err);
            setError("Impossible d'ajouter la note.");
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await window.electronAPI.db.delete('notes', id);
            fetchNotes(); // Re-fetch notes
        } catch (err) {
            console.error("Failed to delete note:", err);
            setError('Impossible de supprimer la note.');
        }
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Mes Notes</h2>

            <form onSubmit={handleAddNote} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Écrire une nouvelle note..."
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <button type="submit">Ajouter</button>
            </form>

            {isLoading && <p>Chargement des notes...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {notes.map((note) => (
                    <li key={note.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{note.text}</span>
                        <button onClick={() => handleDeleteNote(note.id)} style={{ color: 'red' }}>X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}