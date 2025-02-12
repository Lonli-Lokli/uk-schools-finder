import { supabaseDataAccess } from './supabase-data-access';

describe('supabaseDataAccess', () => {
  it('should work', () => {
    expect(supabaseDataAccess()).toEqual('supabase-data-access');
  });
});
