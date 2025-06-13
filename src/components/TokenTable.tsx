import { useEffect, useState } from 'react';

interface Token {
  id: string;
  token: string;
  browserType: string;
  browserVersion: string;
  createdAt: string;
}

const shortenId = (id: string | undefined) => {
  if (!id) return '';
  if (id.length <= 8) return id;
  return `${id.slice(0, 2)}...${id.slice(-2)}`;
};

export const TokenTable = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('/api/tokens');
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const data = await response.json();
        setTokens(data.tokens);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table className="w-full border-collapse border-2 border-white shadow-md">
      <thead>
        <tr className="bg-gray-100">
          <th className="border-2 border-white p-3 text-left font-semibold">ID</th>
          <th className="border-2 border-white p-3 text-left font-semibold">Created At</th>
          <th className="border-2 border-white p-3 text-left font-semibold">Browser</th>
          <th className="border-2 border-white p-3 text-left font-semibold">Version</th>
          <th className="border-2 border-white p-3 text-left font-semibold">Token</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, index) => (
          <tr key={token.id} className="hover:bg-gray-50">
            <td className="border-2 border-white p-3">{index + 1}</td>
            <td className="border-2 border-white p-3">{new Date(token.createdAt).toLocaleString()}</td>
            <td className="border-2 border-white p-3">{token.browserType}</td>
            <td className="border-2 border-white p-3">{token.browserVersion}</td>
            <td className="border-2 border-white p-3">{shortenId(token.token)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 