import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';
import axios from 'axios';

const TreatmentDetail = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await axios.get(`/treatments/${id}`);
        setTreatment(response.data);
      } catch (error) {
        setError('Failed to load treatment details.');
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await axios.get(`/treatments/${id}/providers`);
        setProviders(response.data);
      } catch (error) {
        setError('Failed to load providers.');
      }
    };

    fetchTreatment();
    fetchProviders();
  }, [id]);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <p className="text-red-600">{error}</p>;
  if (!treatment) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{treatment.name}</h1>
      <p className="mb-6 text-gray-700">{treatment.description}</p>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold">Available Providers</h2>
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {filteredProviders.length > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            {filteredProviders.length} provider{filteredProviders.length > 1 ? 's' : ''} found for this treatment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </>
      ) : (
        <p>No providers match your search.</p>
      )}
    </div>
  );
};

export default TreatmentDetail;