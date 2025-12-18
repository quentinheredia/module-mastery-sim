import { useState, useEffect } from 'react';

const SESSION_KEY = 'community_session_id';

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
};
