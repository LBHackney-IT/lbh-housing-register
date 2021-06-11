import { createAsyncThunk } from '@reduxjs/toolkit';
import { Application } from '../../domain/application';
export const loadApplicaiton = createAsyncThunk(
  'loadApplication',
  async (id: string) => {
    const r = await fetch(`/api/applications/${id}`);
    return (await r.json()) as Application;
  }
);
