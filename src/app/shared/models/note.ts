export type NoteType = 'acronym' | 'concept' | 'definition' | 'tip' | 'pattern';

export interface Note {
    id: string;
    title: string;
    type: NoteType;
    content: string;
    tags: string[];
    related: string[];
    createdAt: string;
    updatedAt: string;
    sources: string[];
}