import { useApp } from '../context/AppContext';
import { Icon } from './Icons';

export default function Toast() {
  const { toasts } = useApp();
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <Icon name={t.type === 'success' ? 'check' : 'x'} size={16} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
