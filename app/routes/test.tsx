import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

export async function loader({}: LoaderFunctionArgs) {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export default function Index() {
  const { env } = useLoaderData<typeof loader>();
  const supabase = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: fetchedData, error: fetchError } = await supabase
          .from('departments') // Replace with your table name
          .select('*')
          .limit(10); // Adjust limit as needed

        if (fetchError) {
          throw fetchError;
        }

        setData(fetchedData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Data</h1>
      
      {data.length === 0 ? (
        <p>No data found</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.id} className="p-2 border rounded">
              <pre>{item.name}</pre>
            </li>
          ))}
        </ul>
      )}

      {/* Example of real-time subscription */}
      {/* <RealtimeUpdates supabase={supabase} /> */}
    </div>
  );
}

// function RealtimeUpdates({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }) {
//   const [updates, setUpdates] = useState<any[]>([]);

//   useEffect(() => {
//     const channel = supabase
//       .channel('realtime_updates')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'departments', // Replace with your table name
//         },
//         (payload: any) => {
//           setUpdates((prev) => [...prev, payload]);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [supabase]);

//   if (updates.length === 0) {
//     return null;
//   }

//   return (
//     <div className="mt-8 p-4 bg-gray-100 rounded">
//       <h2 className="text-xl font-semibold mb-2">Realtime Updates</h2>
//       <ul className="space-y-2">
//         {updates.map((update, index) => (
//           <li key={index} className="p-2 bg-white rounded shadow">
//             <pre className="text-sm">{JSON.stringify(update, null, 2)}</pre>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
//}