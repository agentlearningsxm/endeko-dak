import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Trash2 } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { compressImage } from '../../lib/utils';
import { GlassPanel, Button, Input, Select } from '../ui';
import type { Language, QuoteTemplate } from '../../types/blocks';

export function SettingsModal() {
  const { t } = useTranslation();
  const { closeModal, addToast } = useUIStore();
  const { company, app, updateCompany, setLanguage, setVatRate, setDefaultTemplate, setLogo } =
    useSettingsStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 200,
        quality: 0.9,
      });
      setLogo(compressed);
      addToast('Logo geüpload', 'success');
    } catch {
      addToast('Fout bij uploaden', 'error');
    }
  };

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'nl', label: 'Nederlands' },
    { value: 'en', label: 'English' },
  ];

  const templateOptions: { value: QuoteTemplate; label: string }[] = [
    { value: 'modern', label: t('preview.templates.modern') },
    { value: 'classy', label: t('preview.templates.classy') },
    { value: 'technical', label: t('preview.templates.technical') },
    { value: 'compact', label: t('preview.templates.compact') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-dark light-mode:border-border-light">
          <h2 className="text-lg font-bold text-foreground">{t('settings.title')}</h2>
          <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="h-5 w-5 text-muted-dark light-mode:text-muted-light" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Company Settings */}
          <div>
            <h3 className="text-xs font-bold text-muted-dark light-mode:text-muted-light uppercase tracking-widest mb-4">
              {t('settings.company')}
            </h3>

            {/* Logo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/70 mb-2">
                {t('settings.logo')}
              </label>
              <div className="flex items-center gap-4">
                {company.logoBase64 ? (
                  <div className="relative">
                    <img
                      src={company.logoBase64}
                      alt="Logo"
                      className="h-16 object-contain bg-white/10 rounded p-2"
                    />
                    <button
                      onClick={() => setLogo(null)}
                      className="absolute -top-2 -right-2 p-1 bg-error rounded-full"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <Button variant="default" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    {t('settings.uploadLogo')}
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('settings.companyName')}
                value={company.companyName}
                onChange={(e) => updateCompany({ companyName: e.target.value })}
              />
              <Input
                label={t('settings.phone')}
                value={company.phone}
                onChange={(e) => updateCompany({ phone: e.target.value })}
              />
              <Input
                label={t('settings.address')}
                value={company.address}
                onChange={(e) => updateCompany({ address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label={t('settings.postalCode')}
                  value={company.postalCode}
                  onChange={(e) => updateCompany({ postalCode: e.target.value })}
                />
                <Input
                  label={t('settings.city')}
                  value={company.city}
                  onChange={(e) => updateCompany({ city: e.target.value })}
                />
              </div>
              <Input
                label={t('settings.email')}
                type="email"
                value={company.email}
                onChange={(e) => updateCompany({ email: e.target.value })}
              />
              <Input
                label={t('settings.website')}
                value={company.website}
                onChange={(e) => updateCompany({ website: e.target.value })}
              />
              <Input
                label={t('settings.kvkNumber')}
                value={company.kvkNumber}
                onChange={(e) => updateCompany({ kvkNumber: e.target.value })}
              />
              <Input
                label={t('settings.btwNumber')}
                value={company.btwNumber}
                onChange={(e) => updateCompany({ btwNumber: e.target.value })}
              />
              <Input
                label={t('settings.bankAccount')}
                value={company.bankAccount}
                onChange={(e) => updateCompany({ bankAccount: e.target.value })}
                className="col-span-2"
              />
            </div>
          </div>

          {/* App Settings */}
          <div>
            <h3 className="text-xs font-bold text-muted-dark light-mode:text-muted-light uppercase tracking-widest mb-4">
              {t('settings.app')}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label={t('settings.language')}
                value={app.language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                options={languageOptions}
              />
              <Input
                label={`${t('settings.vatRate')} (%)`}
                type="number"
                value={app.vatRate}
                onChange={(e) => setVatRate(parseInt(e.target.value) || 21)}
              />
              <Select
                label={t('settings.defaultTemplate')}
                value={app.defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value as QuoteTemplate)}
                options={templateOptions}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-white/[0.1]">
          <Button variant="default" onClick={closeModal}>
            {t('actions.close')}
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
