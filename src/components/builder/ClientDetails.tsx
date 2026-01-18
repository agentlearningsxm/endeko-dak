import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { useQuoteStore } from '../../stores/quoteStore';
import { Input } from '../ui';

export function ClientDetails() {
  const { t } = useTranslation();
  const { currentQuote, updateClientDetails } = useQuoteStore();
  const { clientDetails } = currentQuote;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground text-lg">{t('builder.clientDetails')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label={t('client.name')}
          value={clientDetails.name}
          onChange={(e) => updateClientDetails({ name: e.target.value })}
          placeholder="Jan Jansen"
        />

        <Input
          label={t('client.companyName')}
          value={clientDetails.companyName}
          onChange={(e) => updateClientDetails({ companyName: e.target.value })}
          placeholder="Bedrijfsnaam BV"
        />

        <Input
          label={t('client.address')}
          value={clientDetails.address}
          onChange={(e) => updateClientDetails({ address: e.target.value })}
          placeholder="Straatnaam 123"
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label={t('client.postalCode')}
            value={clientDetails.postalCode}
            onChange={(e) => updateClientDetails({ postalCode: e.target.value })}
            placeholder="1234 AB"
          />

          <Input
            label={t('client.city')}
            value={clientDetails.city}
            onChange={(e) => updateClientDetails({ city: e.target.value })}
            placeholder="Amsterdam"
          />
        </div>

        <Input
          label={t('client.email')}
          type="email"
          value={clientDetails.email}
          onChange={(e) => updateClientDetails({ email: e.target.value })}
          placeholder="email@voorbeeld.nl"
        />

        <Input
          label={t('client.phone')}
          type="tel"
          value={clientDetails.phone}
          onChange={(e) => updateClientDetails({ phone: e.target.value })}
          placeholder="06 12345678"
        />
      </div>
    </div>
  );
}
