import { useState } from 'react';
import './HeaderFilter.css'
import { Close } from '../../assets/Close';
import { ArrowDown } from '../../assets/ArrowDown';
import { ArrowUp } from '../../assets/ArrowUp';
import DatePicker from 'react-datepicker';
import { Calendar } from '../../assets/Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { ArrowRight } from '../../assets/ArrowRight';

interface DateRange {
    start: Date | undefined;
    end: Date | undefined;
  }

interface HeaderFilterProps {
    onFilterChange: (type: string) => void;
    setDateRange: (range: DateRange) => void;
  }
  

export const HeaderFilter = ({ onFilterChange, setDateRange }: HeaderFilterProps) => {
    const [selectedType, setSelectedType] = useState('Все типы');
    const [isOpen, setIsOpen] = useState(false);

    const [selectedDateRange, setSelectedDateRange] = useState('3 дня');
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const callTypeOptions = ['Все типы', 'Входящие', 'Исходящие'];
    const dateOptions = ['3 дня', 'Неделя', 'Месяц', 'Год', 'Указать даты'];

    const currentIndex = dateOptions.indexOf(selectedDateRange);

    const handleSelectType = (option: string) => {
        setSelectedType(option);
        onFilterChange(option);
        setIsOpen(false);
    };

    const handleReset = () => {
        setSelectedType('Все типы');
        onFilterChange('Все типы');
        setDateRange({ start: undefined, end: undefined });
    };

    const handleSelectDateRange = (option: string) => {
        setSelectedDateRange(option);
        setIsDateOpen(false);
    
        const today = new Date();
    
        if (option === '3 дня') {
          const start = new Date(today);
          start.setDate(today.getDate() - 2);
          setStartDate(start);
          setEndDate(today);
          setDateRange({ start, end: today });
        } else if (option === 'Неделя') {
          const start = new Date(today);
          start.setDate(today.getDate() - 6);
          setStartDate(start);
          setEndDate(today);
          setDateRange({ start, end: today });
        } else if (option === 'Месяц') {
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          setStartDate(start);
          setEndDate(end);
          setDateRange({ start, end });
        } else if (option === 'Год') {
          const start = new Date(today.getFullYear(), 0, 1);
          const end = new Date(today.getFullYear(), 11, 31);
          setStartDate(start);
          setEndDate(end);
          setDateRange({ start, end });
        } else if (option === 'Указать даты') {
          setShowDatePicker(true);
        } else {
          setShowDatePicker(false);
          setDateRange({ start: undefined, end: undefined });
        }
      };

    const handlePreviousDateRange = () => {
        if (currentIndex > 0) {
            const newRange = dateOptions[currentIndex - 1];
            handleSelectDateRange(newRange);
        }
    };

    const handleNextDateRange = () => {
        if (currentIndex < dateOptions.length - 1) {
            const newRange = dateOptions[currentIndex + 1];
            handleSelectDateRange(newRange);
        }
    };

    const handleDateChange = (dates: Date[] | null | any) => {
        if (Array.isArray(dates)) {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);

            if (start && end) {
                setDateRange({ start, end });
                setSelectedDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
                setIsDateOpen(false);
            }
        }
    };

    return (
        <div className="headerBox">
            <div className="headerBoxFilter">
            <div className="filter">
            <div className='filterSelect' onClick={() => setIsOpen(!isOpen)}>
                <span className={`filterSelectText ${selectedType !== 'Все типы' ? 'active' : ''}`}>
                    {selectedType}
                </span>
                {isOpen ? <ArrowUp width='18px' height='21px'/> : <ArrowDown width='18px' height='21px'/>}
            </div>
            {isOpen && (
                <div className="filterOptions">
                    {callTypeOptions.map((option, index) => (
                        <div key={index} className={`option ${option === 'Все типы' ? 'disabled' : ''}`} onClick={() => handleSelectType(option)}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
            </div>
            {selectedType !== "Все типы" && (
                <button onClick={handleReset} className="filterResetBtn">Сбросить фильтры <Close width='9' height='9' color='#ADBFDF'/></button>
            )}
            </div>

            <div className="dateFilter">
            <div className="dateRangeSelector">
                <ArrowLeft
                    onClick={handlePreviousDateRange}
                    className={`arrow ${currentIndex === 0 ? 'disabled' : ''}`}
                />
                <div className="dateDisplay" onClick={() => setIsDateOpen(!isDateOpen)}>
                    <Calendar/>
                    <span className="dateText" style={{ color: selectedDateRange !== 'Указать даты' ? '#002CFB' : '#122945' }}>
                        {selectedDateRange}
                    </span>
                </div>
                <ArrowRight
                    onClick={handleNextDateRange}
                    className={`arrow ${currentIndex === dateOptions.length - 1 ? 'disabled' : ''}`}
                />
            </div>
                {isDateOpen && (
                    <div className="dateFilterOptions">
                        {dateOptions.map((option, index) => (
                           <div
                           key={index}
                           className={`dateOptions ${['Месяц', 'Год'].includes(option) ? 'disabled' : ''} ${option === selectedDateRange ? 'active' : ''}`}
                           style={{
                               color: ['Месяц', 'Год'].includes(option) ? '#899CB1' : option === selectedDateRange ? '#002CFB' : '#122945'
                           }}
                           onClick={() => handleSelectDateRange(option)}
                       >
                           {option}
                       </div>
                        ))}
                    </div>
                )}
            </div>

            {showDatePicker && (
            <div className="customDateRangePicker">
                {isDateOpen && (
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                        />
                )}
            </div>
            )}
        </div>
    );
};