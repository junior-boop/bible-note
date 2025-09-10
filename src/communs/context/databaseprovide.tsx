import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useMemo
} from 'react';
import { Notes, usersession } from '../../lib/database/db';
import { QueryBuilder } from './QueryBuilder';

// Définition d'un type pour les erreurs de base de données
type DatabaseError = {
    message: string;
    code: string;
    details?: unknown;
};

// Interface améliorée avec gestion d'erreurs
interface DatabaseContextType {
    notesQuery: QueryBuilder<Notes> | null;
    session: usersession | null;
    isLoading: boolean;
    error: DatabaseError | null;
    addNote: (noteData: Partial<Notes>) => Promise<void>;
    updateNote: (noteData: Notes) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    toggleNotePinned: (note: Notes) => Promise<void>;
    toggleNoteArchived: (note: Notes) => Promise<void>;
    clearError: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
    const [notesQuery, setNotes] = useState<QueryBuilder<Notes> | null>(null);
    const [session, setSession] = useState<usersession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<DatabaseError | null>(null);


    const handleError = useCallback((error: unknown, operation: string) => {
        const dbError: DatabaseError = {
            message: `Error during ${operation}`,
            code: 'DB_ERROR',
            details: error
        };
        setError(dbError);
        console.error(`Database error during ${operation}:`, error);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Modifier loadInitialData
    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        clearError();
        try {
            const [notesResult, sessionResult] = await Promise.all([
                window.api.db.getnotes(),
                window.api.db.getsession()
            ]);
            const notesArray = new QueryBuilder<Notes>(notesResult || []);
            setNotes(notesArray);
            setSession(sessionResult || null);
        } catch (error) {
            handleError(error, 'initial data loading');
        } finally {
            setIsLoading(false);
        }
    }, [handleError, clearError]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const addNote = useCallback(async (noteData: Notes) => {
        clearError();
        try {
            await window.api.db.setnote(noteData);
            loadInitialData();
        } catch (error) {
            handleError(error, 'adding note');
        }
    }, [handleError, clearError, loadInitialData]);

    const updateNote = useCallback(async (noteData: { id: string, body: string }) => {
        clearError();
        try {
            const updatedNote = await window.api.db.modifynoteid(noteData);
            notesQuery?.update(noteData.id, { body: noteData.body, modified: updatedNote?.modified });
            loadInitialData();
        } catch (error) {
            handleError(error, 'updating note');
        }
    }, [handleError, clearError, loadInitialData]);

    // Modifier deleteNote
    const deleteNote = useCallback(async (id: string) => {
        clearError();
        try {
            await window.api.db.deletenote(id);
            loadInitialData();
        } catch (error) {
            handleError(error, 'deleting note');
        }
    }, [handleError, clearError, loadInitialData]);

    // Modifier toggleNotePinned
    const toggleNotePinned = useCallback(async (note: Notes) => {
        console.log("Toggling pin for note:", note);
        try {
            const updatedNote = { ...note, pinned: note.pinned };
            await window.api.db.setnotespinned(updatedNote);
            loadInitialData();
        } catch (error) {
            handleError(error, 'toggling note pin status');
        }
    }, [loadInitialData]);

    // Modifier toggleNoteArchived
    const toggleNoteArchived = useCallback(async (note: Notes) => {
        clearError();
        try {
            const updatedNote = { ...note, archived: note.archived };
            await window.api.db.setnotesarchived(updatedNote);
            loadInitialData();
        } catch (error) {
            handleError(error, 'toggling note archive status');
        }
    }, [handleError, clearError, loadInitialData]);

    // Optimisation avec useMemo pour la valeur du contexte
    const contextValue = useMemo(() => ({
        notesQuery,
        session,
        isLoading,
        error,
        addNote,
        updateNote,
        deleteNote,
        toggleNotePinned,
        toggleNoteArchived,
        clearError
    }), [
        notesQuery,
        session,
        isLoading,
        error,
        addNote,
        updateNote,
        deleteNote,
        toggleNotePinned,
        toggleNoteArchived,
        clearError
    ]);

    return (
        <DatabaseContext.Provider value={contextValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (context === undefined) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
};