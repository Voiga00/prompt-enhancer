import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ApiKeyInput() {
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  const { setApiKey } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key) return alert('Podaj API Key!');
    setApiKey(key);
    navigate('/prompt-form');
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1>🔑 Podaj swój OpenAI API Key</h1>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="API Key..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Dalej</button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  form: {
    backgroundColor: '#2d2d2d',
    padding: '40px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 20px rgba(0,0,0,0.4)',
    color: '#fff',
  },
  input: {
    width: '300px',
    padding: '10px',
    margin: '15px 0',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#10a37f',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
  },
};
