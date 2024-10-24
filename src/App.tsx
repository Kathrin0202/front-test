import { useEffect, useState } from 'react'
import './App.css'
import { HeaderFilter } from './components/HeaderFilter/HeaderFilter'
import { ContainerCall } from './components/ContainerCall/ContainerCall'
import { fetchCallList } from './api';

export interface Call {
  id: number;
  in_out: number;
  date: string;
  person_name: string;
  person_surname: string;
  person_avatar?: string;
  from_number: string;
  contact_name?: string;
  contact_company?: string;
  source: string;
  errors?: string | undefined;
  time: number;
  record: number;
  partnership_id: number;
  date_notime: string;
}

function App() {
  const [callList, setCallList] = useState<Call[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  useEffect(() => {
    const fetchData = async () => {
        setError(null);

        const dateStart = dateRange.start ? dateRange.start.toISOString().split('T')[0] : '2024-09-01';
        const dateEnd = dateRange.end ? dateRange.end.toISOString().split('T')[0] : '2024-09-04';

        const inOut = '';

        const data = await fetchCallList(dateStart, dateEnd, inOut);

        if (data) {
            setCallList(data.results);
            setFilteredCalls(data.results);
        } else {
            setError(error);
        }
    };

    fetchData();
  }, [dateRange]);

  const handleFilterChange = (filter: string) => {
    if (filter === 'Исходящие') {
      setFilteredCalls(callList.filter(call => call.in_out === 0));
    } else if (filter === 'Входящие') {
      setFilteredCalls(callList.filter(call => call.in_out === 1));
    } else {
      setFilteredCalls(callList);
    }
  };

    return (
      <div className="container">
        <HeaderFilter onFilterChange={handleFilterChange} setDateRange={setDateRange} />
        <div className="containerBox">
          <ContainerCall callList={filteredCalls} />
        </div>
      </div>
    );
}
  
export default App;
