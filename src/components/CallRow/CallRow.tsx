import './CallRow.css'
import { Down } from '../../assets/Vector';
import { Up } from '../../assets/Vector1';
import { PlayingAudio } from '../PlayingAudio/PlayingAudio';
import { useState } from 'react';
import { Call } from '../../App';

interface CallRowProps {
  call: Call;
}

export const CallRow: React.FC<CallRowProps> = ({call}) => {
    const [openPlayer, setOpenPlayer] = useState(false);

    const handleRowClick = () => {
      setOpenPlayer(prev => !prev);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getInitials = (name: string, surname: string) => {
        const nameInitial = name ? name[0].toUpperCase() : '';
        const surnameInitial = surname ? surname[0].toUpperCase() : '';
        return `${nameInitial}${surnameInitial}`;
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const getRandomRating = () => {
        const ratings = ["Плохо", "Хорошо", "Отлично"];
        return ratings[Math.floor(Math.random() * ratings.length)];
      };

    const errorsOrRating = call.errors?.length === 0 ? getRandomRating() : call.errors;

    const ratingClass = errorsOrRating === "Плохо"
    ? "ratingBad"
    : errorsOrRating === "Хорошо"
    ? "ratingGood"
    : errorsOrRating === "Отлично"
    ? "ratingExcellent"
    : "tableTextEstimate"

    return (
      <tr key={call.id} className='tableRow' onClick={handleRowClick}>
        <td className='tableText inOut'>
          {call.in_out === 0 ? <span><Down /></span> : <span><Up /></span>}
        </td>
        <td className='tableText'>{formatTime(call.date)}</td>
        <td className='tableText'>
          {call.person_avatar ? (
            <img src={call.person_avatar} alt="Avatar" className="avatarImage" />
          ) : (
            <div className="initialsCircle">
              {getInitials(call.person_name, call.person_surname)}
            </div>
          )}
        </td>
        <td className='tableText'>
            <div className='tableTextContact'>
                <p className='tableTextContactName'>{call.contact_name}</p> 
                <p className={call.contact_name ? `tableTextContactCompany` : `tableTextContactName`}>{call.from_number}</p> 
                <p className='tableTextContactCompany'>{call.contact_company}</p>
            </div>
        </td>
        <td className='tableText tableTextContactCompany'>{call.source}</td>
        <td className={'tableText'}>
          <div className={`${ratingClass}`}>{errorsOrRating}</div>
        </td>
        <td colSpan={2} className='tableText'>
          <div className='tableTextAudio'>
          {call.time !== 0 && openPlayer ? (
            <PlayingAudio call={call} time={formatDuration(call.time)} />
          ) : (
            formatDuration(call.time)
          )}
          </div>
        </td>
      </tr>
    );
  }