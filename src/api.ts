export const fetchCallList = async (
    dateStart: string,
    dateEnd: string,
    inOut: number | '' = ''
  ) => {
    const apiUrl = 'https://api.skilla.ru/mango/getList';
    
    const params = new URLSearchParams({
      date_start: dateStart,
      date_end: dateEnd,
      ...(inOut !== '' && { in_out: inOut.toString() }),
    });
  
    try {
      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer testtoken',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching call list:', error);
      return null;
    }
  };


  export const getRecord = async (
    record: number,
    partnershipId: any,
  ) => {
    const apiUrl = 'https://api.skilla.ru/mango/getRecord';
  
    const params = new URLSearchParams({
      record: record.toString(),
      partnership_id: partnershipId,
    });
  
    try {
      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer testtoken',
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
  
      return audioUrl;
    } catch (error) {
      console.error('Error fetching record:', error);
      return null;
    }
  };