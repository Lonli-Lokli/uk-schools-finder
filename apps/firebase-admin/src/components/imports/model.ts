import { createStore, createEvent } from 'effector';


export type DataSource = 'firebase' | 'supabase';

export const setDataSource = createEvent<DataSource>();

export const $dataSource = createStore<DataSource>('supabase')
  .on(setDataSource, (_, source) => source);