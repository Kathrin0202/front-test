import { useEffect, useState } from 'react';
import { ArrowDown } from '../../assets/ArrowDown';
import { CallRow } from '../CallRow/CallRow';
import './ContainerCall.css'
import { ArrowUp } from '../../assets/ArrowUp';
import { Call } from '../../App';

interface ContainerCallProps {
  callList: Call[];
}
type CallKeys = keyof Call;

export const ContainerCall: React.FC<ContainerCallProps> = ({callList}) => {
    const [sortedCalls, setSortedCalls] = useState(callList);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  
    const sortData = (key: CallKeys, direction: 'ascending' | 'descending' | string) => {
      const sorted = [...callList].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return direction === 'ascending' ? 1 : -1;
        if (bValue === undefined) return direction === 'ascending' ? -1 : 1;
    
        if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
      setSortedCalls(sorted);
    };
    
      const handleSort = (key: CallKeys) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortData(key, direction);
      };

      useEffect(() => {
        setSortedCalls(callList);
      }, [callList]);

      const groupCallsByDate = (calls: Call[]) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const grouped: {
          today: Call[];
          yesterday: Call[];
          older: Call[];
      } = {
          today: [],
          yesterday: [],
          older: []
      };

      calls.forEach(call => {
          const callDate = call.date_notime.split('T')[0];
          if (callDate === today) {
              grouped.today.push(call);
          } else if (callDate === yesterday) {
              grouped.yesterday.push(call);
          } else {
              grouped.older.push(call);
          }
      });

      return grouped;
  };

    const groupedCalls = groupCallsByDate(sortedCalls);

    return (
      <table>
        <thead>
            <tr>
                <th className='headerTable inOut'>Тип</th>
                <th className='headerTable'>
                <div className="headerContent" onClick={() => handleSort('date')}>
                   Время {sortConfig?.key === 'date' && sortConfig.direction === 'descending' ? (
                   <ArrowDown width="18px" height="21px" />
                   ) : (
                   <ArrowUp width="18px" height="21px" />
                   )}
                </div>
                </th>
                <th className='headerTable'>Сотрудник</th>
                <th className='headerTable'>Звонок</th>
                <th className='headerTable'>Источник</th>
                <th className='headerTable'>Оценка</th>
                <th className='headerTable'></th>
                <th className='headerTable'>
                <div className="headerContent" onClick={() => handleSort('time')}>
                    Длительность {sortConfig?.key === 'time' && sortConfig.direction === 'descending' ? (
                    <ArrowDown width="18px" height="21px" />
                    ) : (
                    <ArrowUp width="18px" height="21px" />
                    )}
                </div>
                </th>
            </tr>
        </thead>
        <tbody>
                   {groupedCalls.today.length > 0 && (
                        <>
                            {groupedCalls.today.map((call: Call) => (
                                <CallRow key={call.id} call={call} />
                            ))}
                        </>
                    )}

                    {groupedCalls.yesterday.length > 0 && (
                        <>
                            <tr>
                              <td colSpan={8} className='groupedCalls'><strong className='groupedCallsText'>Вчера <span className="upperIndex">{groupedCalls.yesterday.length}</span></strong></td>
                            </tr>
                            {groupedCalls.yesterday.map((call: Call) => (
                                <CallRow key={call.id} call={call} />
                            ))}
                        </>
                    )}

                    {groupedCalls.older.length > 0 && (
                        <>
                            <tr>
                              <td colSpan={8} className='groupedCalls'><strong className='groupedCallsText'>Старые звонки</strong></td>
                            </tr>
                            {groupedCalls.older.map((call: Call) => (
                                <CallRow key={call.id} call={call} />
                            ))}
                        </>
                    )}
        </tbody>
     </table>
    )
}