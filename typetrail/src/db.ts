import Dexie from 'dexie'

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
	value: any
}

export interface WordItem {
	id?: number
	word: string
}

export interface SentenceItem {
	id?: number
	sentence: string

}
export const db = new Dexie('TypeTrailDB')

db.version(1).stores({
	stats: '++id,mode,date,correct,wrong,streak',
	settings: 'key,value',
	wordsList: '++id,word',
	sentencesList: '++id,sentence',
})
