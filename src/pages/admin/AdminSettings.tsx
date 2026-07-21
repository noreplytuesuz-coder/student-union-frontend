import { useLanguage } from '@/app/providers';
import { useSessionStore } from '@/entities/session';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card } from '@/shared/ui';

export function AdminSettings() {
  const { t } = useLanguage();
  const user = useSessionStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">{t('Settings')}</h2>

      <Card className="space-y-4 p-6">
        <div>
          <p className="text-sm text-muted-foreground">{t('Account')}</p>
          <p className="font-heading text-lg font-semibold">{user?.name ?? '—'}</p>
          <p className="text-sm text-muted-foreground">{user?.email ?? '—'}</p>
        </div>
        {user?.role && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('Role')}:</span>
            <Badge variant={user.role === 'user' ? 'primary' : 'neutral'}>{user.role}</Badge>
          </div>
        )}
      </Card>

      <Card className="space-y-2 p-6">
        <p className="font-heading font-semibold">{t('About')}</p>
        <p className="text-sm text-muted-foreground">
          {t('Student Union admin panel. Manage events, news, members and more from this console.')}
        </p>
      </Card>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          {t('Reload')}
        </Button>
      </div>
    </div>
  );
}
