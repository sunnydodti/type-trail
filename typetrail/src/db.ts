import Dexie, { type Table } from 'dexie'

export interface Stat {
	id?: number
	mode: string
	date: Date
	correct: number
	wrong: number
	streak: number
}

export interface Setting {
	key: string
	value: unknown
}

export interface WordItem {
	id?: number
	word: string
}

export interface SentenceItem {
	id?: number
	sentence: string

}

export interface TypeTrailDB extends Dexie {
	stats: Table<Stat, number>;
	settings: Table<Setting, string>;
	wordsList: Table<WordItem, number>;
	sentencesList: Table<SentenceItem, number>;
}

export const db = new Dexie('TypeTrailDB') as TypeTrailDB;

db.version(1).stores({
	stats: '++id,mode,date,correct,wrong,streak',
	settings: 'key,value',
	wordsList: '++id,word',
	sentencesList: '++id,sentence',
});

