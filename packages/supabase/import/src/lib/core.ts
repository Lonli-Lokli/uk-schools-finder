import { Database } from '@lonli-lokli/shapes';
import { SupabaseClient } from '@supabase/supabase-js';

function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, (i + 1) * size)
  );
}

export async function importInBatches<T>(
  items: T[],
  rpcName: keyof Database['public']['Functions'],
  paramName: string,
  db: SupabaseClient<Database>,
  onProgress: (imported: number) => void,
  batchSize = 5000
) {
  console.log('Importing in batches:', {
    rpcName,
    paramName,
    itemsLength: items.length,
    batchSize,
  });

  if (items.length <= batchSize) {
    const { error } = await db.rpc(rpcName, { [paramName]: items });
    if (error) throw error;
    onProgress(items.length);
    return;
  }

  const batches = chunk(items, batchSize);
  for (const batch of batches) {
    const { error } = await db.rpc(rpcName, { [paramName]: batch });
    if (error) throw error;
    onProgress(batch.length);
  }
}